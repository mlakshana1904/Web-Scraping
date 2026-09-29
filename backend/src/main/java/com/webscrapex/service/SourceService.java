package com.webscrapex.service;

import com.webscrapex.dto.SourceDto;
import com.webscrapex.entity.Source;
import com.webscrapex.exception.ResourceNotFoundException;
import com.webscrapex.repository.ScrapedDataRepository;
import com.webscrapex.repository.SourceRepository;
import com.webscrapex.util.UrlValidatorUtil;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SourceService {

    private final SourceRepository sourceRepository;
    private final ScrapedDataRepository scrapedDataRepository;

    public SourceService(SourceRepository sourceRepository, ScrapedDataRepository scrapedDataRepository) {
        this.sourceRepository = sourceRepository;
        this.scrapedDataRepository = scrapedDataRepository;
    }

    public List<SourceDto> getAllSources() {
        return sourceRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public SourceDto getSourceById(Long id) {
        Source source = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with ID: " + id));
        return convertToDto(source);
    }

    public SourceDto createSource(SourceDto dto) {
        UrlValidatorUtil.validateUrlOrThrow(dto.getUrl());

        Source source = new Source();
        source.setName(dto.getName() != null && !dto.getName().isBlank() ? dto.getName() : dto.getUrl());
        source.setUrl(dto.getUrl().trim());
        source.setDescription(dto.getDescription());
        source.setContentType(dto.getContentType() != null ? dto.getContentType() : "COMPLETE_PAGE");
        source.setCssSelector(dto.getCssSelector());
        source.setActive(dto.getActive() != null ? dto.getActive() : true);

        Source saved = sourceRepository.save(source);
        return convertToDto(saved);
    }

    public SourceDto updateSource(Long id, SourceDto dto) {
        Source source = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found with ID: " + id));

        if (dto.getUrl() != null && !dto.getUrl().isBlank()) {
            UrlValidatorUtil.validateUrlOrThrow(dto.getUrl());
            source.setUrl(dto.getUrl().trim());
        }
        if (dto.getName() != null) source.setName(dto.getName());
        if (dto.getDescription() != null) source.setDescription(dto.getDescription());
        if (dto.getContentType() != null) source.setContentType(dto.getContentType());
        if (dto.getCssSelector() != null) source.setCssSelector(dto.getCssSelector());
        if (dto.getActive() != null) source.setActive(dto.getActive());

        Source updated = sourceRepository.save(source);
        return convertToDto(updated);
    }

    public void deleteSource(Long id) {
        if (!sourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Source not found with ID: " + id);
        }
        sourceRepository.deleteById(id);
    }

    public SourceDto convertToDto(Source source) {
        SourceDto dto = new SourceDto();
        dto.setId(source.getId());
        dto.setName(source.getName());
        dto.setUrl(source.getUrl());
        dto.setDescription(source.getDescription());
        dto.setContentType(source.getContentType());
        dto.setCssSelector(source.getCssSelector());
        dto.setActive(source.getActive());
        dto.setCreatedAt(source.getCreatedAt());
        dto.setUpdatedAt(source.getUpdatedAt());

        long count = scrapedDataRepository.findBySourceId(source.getId()).size();
        dto.setTotalRecords(count);

        return dto;
    }
}
