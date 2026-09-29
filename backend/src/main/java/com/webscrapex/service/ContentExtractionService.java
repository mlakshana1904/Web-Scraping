package com.webscrapex.service;

import com.webscrapex.dto.ScrapeRequestDto;
import com.webscrapex.dto.ScrapePreviewDto;
import com.webscrapex.scraper.JsoupScraper;
import com.webscrapex.scraper.WebPageFetcher;
import org.springframework.stereotype.Service;

@Service
public class ContentExtractionService {

    private final WebPageFetcher fetcher;
    private final JsoupScraper scraper;

    public ContentExtractionService(WebPageFetcher fetcher, JsoupScraper scraper) {
        this.fetcher = fetcher;
        this.scraper = scraper;
    }

    public ScrapePreviewDto extract(ScrapeRequestDto request) {
        WebPageFetcher.FetchResult fetchResult = fetcher.fetchPage(request.getUrl());
        return scraper.extractContent(fetchResult, request);
    }
}
