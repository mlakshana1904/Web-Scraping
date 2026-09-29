package com.webscrapex.controller;

import com.webscrapex.dto.ScrapePreviewDto;
import com.webscrapex.dto.ScrapeRequestDto;
import com.webscrapex.entity.ScrapingJob;
import com.webscrapex.service.ScrapingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scrape")
public class ScrapeController {

    private final ScrapingService scrapingService;

    public ScrapeController(ScrapingService scrapingService) {
        this.scrapingService = scrapingService;
    }

    @PostMapping("/preview")
    public ResponseEntity<ScrapePreviewDto> previewScrape(@Valid @RequestBody ScrapeRequestDto request) {
        request.setSaveToDb(false);
        ScrapePreviewDto preview = scrapingService.previewScrape(request);
        return ResponseEntity.ok(preview);
    }

    @PostMapping
    public ResponseEntity<ScrapingJob> executeScrape(@Valid @RequestBody ScrapeRequestDto request) {
        request.setSaveToDb(true);
        ScrapingJob job = scrapingService.executeScrapeJob(request);
        return ResponseEntity.ok(job);
    }
}
