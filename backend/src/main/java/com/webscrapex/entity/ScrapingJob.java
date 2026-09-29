package com.webscrapex.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "scraping_jobs")
public class ScrapingJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_id")
    private Long sourceId;

    @Column(nullable = false, length = 50)
    private String status = "RUNNING"; // SUCCESS, RUNNING, FAILED, SCHEDULED

    @Column(name = "started_at")
    private ZonedDateTime startedAt;

    @Column(name = "completed_at")
    private ZonedDateTime completedAt;

    @Column(name = "records_found")
    private Integer recordsFound = 0;

    @Column(name = "records_saved")
    private Integer recordsSaved = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @PrePersist
    protected void onCreate() {
        if (startedAt == null) startedAt = ZonedDateTime.now();
    }

    public ScrapingJob() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public ZonedDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(ZonedDateTime startedAt) { this.startedAt = startedAt; }

    public ZonedDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(ZonedDateTime completedAt) { this.completedAt = completedAt; }

    public Integer getRecordsFound() { return recordsFound; }
    public void setRecordsFound(Integer recordsFound) { this.recordsFound = recordsFound; }

    public Integer getRecordsSaved() { return recordsSaved; }
    public void setRecordsSaved(Integer recordsSaved) { this.recordsSaved = recordsSaved; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
