package com.webscrapex.repository;

import com.webscrapex.entity.ScrapingJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScrapingJobRepository extends JpaRepository<ScrapingJob, Long> {

    List<ScrapingJob> findBySourceIdOrderByStartedAtDesc(Long sourceId);

    Page<ScrapingJob> findAllByOrderByStartedAtDesc(Pageable pageable);

    long countByStatus(String status);

    @Query("SELECT j.status, COUNT(j) FROM ScrapingJob j GROUP BY j.status")
    List<Object[]> countByStatusGroup();
}
