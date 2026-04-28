package com.communityhub.backend.repository;

import com.communityhub.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    
    @Query("SELECT p, (p.upvotes - p.downvotes) as voteCount FROM Post p ORDER BY (p.upvotes - p.downvotes) DESC, p.createdAt DESC")
    List<Object[]> findAllOrderByVoteScore();
    
    @Query("SELECT p FROM Post p ORDER BY p.createdAt DESC")
    List<Post> findAllOrderByCreatedAt();
    
    @Query("SELECT p, (p.upvotes - p.downvotes) as voteCount FROM Post p ORDER BY (p.upvotes - p.downvotes) DESC, p.createdAt DESC")
    List<Object[]> findAllOrderByHot();
    
    @Query("SELECT p FROM Post p ORDER BY (p.upvotes - p.downvotes) DESC")
    List<Post> findAllByVoteCountDesc();
    
    @Query("SELECT (p.upvotes - p.downvotes) FROM Post p WHERE p.id = :postId")
    Integer getVoteCountByPostId(Long postId);
}

