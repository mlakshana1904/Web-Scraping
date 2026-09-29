package com.webscrapex.controller;

import com.webscrapex.dto.ExportRequestDto;
import com.webscrapex.service.ExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final ExportService exportService;

    public ExportController(ExportService exportService) {
        this.exportService = exportService;
    }

    @GetMapping("/csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) Long sourceId,
            @RequestParam(required = false) String contentType) {

        ExportRequestDto request = new ExportRequestDto();
        request.setSourceId(sourceId);
        request.setContentType(contentType);
        request.setFormat("CSV");

        byte[] csvData = exportService.generateCsv(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"webscrapex_export.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @GetMapping("/json")
    public ResponseEntity<byte[]> exportJson(
            @RequestParam(required = false) Long sourceId,
            @RequestParam(required = false) String contentType) {

        ExportRequestDto request = new ExportRequestDto();
        request.setSourceId(sourceId);
        request.setContentType(contentType);
        request.setFormat("JSON");

        byte[] jsonData = exportService.generateJson(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"webscrapex_export.json\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonData);
    }

    @PostMapping
    public ResponseEntity<byte[]> exportCustom(@RequestBody ExportRequestDto request) {
        if ("JSON".equalsIgnoreCase(request.getFormat())) {
            byte[] jsonData = exportService.generateJson(request);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"webscrapex_export.json\"")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(jsonData);
        } else {
            byte[] csvData = exportService.generateCsv(request);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"webscrapex_export.csv\"")
                    .contentType(MediaType.parseMediaType("text/csv"))
                    .body(csvData);
        }
    }
}
