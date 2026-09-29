package com.webscrapex.repository;

import com.webscrapex.entity.ScrapedData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScrapedDataRepository extends JpaRepository<ScrapedData, Long> {

    Optional<ScrapedData> findByContentHashAndSourceUrl(String contentHash, String sourceUrl);
    
    boolean existsByContentHashAndSourceUrl(String contentHash, String sourceUrl);

    List<ScrapedData> findBySourceId(Long sourceId);

    @Query("SELECT d FROM ScrapedData d WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.content) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.author) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.sourceUrl) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:sourceId IS NULL OR d.sourceId = :sourceId) " +
           "AND (:contentType IS NULL OR :contentType = '' OR d.contentType = :contentType)")
    Page<ScrapedData> searchData(@Param("query") String query,
                                 @Param("sourceId") Long sourceId,
                                 @Param("contentType") String contentType,
                                 Pageable pageable);

    @Query("SELECT d.contentType, COUNT(d) FROM ScrapedData d GROUP BY d.contentType")
    List<Object[]> countByContentTypeGroup();
}
