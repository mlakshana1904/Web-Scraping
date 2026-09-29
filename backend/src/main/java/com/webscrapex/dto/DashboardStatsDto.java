package com.webscrapex.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalSources;
    private long totalRecords;
    private long successfulScrapes;
    private long failedScrapes;
    private long activeSchedules;

    private List<Map<String, Object>> activityOverTime;
    private Map<String, Long> statusDistribution;
    private List<Map<String, Object>> recordsBySource;
    private Map<String, Long> contentTypeDistribution;

    private List<ScrapingJobDto> recentJobs;

    public DashboardStatsDto() {}

    public long getTotalSources() { return totalSources; }
    public void setTotalSources(long totalSources) { this.totalSources = totalSources; }

    public long getTotalRecords() { return totalRecords; }
    public void setTotalRecords(long totalRecords) { this.totalRecords = totalRecords; }

    public long getSuccessfulScrapes() { return successfulScrapes; }
    public void setSuccessfulScrapes(long successfulScrapes) { this.successfulScrapes = successfulScrapes; }

    public long getFailedScrapes() { return failedScrapes; }
    public void setFailedScrapes(long failedScrapes) { this.failedScrapes = failedScrapes; }

    public long getActiveSchedules() { return activeSchedules; }
    public void setActiveSchedules(long activeSchedules) { this.activeSchedules = activeSchedules; }

    public List<Map<String, Object>> getActivityOverTime() { return activityOverTime; }
    public void setActivityOverTime(List<Map<String, Object>> activityOverTime) { this.activityOverTime = activityOverTime; }

    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }

    public List<Map<String, Object>> getRecordsBySource() { return recordsBySource; }
    public void setRecordsBySource(List<Map<String, Object>> recordsBySource) { this.recordsBySource = recordsBySource; }

    public Map<String, Long> getContentTypeDistribution() { return contentTypeDistribution; }
    public void setContentTypeDistribution(Map<String, Long> contentTypeDistribution) { this.contentTypeDistribution = contentTypeDistribution; }

    public List<ScrapingJobDto> getRecentJobs() { return recentJobs; }
    public void setRecentJobs(List<ScrapingJobDto> recentJobs) { this.recentJobs = recentJobs; }
}
