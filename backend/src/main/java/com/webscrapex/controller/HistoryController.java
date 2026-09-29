package com.webscrapex.controller;

import com.webscrapex.dto.ScrapingJobDto;
import com.webscrapex.dto.ScrapingLogDto;
import com.webscrapex.entity.ScrapingJob;
import com.webscrapex.entity.ScrapingLog;
import com.webscrapex.entity.Source;
import com.webscrapex.exception.ResourceNotFoundException;
import com.webscrapex.repository.ScrapingJobRepository;
import com.webscrapex.repository.ScrapingLogRepository;
import com.webscrapex.repository.SourceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final ScrapingJobRepository jobRepository;
    private final ScrapingLogRepository logRepository;
    private final SourceRepository sourceRepository;

    public HistoryController(ScrapingJobRepository jobRepository,
                             ScrapingLogRepository logRepository,
                             SourceRepository sourceRepository) {
        this.jobRepository = jobRepository;
        this.logRepository = logRepository;
        this.sourceRepository = sourceRepository;
    }

    @GetMapping
    public ResponseEntity<Page<ScrapingJobDto>> getJobHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ScrapingJob> jobs = jobRepository.findAllByOrderByStartedAtDesc(pageable);
        Page<ScrapingJobDto> dtos = jobs.map(this::convertJobToDto);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScrapingJobDto> getJobById(@PathVariable Long id) {
        ScrapingJob job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scraping job history entry not found with ID: " + id));

        ScrapingJobDto dto = convertJobToDto(job);

        // Include detailed audit log lines
        List<ScrapingLog> logs = logRepository.findByJobIdOrderByTimestampAsc(id);
        List<ScrapingLogDto> logDtos = logs.stream()
                .map(l -> new ScrapingLogDto(l.getId(), l.getJobId(), l.getLevel(), l.getMessage(), l.getTimestamp()))
                .collect(Collectors.toList());
        dto.setLogs(logDtos);

        return ResponseEntity.ok(dto);
    }

    private ScrapingJobDto convertJobToDto(ScrapingJob job) {
        ScrapingJobDto dto = new ScrapingJobDto();
        dto.setId(job.getId());
        dto.setSourceId(job.getSourceId());
        dto.setStatus(job.getStatus());
        dto.setStartedAt(job.getStartedAt());
        dto.setCompletedAt(job.getCompletedAt());
        dto.setRecordsFound(job.getRecordsFound());
        dto.setRecordsSaved(job.getRecordsSaved());
        dto.setErrorMessage(job.getErrorMessage());

        if (job.getStartedAt() != null && job.getCompletedAt() != null) {
            dto.setDurationMs(Duration.between(job.getStartedAt(), job.getCompletedAt()).toMillis());
        }

        if (job.getSourceId() != null) {
            sourceRepository.findById(job.getSourceId()).ifPresent(src -> {
                dto.setSourceName(src.getName());
                dto.setSourceUrl(src.getUrl());
                dto.setContentType(src.getContentType());
            });
        } else {
            dto.setSourceName("Direct Web Scrape");
            dto.setContentType("COMPLETE_PAGE");
        }

        return dto;
    }
}
