package com.webscrapex.dto;

import java.util.List;
import java.util.Map;

public class ScrapePreviewDto {

    private String pageTitle;
    private String sourceUrl;
    private int httpStatus;
    private long responseTimeMs;
    private String contentSize;
    private boolean jsRequired;
    private String warningMessage;

    private int recordsFound;
    private int duplicatesFound;
    private int cleanRecords;

    private List<ExtractedItemDto> items;
    private List<Map<String, String>> links;
    private List<List<String>> tables;
    private List<Map<String, String>> images;
    private Map<String, Object> metadata;

    public ScrapePreviewDto() {}

    public String getPageTitle() { return pageTitle; }
    public void setPageTitle(String pageTitle) { this.pageTitle = pageTitle; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public int getHttpStatus() { return httpStatus; }
    public void setHttpStatus(int httpStatus) { this.httpStatus = httpStatus; }

    public long getResponseTimeMs() { return responseTimeMs; }
    public void setResponseTimeMs(long responseTimeMs) { this.responseTimeMs = responseTimeMs; }

    public String getContentSize() { return contentSize; }
    public void setContentSize(String contentSize) { this.contentSize = contentSize; }

    public boolean isJsRequired() { return jsRequired; }
    public void setJsRequired(boolean jsRequired) { this.jsRequired = jsRequired; }

    public String getWarningMessage() { return warningMessage; }
    public void setWarningMessage(String warningMessage) { this.warningMessage = warningMessage; }

    public int getRecordsFound() { return recordsFound; }
    public void setRecordsFound(int recordsFound) { this.recordsFound = recordsFound; }

    public int getDuplicatesFound() { return duplicatesFound; }
    public void setDuplicatesFound(int duplicatesFound) { this.duplicatesFound = duplicatesFound; }

    public int getCleanRecords() { return cleanRecords; }
    public void setCleanRecords(int cleanRecords) { this.cleanRecords = cleanRecords; }

    public List<ExtractedItemDto> getItems() { return items; }
    public void setItems(List<ExtractedItemDto> items) { this.items = items; }

    public List<Map<String, String>> getLinks() { return links; }
    public void setLinks(List<Map<String, String>> links) { this.links = links; }

    public List<List<String>> getTables() { return tables; }
    public void setTables(List<List<String>> tables) { this.tables = tables; }

    public List<Map<String, String>> getImages() { return images; }
    public void setImages(List<Map<String, String>> images) { this.images = images; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}
