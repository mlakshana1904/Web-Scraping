package com.webscrapex.service;

import com.webscrapex.dto.DashboardStatsDto;
import com.webscrapex.dto.ScrapingJobDto;
import com.webscrapex.entity.ScrapingJob;
import com.webscrapex.entity.Source;
import com.webscrapex.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final SourceRepository sourceRepository;
    private final ScrapedDataRepository scrapedDataRepository;
    private final ScrapingJobRepository scrapingJobRepository;
    private final ScheduleRepository scheduleRepository;
    private final ScrapingLogRepository scrapingLogRepository;

    public DashboardService(SourceRepository sourceRepository,
                            ScrapedDataRepository scrapedDataRepository,
                            ScrapingJobRepository scrapingJobRepository,
                            ScheduleRepository scheduleRepository,
                            ScrapingLogRepository scrapingLogRepository) {
        this.sourceRepository = sourceRepository;
        this.scrapedDataRepository = scrapedDataRepository;
        this.scrapingJobRepository = scrapingJobRepository;
        this.scheduleRepository = scheduleRepository;
        this.scrapingLogRepository = scrapingLogRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalSources(sourceRepository.count());
        stats.setTotalRecords(scrapedDataRepository.count());
        stats.setSuccessfulScrapes(scrapingJobRepository.countByStatus("SUCCESS"));
        stats.setFailedScrapes(scrapingJobRepository.countByStatus("FAILED"));
        stats.setActiveSchedules(scheduleRepository.findByActiveTrue().size());

        // Recent Jobs
        List<ScrapingJob> recentJobsList = scrapingJobRepository.findAllByOrderByStartedAtDesc(PageRequest.of(0, 10)).getContent();
        List<ScrapingJobDto> recentJobDtos = recentJobsList.stream().map(this::convertJobToDto).collect(Collectors.toList());
        stats.setRecentJobs(recentJobDtos);

        // Content Type Distribution
        Map<String, Long> typeMap = new HashMap<>();
        List<Object[]> rawTypes = scrapedDataRepository.countByContentTypeGroup();
        for (Object[] row : rawTypes) {
            String type = (String) row[0];
            Long count = (Long) row[1];
            typeMap.put(type != null ? type : "OTHER", count);
        }
        stats.setContentTypeDistribution(typeMap);

        // Status Distribution
        Map<String, Long> statusMap = new HashMap<>();
        List<Object[]> rawStatus = scrapingJobRepository.countByStatusGroup();
        for (Object[] row : rawStatus) {
            String status = (String) row[0];
            Long count = (Long) row[1];
            statusMap.put(status, count);
        }
        stats.setStatusDistribution(statusMap);

        // Records By Source
        List<Map<String, Object>> sourceRecordsList = new ArrayList<>();
        List<Source> sources = sourceRepository.findAll();
        for (Source s : sources) {
            long count = scrapedDataRepository.findBySourceId(s.getId()).size();
            Map<String, Object> map = new HashMap<>();
            map.put("sourceName", s.getName());
            map.put("recordCount", count);
            sourceRecordsList.add(map);
        }
        stats.setRecordsBySource(sourceRecordsList);

        // Activity Over Time (mock/summary trend for chart display)
        List<Map<String, Object>> activityTime = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        int[] successTrend = {12, 19, 15, 25, 30, 22, 28};
        int[] failedTrend = {1, 2, 0, 1, 3, 0, 1};
        for (int i = 0; i < days.length; i++) {
            Map<String, Object> point = new HashMap<>();
            point.put("day", days[i]);
            point.put("successful", successTrend[i]);
            point.put("failed", failedTrend[i]);
            activityTime.add(point);
        }
        stats.setActivityOverTime(activityTime);

        return stats;
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
            dto.setDurationMs(java.time.Duration.between(job.getStartedAt(), job.getCompletedAt()).toMillis());
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
