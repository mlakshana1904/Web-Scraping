package com.webscrapex.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @Column(nullable = false, length = 50)
    private String frequency; // ONCE, HOURLY, EVERY_6_HOURS, DAILY, WEEKLY, CUSTOM

    @Column(name = "cron_expression", length = 100)
    private String cronExpression;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "next_run")
    private ZonedDateTime nextRun;

    @Column(name = "last_run")
    private ZonedDateTime lastRun;

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
    }

    public Schedule() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

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
