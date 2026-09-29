package com.webscrapex.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webscrapex.dto.ExtractedItemDto;
import com.webscrapex.dto.ScrapePreviewDto;
import com.webscrapex.dto.ScrapeRequestDto;
import com.webscrapex.entity.ScrapedData;
import com.webscrapex.entity.ScrapingJob;
import com.webscrapex.entity.ScrapingLog;
import com.webscrapex.entity.Source;
import com.webscrapex.repository.ScrapedDataRepository;
import com.webscrapex.repository.ScrapingJobRepository;
import com.webscrapex.repository.ScrapingLogRepository;
import com.webscrapex.repository.SourceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScrapingService {

    private static final Logger log = LoggerFactory.getLogger(ScrapingService.class);

    private final ContentExtractionService contentExtractionService;
    private final DataCleaningService dataCleaningService;
    private final DuplicateDetectionService duplicateDetectionService;
    private final ScrapedDataRepository scrapedDataRepository;
    private final ScrapingJobRepository scrapingJobRepository;
    private final ScrapingLogRepository scrapingLogRepository;
    private final SourceRepository sourceRepository;
    private final ObjectMapper objectMapper;

    public ScrapingService(ContentExtractionService contentExtractionService,
                           DataCleaningService dataCleaningService,
                           DuplicateDetectionService duplicateDetectionService,
                           ScrapedDataRepository scrapedDataRepository,
                           ScrapingJobRepository scrapingJobRepository,
                           ScrapingLogRepository scrapingLogRepository,
                           SourceRepository sourceRepository,
                           ObjectMapper objectMapper) {
        this.contentExtractionService = contentExtractionService;
        this.dataCleaningService = dataCleaningService;
        this.duplicateDetectionService = duplicateDetectionService;
        this.scrapedDataRepository = scrapedDataRepository;
        this.scrapingJobRepository = scrapingJobRepository;
        this.scrapingLogRepository = scrapingLogRepository;
        this.sourceRepository = sourceRepository;
        this.objectMapper = objectMapper;
    }

    public ScrapePreviewDto previewScrape(ScrapeRequestDto request) {
        ScrapePreviewDto preview = contentExtractionService.extract(request);

        List<ExtractedItemDto> items = preview.getItems();
        if (request.isCleanData()) {
            items = dataCleaningService.cleanItems(items);
        }

        DuplicateDetectionService.DeduplicationResult dedupResult = duplicateDetectionService.filterDuplicates(items);
        preview.setItems(items);
        preview.setDuplicatesFound(dedupResult.getDuplicatesRemoved());
        preview.setCleanRecords(dedupResult.getUniqueItems().size());

        if (request.isSaveToDb()) {
            saveExtractedData(request, preview, dedupResult.getUniqueItems());
        }

        return preview;
    }

    @Transactional
    public ScrapingJob executeScrapeJob(ScrapeRequestDto request) {
        ScrapingJob job = new ScrapingJob();
        job.setSourceId(request.getSourceId());
        job.setStatus("RUNNING");
        job.setStartedAt(ZonedDateTime.now());
        job = scrapingJobRepository.save(job);

        addLog(job.getId(), "INFO", "Initiating web scraping task for URL: " + request.getUrl());

        try {
            addLog(job.getId(), "INFO", "Fetching web page and parsing HTML DOM...");
            ScrapePreviewDto preview = contentExtractionService.extract(request);
            addLog(job.getId(), "INFO", "Page fetched successfully. Response time: " + preview.getResponseTimeMs() + "ms, Status: " + preview.getHttpStatus());

            List<ExtractedItemDto> rawItems = preview.getItems();
            int totalFound = rawItems.size();
            addLog(job.getId(), "INFO", "Extracted " + totalFound + " raw items from target DOM.");

            List<ExtractedItemDto> cleanedItems = request.isCleanData() ? dataCleaningService.cleanItems(rawItems) : rawItems;
            if (request.isCleanData()) {
                addLog(job.getId(), "INFO", "Data cleaning complete. Standardized whitespace and line breaks.");
            }

            DuplicateDetectionService.DeduplicationResult dedup = duplicateDetectionService.filterDuplicates(cleanedItems);
            addLog(job.getId(), "INFO", "Deduplication complete. Removed " + dedup.getDuplicatesRemoved() + " duplicate entries.");

            List<ScrapedData> savedDataEntities = saveExtractedData(request, preview, dedup.getUniqueItems());
            int savedCount = savedDataEntities.size();

            job.setStatus("SUCCESS");
            job.setCompletedAt(ZonedDateTime.now());
            job.setRecordsFound(totalFound);
            job.setRecordsSaved(savedCount);
            scrapingJobRepository.save(job);

            addLog(job.getId(), "INFO", "Scraping job completed successfully! Saved " + savedCount + " new records into database.");

            // Update source stats if associated
            if (request.getSourceId() != null) {
                sourceRepository.findById(request.getSourceId()).ifPresent(src -> {
                    src.setUpdatedAt(ZonedDateTime.now());
                    sourceRepository.save(src);
                });
            }

            return job;

        } catch (Exception e) {
            log.error("Scraping job failed for URL {}", request.getUrl(), e);
            job.setStatus("FAILED");
            job.setCompletedAt(ZonedDateTime.now());
            job.setErrorMessage(e.getMessage());
            scrapingJobRepository.save(job);

            addLog(job.getId(), "ERROR", "Scraping failed: " + e.getMessage());
            return job;
        }
    }

    private List<ScrapedData> saveExtractedData(ScrapeRequestDto request, ScrapePreviewDto preview, List<ExtractedItemDto> uniqueItems) {
        List<ScrapedData> entities = new ArrayList<>();
        for (ExtractedItemDto item : uniqueItems) {
            ScrapedData data = new ScrapedData();
            data.setSourceId(request.getSourceId());
            data.setTitle(item.getTitle());
            data.setContent(item.getContent());
            data.setContentType(item.getContentType() != null ? item.getContentType() : request.getMode());
            data.setAuthor(item.getAuthor());
            data.setPublishedDate(item.getPublishedDate());
            data.setSourceUrl(item.getSourceUrl());
            data.setContentHash(item.getContentHash());
            data.setScrapedAt(ZonedDateTime.now());

            try {
                if (item.getMetadata() != null) {
                    data.setMetadata(objectMapper.writeValueAsString(item.getMetadata()));
                } else {
                    data.setMetadata(objectMapper.writeValueAsString(preview.getMetadata()));
                }
            } catch (Exception e) {
                data.setMetadata("{}");
            }

            entities.add(data);
        }

        if (!entities.isEmpty()) {
            return scrapedDataRepository.saveAll(entities);
        }
        return entities;
    }

    private void addLog(Long jobId, String level, String message) {
        ScrapingLog logEntity = new ScrapingLog(jobId, level, message);
        scrapingLogRepository.save(logEntity);
    }
}
