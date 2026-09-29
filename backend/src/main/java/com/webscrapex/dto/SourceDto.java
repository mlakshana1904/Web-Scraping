package com.webscrapex.dto;

import java.time.ZonedDateTime;

public class SourceDto {
    private Long id;
    private String name;
    private String url;
    private String description;
    private String contentType;
    private String cssSelector;
    private Boolean active;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private long totalRecords;
    private ZonedDateTime lastScrapedAt;

    public SourceDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public String getCssSelector() { return cssSelector; }
    public void setCssSelector(String cssSelector) { this.cssSelector = cssSelector; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }

    public long getTotalRecords() { return totalRecords; }
    public void setTotalRecords(long totalRecords) { this.totalRecords = totalRecords; }

    public ZonedDateTime getLastScrapedAt() { return lastScrapedAt; }
    public void setLastScrapedAt(ZonedDateTime lastScrapedAt) { this.lastScrapedAt = lastScrapedAt; }
}
