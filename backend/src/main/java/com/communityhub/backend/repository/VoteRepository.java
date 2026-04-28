package com.communityhub.backend.repository;

import com.communityhub.backend.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    
    Optional<Vote> findByPostIdAndUsername(Long postId, String username);
    
    List<Vote> findByPostId(Long postId);
    
    @Modifying
    @Query("DELETE FROM Vote v WHERE v.postId = :postId")
    void deleteByPostId(@Param("postId") Long postId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.postId = :postId AND v.voteType = 1")
    Long countUpvotesByPostId(@Param("postId") Long postId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.postId = :postId AND v.voteType = -1")
    Long countDownvotesByPostId(@Param("postId") Long postId);
}
