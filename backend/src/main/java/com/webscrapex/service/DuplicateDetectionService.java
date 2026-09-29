package com.webscrapex.service;

import com.webscrapex.dto.ExtractedItemDto;
import com.webscrapex.repository.ScrapedDataRepository;
import com.webscrapex.util.HashUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class DuplicateDetectionService {

    private final ScrapedDataRepository scrapedDataRepository;

    public DuplicateDetectionService(ScrapedDataRepository scrapedDataRepository) {
        this.scrapedDataRepository = scrapedDataRepository;
    }

    public static class DeduplicationResult {
        private final List<ExtractedItemDto> uniqueItems;
        private final int totalOriginal;
        private final int duplicatesRemoved;

        public DeduplicationResult(List<ExtractedItemDto> uniqueItems, int totalOriginal, int duplicatesRemoved) {
            this.uniqueItems = uniqueItems;
            this.totalOriginal = totalOriginal;
            this.duplicatesRemoved = duplicatesRemoved;
        }

        public List<ExtractedItemDto> getUniqueItems() { return uniqueItems; }
        public int getTotalOriginal() { return totalOriginal; }
        public int getDuplicatesRemoved() { return duplicatesRemoved; }
    }

    public DeduplicationResult filterDuplicates(List<ExtractedItemDto> items) {
        if (items == null || items.isEmpty()) {
            return new DeduplicationResult(new ArrayList<>(), 0, 0);
        }

        List<ExtractedItemDto> unique = new ArrayList<>();
        Set<String> seenHashesInBatch = new HashSet<>();
        int duplicatesCount = 0;

        for (ExtractedItemDto item : items) {
            String hash = item.getContentHash();
            if (hash == null || hash.isBlank()) {
                hash = HashUtil.computeSha256(item.getContent());
                item.setContentHash(hash);
            }

            // Check intra-batch duplicate
            if (seenHashesInBatch.contains(hash)) {
                duplicatesCount++;
                continue;
            }

            // Check database duplicate for same source URL
            boolean existsInDb = scrapedDataRepository.existsByContentHashAndSourceUrl(hash, item.getSourceUrl());
            if (existsInDb) {
                duplicatesCount++;
                continue;
            }

            seenHashesInBatch.add(hash);
            unique.add(item);
        }

        return new DeduplicationResult(unique, items.size(), duplicatesCount);
    }
}
