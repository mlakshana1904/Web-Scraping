package com.webscrapex.dto;

import java.time.ZonedDateTime;

public class ScheduleDto {
    private Long id;
    private Long sourceId;
    private String sourceName;
    private String sourceUrl;
    private String frequency;
    private String cronExpression;
    private Boolean active;
    private ZonedDateTime nextRun;
    private ZonedDateTime lastRun;
    private ZonedDateTime createdAt;

    public ScheduleDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getCronExpression() { return cronExpression; }
    public void setCronExpression(String cronExpression) { this.cronExpression = cronExpression; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public ZonedDateTime getNextRun() { return nextRun; }
    public void setNextRun(ZonedDateTime nextRun) { this.nextRun = nextRun; }

    public ZonedDateTime getLastRun() { return lastRun; }
    public void setLastRun(ZonedDateTime lastRun) { this.lastRun = lastRun; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
