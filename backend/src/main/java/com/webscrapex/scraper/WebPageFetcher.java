package com.webscrapex.scraper;

import com.webscrapex.exception.ScrapingException;
import com.webscrapex.util.UrlValidatorUtil;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class WebPageFetcher {

    private static final Logger log = LoggerFactory.getLogger(WebPageFetcher.class);
    private static final String DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 WebScrapex/1.0 (Permitted Crawl)";
    private static final int TIMEOUT_MS = 10000;
    private static final int MAX_BODY_SIZE = 5 * 1024 * 1024; // 5MB

    public static class FetchResult {
        private final Document document;
        private final int httpStatus;
        private final long responseTimeMs;
        private final int contentLength;
        private final String rawHtml;

        public FetchResult(Document document, int httpStatus, long responseTimeMs, int contentLength, String rawHtml) {
            this.document = document;
            this.httpStatus = httpStatus;
            this.responseTimeMs = responseTimeMs;
            this.contentLength = contentLength;
            this.rawHtml = rawHtml;
        }

        public Document getDocument() { return document; }
        public int getHttpStatus() { return httpStatus; }
        public long getResponseTimeMs() { return responseTimeMs; }
        public int getContentLength() { return contentLength; }
        public String getRawHtml() { return rawHtml; }
    }

    public FetchResult fetchPage(String urlString) {
        UrlValidatorUtil.validateUrlOrThrow(urlString);

        long start = System.currentTimeMillis();
        try {
            Connection.Response response = Jsoup.connect(urlString)
                    .userAgent(DEFAULT_USER_AGENT)
                    .timeout(TIMEOUT_MS)
                    .maxBodySize(MAX_BODY_SIZE)
                    .followRedirects(true)
                    .ignoreHttpErrors(true)
                    .execute();

            long responseTimeMs = System.currentTimeMillis() - start;
            int statusCode = response.statusCode();

            if (statusCode == 404) {
                throw new ScrapingException("Target page returned HTTP 404 Not Found.");
            } else if (statusCode == 403) {
                throw new ScrapingException("Target page returned HTTP 403 Forbidden. Automated access is restricted by the site.");
            } else if (statusCode == 429) {
                throw new ScrapingException("Target page returned HTTP 429 Too Many Requests (Rate Limited).");
            } else if (statusCode >= 500) {
                throw new ScrapingException("Target web server encountered an internal error (HTTP " + statusCode + ").");
            } else if (statusCode < 200 || statusCode >= 400) {
                throw new ScrapingException("HTTP request failed with status code: " + statusCode);
            }

            String html = response.body();
            Document doc = Jsoup.parse(html, urlString);
            int contentLength = html != null ? html.getBytes().length : 0;

            return new FetchResult(doc, statusCode, responseTimeMs, contentLength, html != null ? html : "");

        } catch (ScrapingException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to fetch web page content from URL {}: {}", urlString, e.getMessage());
            throw new ScrapingException("Unable to connect to target web page: " + (e.getMessage() != null ? e.getMessage() : "Unknown network error"), e);
        }
    }
}
