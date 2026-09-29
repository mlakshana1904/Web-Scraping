package com.webscrapex.dto;

public class CustomRuleDto {
    private String fieldName;
    private String cssSelector;

    public CustomRuleDto() {}

    public CustomRuleDto(String fieldName, String cssSelector) {
        this.fieldName = fieldName;
        this.cssSelector = cssSelector;
    }

    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }

    public String getCssSelector() { return cssSelector; }
    public void setCssSelector(String cssSelector) { this.cssSelector = cssSelector; }
}
