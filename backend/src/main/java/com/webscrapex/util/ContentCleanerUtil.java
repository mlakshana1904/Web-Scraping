package com.webscrapex.util;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

public class ContentCleanerUtil {

    public static String cleanText(String rawText) {
        if (rawText == null || rawText.isBlank()) return "";

        // Parse HTML to extract text preserving block element spacing
        String textWithoutHtml = Jsoup.parse(rawText).text();

        // Replace non-breaking spaces & clean whitespace
        String cleaned = textWithoutHtml.replace('\u00A0', ' ')
                                        .replaceAll("[ \\t\\r\\f\\v]+", " ");

        // Normalize multiple line breaks to max 2
        cleaned = cleaned.replaceAll("\n\\s*\n", "\n\n");

        return cleaned.trim();
    }

    public static String normalizeWhitespace(String text) {
        if (text == null) return "";
        return text.replaceAll("\\s+", " ").trim();
    }

    public static String removeUnnecessaryHtml(String htmlContent) {
        if (htmlContent == null) return "";
        return Jsoup.clean(htmlContent, Safelist.relaxed()
                .addTags("table", "thead", "tbody", "tr", "th", "td", "article", "section", "header", "footer", "p", "h1", "h2", "h3", "h4", "h5", "h6", "a", "img")
                .addAttributes("a", "href", "title", "target")
                .addAttributes("img", "src", "alt", "title", "width", "height"));
    }
}
