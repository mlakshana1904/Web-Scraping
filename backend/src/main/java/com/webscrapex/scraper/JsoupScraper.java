package com.webscrapex.scraper;

import com.webscrapex.dto.CustomRuleDto;
import com.webscrapex.dto.ExtractedItemDto;
import com.webscrapex.dto.ScrapeRequestDto;
import com.webscrapex.dto.ScrapePreviewDto;
import com.webscrapex.util.ContentCleanerUtil;
import com.webscrapex.util.HashUtil;
import com.webscrapex.util.UrlValidatorUtil;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class JsoupScraper {

    private static final Logger log = LoggerFactory.getLogger(JsoupScraper.class);

    public ScrapePreviewDto extractContent(WebPageFetcher.FetchResult fetchResult, ScrapeRequestDto request) {
        Document doc = fetchResult.getDocument().clone(); // clone to avoid mutating original
        String url = request.getUrl();

        ScrapePreviewDto preview = new ScrapePreviewDto();
        preview.setSourceUrl(url);
        preview.setHttpStatus(fetchResult.getHttpStatus());
        preview.setResponseTimeMs(fetchResult.getResponseTimeMs());
        preview.setContentSize(formatBytes(fetchResult.getContentLength()));
        preview.setPageTitle(doc.title() != null && !doc.title().isEmpty() ? doc.title() : "Untitled Page");

        // JS Detection check
        String bodyText = doc.body() != null ? doc.body().text().trim() : "";
        Elements scripts = doc.select("script");
        boolean hasRootAppContainers = !doc.select("#app, #root, [id*='react'], [id*='vue'], [id*='angular']").isEmpty();

        if (bodyText.length() < 50 && hasRootAppContainers && !scripts.isEmpty()) {
            preview.setJsRequired(true);
            preview.setWarningMessage("This page appears to require browser rendering. The requested content was not available in the initial HTML response. Use an official API or an appropriate browser-rendered approach where permitted.");
        }

        List<ExtractedItemDto> items = new ArrayList<>();
        List<Map<String, String>> linksList = new ArrayList<>();
        List<List<String>> tablesList = new ArrayList<>();
        List<Map<String, String>> imagesList = new ArrayList<>();
        Map<String, Object> metadata = new HashMap<>();

        // Extract metadata first
        String metaDesc = extractMetaTag(doc, "description", "og:description");
        String author = extractAuthorInfo(doc);
        String pubDate = extractPublishedDateInfo(doc);

        metadata.put("metaDescription", metaDesc);
        metadata.put("author", author);
        metadata.put("publishedDate", pubDate);
        metadata.put("pageTitle", doc.title());

        if ("COMPLETE_PAGE".equalsIgnoreCase(request.getMode())) {
            // Strip technical elements for clean readable page text
            Document cleanDoc = doc.clone();
            cleanDoc.select("script, style, noscript, svg, iframe, nav, footer, header").remove();

            String fullText = ContentCleanerUtil.cleanText(cleanDoc.body() != null ? cleanDoc.body().text() : "");

            if (!fullText.isEmpty()) {
                ExtractedItemDto item = new ExtractedItemDto();
                item.setTitle(doc.title());
                item.setContent(fullText);
                item.setContentType("COMPLETE_PAGE");
                item.setAuthor(author);
                item.setPublishedDate(pubDate);
                item.setSourceUrl(url);
                item.setContentHash(HashUtil.computeSha256(fullText));
                item.setMetadata(Map.of("wordCount", fullText.split("\\s+").length, "charCount", fullText.length()));

                items.add(item);
            }
        } else {
            // SPECIFIC CONTENT MODE
            if (request.isExtractTitle()) {
                String titleText = doc.title();
                if (titleText != null && !titleText.isBlank()) {
                    ExtractedItemDto item = createExtractedItem(url, "Title", titleText, "TITLE", author, pubDate);
                    items.add(item);
                }
            }

            if (request.isExtractHeadings()) {
                Elements headings = doc.select("h1, h2, h3, h4, h5, h6");
                for (Element h : headings) {
                    String hText = ContentCleanerUtil.cleanText(h.text());
                    if (!hText.isBlank()) {
                        ExtractedItemDto item = createExtractedItem(url, h.tagName().toUpperCase() + ": " + hText, hText, "HEADING", author, pubDate);
                        items.add(item);
                    }
                }
            }

            if (request.isExtractParagraphs()) {
                Elements paragraphs = doc.select("p");
                for (Element p : paragraphs) {
                    String pText = ContentCleanerUtil.cleanText(p.text());
                    if (pText.length() > 20) { // filter out trivial UI labels
                        ExtractedItemDto item = createExtractedItem(url, "Paragraph", pText, "PARAGRAPH", author, pubDate);
                        items.add(item);
                    }
                }
            }

            if (request.isExtractArticle()) {
                Elements articles = doc.select("article, main, .article-content, .entry-content, #content, .post-content");
                if (articles.isEmpty()) {
                    articles = doc.select("body");
                }
                for (Element art : articles) {
                    Document artClean = Jsoup.parse(art.html());
                    artClean.select("script, style, noscript, iframe, nav").remove();
                    String artText = ContentCleanerUtil.cleanText(artClean.text());
                    if (!artText.isBlank()) {
                        ExtractedItemDto item = createExtractedItem(url, doc.title() + " - Article", artText, "ARTICLE", author, pubDate);
                        items.add(item);
                    }
                }
            }

            if (request.isExtractMetaDescription() && !metaDesc.isBlank()) {
                ExtractedItemDto item = createExtractedItem(url, "Meta Description", metaDesc, "META_DESCRIPTION", author, pubDate);
                items.add(item);
            }
        }

        // Links Extraction
        if (request.isExtractLinks() || "COMPLETE_PAGE".equalsIgnoreCase(request.getMode())) {
            Elements links = doc.select("a[href]");
            for (Element link : links) {
                String href = UrlValidatorUtil.normalizeUrl(url, link.attr("href"));
                String anchorText = ContentCleanerUtil.normalizeWhitespace(link.text());
                if (!href.isBlank() && !href.startsWith("javascript:")) {
                    Map<String, String> linkMap = new HashMap<>();
                    linkMap.put("text", anchorText.isEmpty() ? href : anchorText);
                    linkMap.put("url", href);
                    linksList.add(linkMap);
                }
            }
            metadata.put("totalLinksFound", linksList.size());
        }

        // Table Extraction
        if (request.isExtractTables()) {
            Elements tables = doc.select("table");
            for (Element tbl : tables) {
                List<String> rowList = new ArrayList<>();
                Elements rows = tbl.select("tr");
                for (Element row : rows) {
                    Elements cols = row.select("th, td");
                    List<String> cellTexts = new ArrayList<>();
                    for (Element col : cols) {
                        cellTexts.add(ContentCleanerUtil.normalizeWhitespace(col.text()));
                    }
                    if (!cellTexts.isEmpty()) {
                        rowList.add(String.join(" | ", cellTexts));
                    }
                }
                if (!rowList.isEmpty()) {
                    tablesList.add(rowList);

                    // Add as extracted item
                    String tableContent = String.join("\n", rowList);
                    ExtractedItemDto item = createExtractedItem(url, "Extracted Data Table", tableContent, "TABLE", author, pubDate);
                    items.add(item);
                }
            }
            metadata.put("totalTablesFound", tablesList.size());
        }

        // Images & Metadata Extraction
        if (request.isExtractImages()) {
            Elements images = doc.select("img[src]");
            for (Element img : images) {
                String src = UrlValidatorUtil.normalizeUrl(url, img.attr("src"));
                String alt = ContentCleanerUtil.normalizeWhitespace(img.attr("alt"));
                String title = ContentCleanerUtil.normalizeWhitespace(img.attr("title"));
                if (!src.isBlank()) {
                    Map<String, String> imgMap = new HashMap<>();
                    imgMap.put("src", src);
                    imgMap.put("alt", alt);
                    imgMap.put("title", title);
                    imagesList.add(imgMap);
                }
            }
            metadata.put("totalImagesFound", imagesList.size());
        }

        // Custom CSS Selector Extraction Rules
        if (request.getCustomRules() != null && !request.getCustomRules().isEmpty()) {
            List<String> customErrors = new ArrayList<>();
            for (CustomRuleDto rule : request.getCustomRules()) {
                if (rule.getCssSelector() == null || rule.getCssSelector().isBlank()) continue;

                try {
                    Elements selectedElements = doc.select(rule.getCssSelector().trim());
                    if (selectedElements.isEmpty()) {
                        String errMsg = "No matching elements found for selector: '" + rule.getCssSelector() + "'";
                        customErrors.add(errMsg);
                        log.warn(errMsg);
                    } else {
                        StringBuilder sb = new StringBuilder();
                        for (Element el : selectedElements) {
                            String txt = ContentCleanerUtil.cleanText(el.text());
                            if (!txt.isBlank()) {
                                if (sb.length() > 0) sb.append("\n");
                                sb.append(txt);
                            }
                        }
                        if (sb.length() > 0) {
                            String fieldName = rule.getFieldName() != null && !rule.getFieldName().isBlank() ? rule.getFieldName() : rule.getCssSelector();
                            ExtractedItemDto item = createExtractedItem(url, fieldName, sb.toString(), "CUSTOM_SELECTOR", author, pubDate);
                            items.add(item);
                        }
                    }
                } catch (Exception e) {
                    customErrors.add("Invalid CSS selector format: '" + rule.getCssSelector() + "'");
                }
            }
            if (!customErrors.isEmpty()) {
                metadata.put("selectorWarnings", customErrors);
                if (preview.getWarningMessage() == null) {
                    preview.setWarningMessage(String.join(" | ", customErrors));
                }
            }
        }

        preview.setItems(items);
        preview.setLinks(linksList);
        preview.setTables(tablesList);
        preview.setImages(imagesList);
        preview.setMetadata(metadata);
        preview.setRecordsFound(items.size());

        return preview;
    }

    private ExtractedItemDto createExtractedItem(String url, String title, String content, String type, String author, String pubDate) {
        ExtractedItemDto item = new ExtractedItemDto();
        item.setSourceUrl(url);
        item.setTitle(title);
        item.setContent(content);
        item.setContentType(type);
        item.setAuthor(author);
        item.setPublishedDate(pubDate);
        item.setContentHash(HashUtil.computeSha256(content));
        return item;
    }

    private String extractMetaTag(Document doc, String nameAttr, String propAttr) {
        Element el = doc.selectFirst("meta[name=" + nameAttr + "], meta[property=" + propAttr + "]");
        return el != null ? ContentCleanerUtil.cleanText(el.attr("content")) : "";
    }

    private String extractAuthorInfo(Document doc) {
        Element el = doc.selectFirst("meta[name=author], meta[property=article:author], .author, [rel=author], .byline");
        if (el != null) {
            String val = el.hasAttr("content") ? el.attr("content") : el.text();
            return ContentCleanerUtil.cleanText(val);
        }
        return "Unknown";
    }

    private String extractPublishedDateInfo(Document doc) {
        Element el = doc.selectFirst("time, meta[name=article:published_time], meta[property=og:updated_time], .date, .published");
        if (el != null) {
            String val = el.hasAttr("datetime") ? el.attr("datetime") : (el.hasAttr("content") ? el.attr("content") : el.text());
            return ContentCleanerUtil.cleanText(val);
        }
        return "";
    }

    private String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        char pre = "KMGTPE".charAt(exp - 1);
        return String.format(Locale.US, "%.1f %cB", bytes / Math.pow(1024, exp), pre);
    }
}
