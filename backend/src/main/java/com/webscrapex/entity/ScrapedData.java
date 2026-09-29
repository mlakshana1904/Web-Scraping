package com.webscrapex.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "scraped_data")
public class ScrapedData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_id")
    private Long sourceId;

    @Column(length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "content_type")
    private String contentType;

    private String author;

    @Column(name = "published_date")
    private String publishedDate;

    @Column(name = "source_url", nullable = false, columnDefinition = "TEXT")
    private String sourceUrl;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "content_hash", nullable = false, length = 64)
    private String contentHash;

    @Column(name = "scraped_at")
    private ZonedDateTime scrapedAt;

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (scrapedAt == null) scrapedAt = ZonedDateTime.now();
        createdAt = ZonedDateTime.now();
    }

    public ScrapedData() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getPublishedDate() { return publishedDate; }
    public void setPublishedDate(String publishedDate) { this.publishedDate = publishedDate; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public String getContentHash() { return contentHash; }
    public void setContentHash(String contentHash) { this.contentHash = contentHash; }

    public ZonedDateTime getScrapedAt() { return scrapedAt; }
    public void setScrapedAt(ZonedDateTime scrapedAt) { this.scrapedAt = scrapedAt; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
