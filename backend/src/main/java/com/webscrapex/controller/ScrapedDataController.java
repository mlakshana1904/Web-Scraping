package com.webscrapex.controller;

import com.webscrapex.dto.ScrapedDataDto;
import com.webscrapex.entity.ScrapedData;
import com.webscrapex.entity.Source;
import com.webscrapex.exception.ResourceNotFoundException;
import com.webscrapex.repository.ScrapedDataRepository;
import com.webscrapex.repository.SourceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/data")
public class ScrapedDataController {

    private final ScrapedDataRepository scrapedDataRepository;
    private final SourceRepository sourceRepository;

    public ScrapedDataController(ScrapedDataRepository scrapedDataRepository, SourceRepository sourceRepository) {
        this.scrapedDataRepository = scrapedDataRepository;
        this.sourceRepository = sourceRepository;
    }

    @GetMapping
    public ResponseEntity<Page<ScrapedDataDto>> searchData(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long sourceId,
            @RequestParam(required = false) String contentType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "scrapedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ScrapedData> entityPage = scrapedDataRepository.searchData(q, sourceId, contentType, pageable);
        Page<ScrapedDataDto> dtoPage = entityPage.map(this::convertToDto);

        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScrapedDataDto> getDataById(@PathVariable Long id) {
        ScrapedData entity = scrapedDataRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scraped data entry not found with ID: " + id));
        return ResponseEntity.ok(convertToDto(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDataById(@PathVariable Long id) {
        if (!scrapedDataRepository.existsById(id)) {
            throw new ResourceNotFoundException("Scraped data entry not found with ID: " + id);
        }
        scrapedDataRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ScrapedDataDto convertToDto(ScrapedData entity) {
        ScrapedDataDto dto = new ScrapedDataDto();
        dto.setId(entity.getId());
        dto.setSourceId(entity.getSourceId());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setContentType(entity.getContentType());
        dto.setAuthor(entity.getAuthor());
        dto.setPublishedDate(entity.getPublishedDate());
        dto.setSourceUrl(entity.getSourceUrl());
        dto.setMetadata(entity.getMetadata());
        dto.setContentHash(entity.getContentHash());
        dto.setScrapedAt(entity.getScrapedAt());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getSourceId() != null) {
            Optional<Source> source = sourceRepository.findById(entity.getSourceId());
            source.ifPresent(s -> dto.setSourceName(s.getName()));
        }

        return dto;
    }
}
