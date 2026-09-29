package com.webscrapex.repository;

import com.webscrapex.entity.Source;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SourceRepository extends JpaRepository<Source, Long> {
    Optional<Source> findByUrl(String url);
    List<Source> findByActiveTrue();
}
