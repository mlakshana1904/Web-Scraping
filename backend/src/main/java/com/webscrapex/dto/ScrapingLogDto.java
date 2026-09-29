package com.webscrapex.dto;

import java.time.ZonedDateTime;

public class ScrapingLogDto {
    private Long id;
    private Long jobId;
    private String level;
    private String message;
    private ZonedDateTime timestamp;

    public ScrapingLogDto() {}

    public ScrapingLogDto(Long id, Long jobId, String level, String message, ZonedDateTime timestamp) {
        this.id = id;
        this.jobId = jobId;
        this.level = level;
        this.message = message;
        this.timestamp = timestamp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public ZonedDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(ZonedDateTime timestamp) { this.timestamp = timestamp; }
}
