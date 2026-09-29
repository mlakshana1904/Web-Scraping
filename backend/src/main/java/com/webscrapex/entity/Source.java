package com.webscrapex.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "sources")
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "content_type")
    private String contentType = "COMPLETE_PAGE";

    @Column(name = "css_selector", columnDefinition = "TEXT")
    private String cssSelector;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
        updatedAt = ZonedDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now();
    }

    public Source() {}

    public Source(String name, String url, String description, String contentType, String cssSelector, Boolean active) {
        this.name = name;
        this.url = url;
        this.description = description;
        this.contentType = contentType;
        this.cssSelector = cssSelector;
        this.active = active != null ? active : true;
    }

    // Getters and Setters
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
}
