package com.webscrapex.controller;

import com.webscrapex.dto.SourceDto;
import com.webscrapex.dto.ScrapeRequestDto;
import com.webscrapex.entity.ScrapingJob;
import com.webscrapex.service.ScrapingService;
import com.webscrapex.service.SourceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sources")
public class SourceController {

    private final SourceService sourceService;
    private final ScrapingService scrapingService;

    public SourceController(SourceService sourceService, ScrapingService scrapingService) {
        this.sourceService = sourceService;
        this.scrapingService = scrapingService;
    }

    @GetMapping
    public ResponseEntity<List<SourceDto>> getAllSources() {
        return ResponseEntity.ok(sourceService.getAllSources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SourceDto> getSourceById(@PathVariable Long id) {
        return ResponseEntity.ok(sourceService.getSourceById(id));
    }

    @PostMapping
    public ResponseEntity<SourceDto> createSource(@Valid @RequestBody SourceDto dto) {
        SourceDto created = sourceService.createSource(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SourceDto> updateSource(@PathVariable Long id, @RequestBody SourceDto dto) {
        SourceDto updated = sourceService.updateSource(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSource(@PathVariable Long id) {
        sourceService.deleteSource(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/scrape")
    public ResponseEntity<ScrapingJob> triggerSourceScrape(@PathVariable Long id) {
        SourceDto source = sourceService.getSourceById(id);
        ScrapeRequestDto req = new ScrapeRequestDto();
        req.setSourceId(source.getId());
        req.setUrl(source.getUrl());
        req.setMode(source.getContentType() != null ? source.getContentType() : "COMPLETE_PAGE");
        req.setCleanData(true);
        req.setSaveToDb(true);

        ScrapingJob job = scrapingService.executeScrapeJob(req);
        return ResponseEntity.ok(job);
    }
}
