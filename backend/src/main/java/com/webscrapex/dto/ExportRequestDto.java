package com.webscrapex.dto;

import java.time.ZonedDateTime;
import java.util.List;

public class ExportRequestDto {
    private String format = "CSV"; // CSV or JSON
    private Long sourceId;
    private String contentType;
    private List<Long> dataIds;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;

    public ExportRequestDto() {}

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public List<Long> getDataIds() { return dataIds; }
    public void setDataIds(List<Long> dataIds) { this.dataIds = dataIds; }

    public ZonedDateTime getStartDate() { return startDate; }
    public void setStartDate(ZonedDateTime startDate) { this.startDate = startDate; }

    public ZonedDateTime getEndDate() { return endDate; }
    public void setEndDate(ZonedDateTime endDate) { this.endDate = endDate; }
}
