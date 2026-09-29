package com.webscrapex.dto;

import java.time.ZonedDateTime;

public class ScrapedDataDto {
    private Long id;
    private Long sourceId;
    private String sourceName;
    private String title;
    private String content;
    private String contentType;
    private String author;
    private String publishedDate;
    private String sourceUrl;
    private String metadata;
    private String contentHash;
    private ZonedDateTime scrapedAt;
    private ZonedDateTime createdAt;

    public ScrapedDataDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

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
