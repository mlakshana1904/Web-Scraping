package com.webscrapex.util;

import com.webscrapex.exception.InvalidUrlException;

import java.net.URI;
import java.net.URL;

public class UrlValidatorUtil {

    public static boolean isValidUrl(String urlString) {
        if (urlString == null || urlString.trim().isEmpty()) {
            return false;
        }

        try {
            URI uri = new URI(urlString.trim());
            String scheme = uri.getScheme();
            if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                return false;
            }
            if (uri.getHost() == null || uri.getHost().trim().isEmpty()) {
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static void validateUrlOrThrow(String urlString) {
        if (!isValidUrl(urlString)) {
            throw new InvalidUrlException("Invalid web page URL provided: '" + urlString + "'. Please enter a valid HTTP or HTTPS URL.");
        }
    }

    public static String normalizeUrl(String baseUrl, String relativeOrAbsoluteUrl) {
        if (relativeOrAbsoluteUrl == null || relativeOrAbsoluteUrl.trim().isEmpty()) {
            return "";
        }
        try {
            URI base = new URI(baseUrl);
            URI resolved = base.resolve(relativeOrAbsoluteUrl.trim());
            return resolved.toASCIIString();
        } catch (Exception e) {
            return relativeOrAbsoluteUrl;
        }
    }
}
