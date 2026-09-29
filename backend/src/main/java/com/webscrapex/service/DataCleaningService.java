package com.webscrapex.service;

import com.webscrapex.dto.ExtractedItemDto;
import com.webscrapex.util.ContentCleanerUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DataCleaningService {

    public List<ExtractedItemDto> cleanItems(List<ExtractedItemDto> rawItems) {
        if (rawItems == null || rawItems.isEmpty()) {
            return new ArrayList<>();
        }

        List<ExtractedItemDto> cleaned = new ArrayList<>();
        for (ExtractedItemDto item : rawItems) {
            String title = ContentCleanerUtil.cleanText(item.getTitle());
            String content = ContentCleanerUtil.cleanText(item.getContent());
            String author = ContentCleanerUtil.cleanText(item.getAuthor());

            if (content == null || content.isBlank()) {
                continue; // Remove empty content records
            }

            item.setTitle(title.isEmpty() ? "Untitled Content" : title);
            item.setContent(content);
            item.setAuthor(author.isEmpty() ? "Unknown" : author);
            cleaned.add(item);
        }

        return cleaned;
    }
}
