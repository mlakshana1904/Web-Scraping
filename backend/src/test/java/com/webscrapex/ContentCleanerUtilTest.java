package com.webscrapex;

import com.webscrapex.util.ContentCleanerUtil;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ContentCleanerUtilTest {

    @Test
    public void testCleanTextStripsHtmlAndNormalizesSpaces() {
        String input = "<h1>   Heading Title  </h1><p>  Some paragraph   text  with &nbsp; HTML </p>";
        String cleaned = ContentCleanerUtil.cleanText(input);

        assertTrue(cleaned.contains("Heading Title"));
        assertTrue(cleaned.contains("Some paragraph text with HTML"));
        assertEquals("Heading Title Some paragraph text with HTML", cleaned);
    }

    @Test
    public void testNormalizeWhitespace() {
        String input = "Line  1 \n  Line 2   \t Line 3";
        String normalized = ContentCleanerUtil.normalizeWhitespace(input);
        assertEquals("Line 1 Line 2 Line 3", normalized);
    }
}
