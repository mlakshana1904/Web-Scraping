package com.webscrapex.repository;

import com.webscrapex.entity.ScrapingLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScrapingLogRepository extends JpaRepository<ScrapingLog, Long> {
    List<ScrapingLog> findByJobIdOrderByTimestampAsc(Long jobId);
}
