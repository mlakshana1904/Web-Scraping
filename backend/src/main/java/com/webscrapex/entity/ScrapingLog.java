package com.webscrapex.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "scraping_logs")
public class ScrapingLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    @Column(nullable = false, length = 20)
    private String level; // INFO, WARN, ERROR

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private ZonedDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) timestamp = ZonedDateTime.now();
    }

    public ScrapingLog() {}

    public ScrapingLog(Long jobId, String level, String message) {
        this.jobId = jobId;
        this.level = level;
        this.message = message;
        this.timestamp = ZonedDateTime.now();
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
