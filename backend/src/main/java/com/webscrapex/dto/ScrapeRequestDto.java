package com.webscrapex.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class ScrapeRequestDto {

    @NotBlank(message = "URL is required")
    private String url;

    private Long sourceId;

    // Mode: "COMPLETE_PAGE" or "SPECIFIC_CONTENT"
    private String mode = "COMPLETE_PAGE";

    // Specific Content check selections
    private boolean extractTitle = true;
    private boolean extractHeadings = true;
    private boolean extractParagraphs = true;
    private boolean extractArticle = true;
    private boolean extractLinks = false;
    private boolean extractTables = false;
    private boolean extractImages = false;
    private boolean extractMetaDescription = true;
    private boolean extractAuthor = true;
    private boolean extractPublishedDate = true;

    // Custom CSS extraction rules
    private List<CustomRuleDto> customRules;

    // Data cleaning flag
    private boolean cleanData = true;

    // Save to DB immediately or preview only
    private boolean saveToDb = false;

    public ScrapeRequestDto() {}

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public boolean isExtractTitle() { return extractTitle; }
    public void setExtractTitle(boolean extractTitle) { this.extractTitle = extractTitle; }

    public boolean isExtractHeadings() { return extractHeadings; }
    public void setExtractHeadings(boolean extractHeadings) { this.extractHeadings = extractHeadings; }

    public boolean isExtractParagraphs() { return extractParagraphs; }
    public void setExtractParagraphs(boolean extractParagraphs) { this.extractParagraphs = extractParagraphs; }

    public boolean isExtractArticle() { return extractArticle; }
    public void setExtractArticle(boolean extractArticle) { this.extractArticle = extractArticle; }

    public boolean isExtractLinks() { return extractLinks; }
    public void setExtractLinks(boolean extractLinks) { this.extractLinks = extractLinks; }

    public boolean isExtractTables() { return extractTables; }
    public void setExtractTables(boolean extractTables) { this.extractTables = extractTables; }

    public boolean isExtractImages() { return extractImages; }
    public void setExtractImages(boolean extractImages) { this.extractImages = extractImages; }

    public boolean isExtractMetaDescription() { return extractMetaDescription; }
    public void setExtractMetaDescription(boolean extractMetaDescription) { this.extractMetaDescription = extractMetaDescription; }

    public boolean isExtractAuthor() { return extractAuthor; }
    public void setExtractAuthor(boolean extractAuthor) { this.extractAuthor = extractAuthor; }

    public boolean isExtractPublishedDate() { return extractPublishedDate; }
    public void setExtractPublishedDate(boolean extractPublishedDate) { this.extractPublishedDate = extractPublishedDate; }

    public List<CustomRuleDto> getCustomRules() { return customRules; }
    public void setCustomRules(List<CustomRuleDto> customRules) { this.customRules = customRules; }

    public boolean isCleanData() { return cleanData; }
    public void setCleanData(boolean cleanData) { this.cleanData = cleanData; }

    public boolean isSaveToDb() { return saveToDb; }
    public void setSaveToDb(boolean saveToDb) { this.saveToDb = saveToDb; }
}
