package com.webscrapex;

import com.webscrapex.exception.InvalidUrlException;
import com.webscrapex.util.UrlValidatorUtil;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class UrlValidatorUtilTest {

    @Test
    public void testValidUrls() {
        assertTrue(UrlValidatorUtil.isValidUrl("https://en.wikipedia.org/wiki/Web_scraping"));
        assertTrue(UrlValidatorUtil.isValidUrl("http://example.com/page?id=123"));
    }

    @Test
    public void testInvalidUrls() {
        assertFalse(UrlValidatorUtil.isValidUrl("ftp://invalid.com"));
        assertFalse(UrlValidatorUtil.isValidUrl("not-a-url"));
        assertFalse(UrlValidatorUtil.isValidUrl(""));
        assertFalse(UrlValidatorUtil.isValidUrl(null));
    }

    @Test
    public void testValidateOrThrow() {
        assertThrows(InvalidUrlException.class, () -> {
            UrlValidatorUtil.validateUrlOrThrow("invalid-url-string");
        });
    }
}
