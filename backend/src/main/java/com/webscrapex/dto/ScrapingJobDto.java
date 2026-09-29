package com.webscrapex.dto;

import java.time.ZonedDateTime;
import java.util.List;

public class ScrapingJobDto {
    private Long id;
    private Long sourceId;
    private String sourceName;
    private String sourceUrl;
    private String contentType;
    private String status;
    private ZonedDateTime startedAt;
    private ZonedDateTime completedAt;
    private long durationMs;
    private Integer recordsFound;
    private Integer recordsSaved;
    private String errorMessage;
    private List<ScrapingLogDto> logs;

    public ScrapingJobDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public ZonedDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(ZonedDateTime startedAt) { this.startedAt = startedAt; }

    public ZonedDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(ZonedDateTime completedAt) { this.completedAt = completedAt; }

    public long getDurationMs() { return durationMs; }
    public void setDurationMs(long durationMs) { this.durationMs = durationMs; }

    public Integer getRecordsFound() { return recordsFound; }
    public void setRecordsFound(Integer recordsFound) { this.recordsFound = recordsFound; }

    public Integer getRecordsSaved() { return recordsSaved; }
    public void setRecordsSaved(Integer recordsSaved) { this.recordsSaved = recordsSaved; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public List<ScrapingLogDto> getLogs() { return logs; }
    public void setLogs(List<ScrapingLogDto> logs) { this.logs = logs; }
}
