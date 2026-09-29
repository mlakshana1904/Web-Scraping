-- WEB SCRAPEX Seed Data

INSERT INTO sources (id, name, url, description, content_type, css_selector, active, created_at, updated_at)
VALUES
(1, 'Wikipedia Web Scraping', 'https://en.wikipedia.org/wiki/Web_scraping', 'Wikipedia article on web scraping concepts and ethical guidelines', 'ARTICLE', 'article', true, NOW(), NOW()),
(2, 'W3C Open Standards Blog', 'https://www.w3.org/blog/', 'W3C news and updates regarding web technologies', 'BLOG', '.entry-title', true, NOW(), NOW()),
(3, 'Permitted News Portal Example', 'https://example.com', 'Example domain for testing basic content extraction', 'COMPLETE_PAGE', NULL, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO scraped_data (id, source_id, title, content, content_type, author, published_date, source_url, metadata, content_hash, scraped_at, created_at)
VALUES
(1, 1, 'Web scraping - Wikipedia Overview', 'Web scraping, web harvesting, or web data extraction is data scraping used for extracting data from websites. The web scraping software may directly access the World Wide Web using the Hypertext Transfer Protocol or a web browser.', 'ARTICLE', 'Wikipedia Community', '2026-08-10', 'https://en.wikipedia.org/wiki/Web_scraping', '{"headings": 12, "paragraphs": 45, "links": 88}', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', NOW(), NOW()),
(2, 1, 'Legal and Ethical Considerations', 'Web scraping may run against the terms of use of some websites. The legal status of web scraping varies throughout the world.', 'SECTION', 'Wikipedia Community', '2026-08-10', 'https://en.wikipedia.org/wiki/Web_scraping', '{"section": "Legal"}', 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e', NOW(), NOW()),
(3, 2, 'Future of Web Data Standards', 'W3C highlights new metadata standards for public web crawlers and web search indexing accessibility.', 'BLOG', 'W3C Editorial Team', '2026-09-01', 'https://www.w3.org/blog/', '{"author": "W3C"}', '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO scraping_jobs (id, source_id, status, started_at, completed_at, records_found, records_saved, error_message)
VALUES
(1, 1, 'SUCCESS', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '59 minutes', 24, 22, NULL),
(2, 2, 'SUCCESS', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 58 minutes', 15, 15, NULL),
(3, 3, 'SUCCESS', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours 59 minutes', 5, 5, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO schedules (id, source_id, frequency, cron_expression, active, next_run, last_run, created_at)
VALUES
(1, 1, 'DAILY', '0 0 9 * * ?', true, NOW() + INTERVAL '12 hours', NOW() - INTERVAL '12 hours', NOW()),
(2, 2, 'HOURLY', '0 0 * * * ?', true, NOW() + INTERVAL '45 minutes', NOW() - INTERVAL '15 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO scraping_logs (id, job_id, level, message, timestamp)
VALUES
(1, 1, 'INFO', 'Connecting to https://en.wikipedia.org/wiki/Web_scraping...', NOW() - INTERVAL '1 hour'),
(2, 1, 'INFO', 'Fetched 142KB HTML. Extracting article elements...', NOW() - INTERVAL '1 hour'),
(3, 1, 'INFO', 'Found 24 elements, removed 2 duplicate hashes. 22 records saved.', NOW() - INTERVAL '59 minutes')
ON CONFLICT (id) DO NOTHING;
