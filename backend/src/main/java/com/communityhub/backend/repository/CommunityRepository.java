package com.communityhub.backend.repository;

import com.communityhub.backend.model.Community;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    
    Optional<Community> findBySlug(String slug);
    
    boolean existsBySlug(String slug);
}
