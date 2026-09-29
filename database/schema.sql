-- WEB SCRAPEX Database Schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS sources (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    content_type VARCHAR(100) DEFAULT 'COMPLETE_PAGE',
    css_selector TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scraped_data (
    id BIGSERIAL PRIMARY KEY,
    source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL,
    title VARCHAR(500),
    content TEXT,
    content_type VARCHAR(100) DEFAULT 'GENERAL',
    author VARCHAR(255),
    published_date VARCHAR(100),
    source_url TEXT NOT NULL,
    metadata TEXT,
    content_hash VARCHAR(64) NOT NULL,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scraping_jobs (
    id BIGSERIAL PRIMARY KEY,
    source_id BIGINT REFERENCES sources(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'RUNNING',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    records_found INT DEFAULT 0,
    records_saved INT DEFAULT 0,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS schedules (
    id BIGSERIAL PRIMARY KEY,
    source_id BIGINT REFERENCES sources(id) ON DELETE CASCADE,
    frequency VARCHAR(50) NOT NULL,
    cron_expression VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    next_run TIMESTAMP WITH TIME ZONE,
    last_run TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scraping_logs (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT REFERENCES scraping_jobs(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scraped_data_source_id ON scraped_data(source_id);
CREATE INDEX IF NOT EXISTS idx_scraped_data_content_hash ON scraped_data(content_hash);
CREATE INDEX IF NOT EXISTS idx_scraped_data_source_url ON scraped_data(source_url);
CREATE INDEX IF NOT EXISTS idx_scraped_data_scraped_at ON scraped_data(scraped_at);
CREATE INDEX IF NOT EXISTS idx_scraping_jobs_source_id ON scraping_jobs(source_id);
CREATE INDEX IF NOT EXISTS idx_schedules_source_id ON schedules(source_id);
