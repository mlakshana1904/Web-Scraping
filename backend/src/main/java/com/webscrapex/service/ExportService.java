package com.webscrapex.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.webscrapex.dto.ExportRequestDto;
import com.webscrapex.entity.ScrapedData;
import com.webscrapex.repository.ScrapedDataRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExportService {

    private final ScrapedDataRepository scrapedDataRepository;
    private final ObjectMapper objectMapper;

    public ExportService(ScrapedDataRepository scrapedDataRepository, ObjectMapper objectMapper) {
        this.scrapedDataRepository = scrapedDataRepository;
        this.objectMapper = objectMapper;
    }

    public byte[] generateCsv(ExportRequestDto request) {
        List<ScrapedData> dataList = fetchFilterData(request);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            // Write CSV Header
            writer.println("ID,Title,Content Type,Author,Published Date,Source URL,Content,Scraped At");

            for (ScrapedData data : dataList) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        data.getId(),
                        escapeCsv(data.getTitle()),
                        escapeCsv(data.getContentType()),
                        escapeCsv(data.getAuthor()),
                        escapeCsv(data.getPublishedDate()),
                        escapeCsv(data.getSourceUrl()),
                        escapeCsv(data.getContent()),
                        data.getScrapedAt() != null ? data.getScrapedAt().toString() : ""
                );
            }
        }
        return out.toByteArray();
    }

    public byte[] generateJson(ExportRequestDto request) {
        List<ScrapedData> dataList = fetchFilterData(request);
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(dataList);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JSON export", e);
        }
    }

    private List<ScrapedData> fetchFilterData(ExportRequestDto request) {
        if (request.getDataIds() != null && !request.getDataIds().isEmpty()) {
            return scrapedDataRepository.findAllById(request.getDataIds());
        }

        List<ScrapedData> all = scrapedDataRepository.findAll();
        return all.stream()
                .filter(d -> request.getSourceId() == null || (d.getSourceId() != null && d.getSourceId().equals(request.getSourceId())))
                .filter(d -> request.getContentType() == null || request.getContentType().isBlank() || d.getContentType().equalsIgnoreCase(request.getContentType()))
                .filter(d -> request.getStartDate() == null || (d.getScrapedAt() != null && !d.getScrapedAt().isBefore(request.getStartDate())))
                .filter(d -> request.getEndDate() == null || (d.getScrapedAt() != null && !d.getScrapedAt().isAfter(request.getEndDate())))
                .collect(Collectors.toList());
    }

    private String escapeCsv(String input) {
        if (input == null) return "";
        return input.replace("\"", "\"\"").replace("\n", " ").replace("\r", " ");
    }
}
