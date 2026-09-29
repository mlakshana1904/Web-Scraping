# WEB SCRAPEX
### Smart Web Scraping & Content Extraction Platform

[![Java](https://img.shields.io/badge/Java-17%2B-blue.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Jsoup](https://img.shields.io/badge/Jsoup-1.17-orange.svg)](https://jsoup.org/)

**WEB SCRAPEX** is a full-stack, enterprise-grade web scraping and content extraction platform built with Java 17, Spring Boot 3, PostgreSQL, Jsoup DOM Parser, and React.js. It enables users to fetch permitted public web pages, extract complete readable content or targeted HTML elements (titles, headings, paragraphs, links, tables, images, metadata, and custom CSS selectors), clean and deduplicate data using SHA-256 content hashing, manage recurring scraping schedules with Spring Scheduler, search/filter data, and generate instant CSV/JSON exports.

---

## 🌟 Key Features

- **Actual Web Page Fetching & Parsing:** Real-time HTTP fetching with Jsoup DOM parser, status validation, response timing, size reporting, and JS-rendering requirement detection.
- **Dual Content Extraction Modes:**
  - **Complete Page Mode:** Extracts readable textual content while stripping technical scripts, styles, and noscript elements.
  - **Specific Content Mode:** Multi-element checkbox selection for Titles, Headings (`h1-h6`), Paragraphs (`p`), Article text, Links, Tables, Images, Meta Description, Author, and Published Date.
- **Custom CSS Selector Extraction:** User-defined Field Name + CSS Selector rules (e.g. `Title -> h1`, `Price -> .price`) with explicit validation feedback if no matching elements exist.
- **Automatic Data Cleaning:** Trims whitespace, normalizes spaces and line breaks, removes empty records, and normalizes URLs and text encodings.
- **SHA-256 Hash Duplicate Detection:** Prevents redundant database insertion by matching content hashes intra-batch and against existing PostgreSQL records.
- **PostgreSQL Persistence:** Relational database storage across 5 tables (`sources`, `scraped_data`, `scraping_jobs`, `schedules`, `scraping_logs`) with full audit history.
- **Automated Scheduling Engine:** Spring Scheduler integration supporting Hourly, 6-Hour, Daily, Weekly, and Custom Cron expressions (`0 0 9 * * ?`).
- **Full-Featured Dashboard & Search:** Analytics dashboard with Recharts visualization, server-side multi-field search, multi-criteria filtering, and pagination.
- **CSV & JSON Export Generator:** Backend-driven streaming export file downloads.
- **Premium SaaS Interface:** Modern dark navy & light mode styling, toast alerts, skeleton loading, empty state handlers, and confirmation dialogs.

---

## 🏗 Architecture & Technology Stack

```
                        +---------------------------------------+
                        |      React 18 + Vite Frontend         |
                        | (Dashboard, Scraper, Sources, Data)   |
                        +-------------------+-------------------+
                                            | REST APIs
                                            v
                        +-------------------+-------------------+
                        |   Spring Boot 3 REST Controllers      |
                        +-------------------+-------------------+
                                            |
         +----------------------------------+----------------------------------+
         |                                  |                                  |
         v                                  v                                  v
+------------------+             +-------------------+              +--------------------+
|  Scraping Engine |             | Data Services     |              | Schedule Engine    |
| (Jsoup Scraper,  |             | (Cleaning, Hash   |              | (Spring Scheduler, |
| WebPageFetcher,  |             |  Deduplication)   |              |  Job Execution)    |
| Selector Parser) |             +---------+---------+              +---------+----------+
+--------+---------+                       |                                  |
         |                                 v                                  v
         |                       +---------+---------+              +---------+----------+
         +---------------------->|  Spring Data JPA  |<-------------+                    |
                                 +---------+---------+                                   |
                                           |                                             |
                                           v                                             v
                                 +---------+---------+                          +--------+---------+
                                 | PostgreSQL Database|                          |  Export Generator|
                                 | (Sources, Scraped |                          |   (CSV / JSON)   |
                                 |  Data, Jobs, Logs)|                          +------------------+
                                 +-------------------+
```

### Tech Stack Details
- **Backend:** Java 17+, Spring Boot 3.2, Spring Web, Spring Data JPA, Hibernate, Jsoup 1.17, Jackson, Bean Validation, Maven, JUnit 5, SLF4J/Logback.
- **Frontend:** React 18, Vite, Bootstrap 5, Axios, React Router v6, React Icons, Recharts.
- **Database:** PostgreSQL (with embedded H2 fallback capability for development/testing).

---

## 📁 Repository Structure

```
web scraping/
├── backend/                  # Spring Boot Java Backend Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/webscrapex/
│   │   │   │   ├── config/      # CorsConfig, AsyncConfig
│   │   │   │   ├── controller/  # ScrapeController, SourceController, DataController...
│   │   │   │   ├── dto/         # Request/Response Data Transfer Objects
│   │   │   │   ├── entity/      # Source, ScrapedData, ScrapingJob, Schedule...
│   │   │   │   ├── exception/   # GlobalExceptionHandler, Custom Exceptions
│   │   │   │   ├── repository/  # Spring Data JPA Interfaces
│   │   │   │   ├── scraper/     # WebPageFetcher, JsoupScraper
│   │   │   │   ├── service/     # ScrapingService, Cleaning, Deduplication...
│   │   │   │   └── util/        # UrlValidatorUtil, ContentCleanerUtil, HashUtil
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-postgres.properties
│   │   └── test/            # JUnit 5 & Mockito Unit/Integration Tests
│   └── pom.xml              # Maven Build Configuration
├── frontend/                 # React + Vite SaaS Frontend Application
│   ├── src/
│   │   ├── api/             # Axios API Client
│   │   ├── components/      # Sidebar, TopNavbar, ScrapingForm, Preview, DataTable...
│   │   ├── pages/           # Dashboard, Scrape, Sources, Data, Schedules, History...
│   │   ├── App.jsx
│   │   ├── index.css        # SaaS CSS Token System & Light/Dark Theme Utilities
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── database/                 # PostgreSQL Scripts
│   ├── schema.sql           # Database DDL Script
│   └── seed.sql             # Initial Seed Data
├── .env.example              # Environment Variable Template
├── .gitignore
└── README.md                 # System Documentation
```

---

## 🚀 Quick Start Guide (Windows Commands)

### 1. Prerequisites
- **Java JDK 17+** (or Java 21) installed (`java -version`)
- **PostgreSQL 14+** service running on `localhost:5432` (or H2 mode auto-fallback)
- **Node.js 18+** & **npm** installed (`node -v`)
- **Apache Maven 3.8+** (or NetBeans Maven `mvn.cmd`)

---

### 2. Database Setup (PostgreSQL)

Execute the PostgreSQL setup script using `psql` or pgAdmin:

```powershell
# Create database
psql -U postgres -c "CREATE DATABASE webscrapex;"

# Run Schema & Seed Data
psql -U postgres -d webscrapex -f database/schema.sql
psql -U postgres -d webscrapex -f database/seed.sql
```

---

### 3. Backend Setup & Startup

Configure environment variables in `.env` or set environment properties:

```powershell
cd "backend"

# Set Database Credentials (if using PostgreSQL)
$env:DB_URL="jdbc:postgresql://localhost:5432/webscrapex"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="postgres"

# Build & Run Unit Tests
& "C:\Program Files\Apache NetBeans\java\maven\bin\mvn.cmd" clean test

# Run Spring Boot Backend Application (Port 8080)
& "C:\Program Files\Apache NetBeans\java\maven\bin\mvn.cmd" spring-boot:run
```

---

### 4. Frontend Setup & Startup

Open a second terminal window:

```powershell
cd "frontend"

# Install Dependencies
npm install

# Start Vite Development Server (Port 5173)
npm run dev
```

Open your browser at: `http://localhost:5173`

---

## 🔌 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/scrape/preview` | Fetches webpage, parses DOM, cleans & returns preview without saving to DB |
| `POST` | `/api/scrape` | Executes full scraping job, cleans, deduplicates & saves to PostgreSQL |
| `GET` | `/api/sources` | Lists all configured web sources |
| `POST` | `/api/sources` | Registers a new web source target |
| `PUT` | `/api/sources/{id}` | Updates existing source properties |
| `DELETE` | `/api/sources/{id}` | Deletes a web source target |
| `POST` | `/api/sources/{id}/scrape` | Triggers immediate scrape execution for a specific source |
| `GET` | `/api/data` | Multi-criteria search, filter & paginated retrieval of scraped data |
| `GET` | `/api/data/{id}` | Fetches full record detail by ID |
| `DELETE` | `/api/data/{id}` | Deletes a scraped data record |
| `GET` | `/api/schedules` | Lists all recurring scraping schedules |
| `POST` | `/api/schedules` | Creates a new scraping schedule |
| `DELETE` | `/api/schedules/{id}` | Deletes a schedule |
| `GET` | `/api/history` | Fetches audit log history of scraping jobs |
| `GET` | `/api/history/{id}` | Fetches step-by-step audit logs for a specific job |
| `GET` | `/api/dashboard/stats` | Aggregates system metrics, charts & recent job activities |
| `GET` | `/api/export/csv` | Streams CSV export download file |
| `GET` | `/api/export/json` | Streams JSON export download file |

---

## ⚖️ Ethical & Legal Scraping Guidelines

WEB SCRAPEX is strictly designed for legal, permitted web data extraction.

1. **Permitted Access:** Only fetch public web pages where automated access is permitted.
2. **Robots.txt & Terms:** Always check and observe website `robots.txt` rules and Terms of Service.
3. **Rate Limiting:** Implement reasonable delays between requests to prevent overloading web servers.
4. **No Circumvention:** WEB SCRAPEX **does not** bypass CAPTCHAs, anti-bot mechanisms, paywalls, or authentication barriers.
5. **Data Protection:** Comply with applicable copyright and data privacy laws (GDPR, CCPA).
