package com.communityhub.backend.service;

import com.communityhub.backend.exception.ForbiddenException;
import com.communityhub.backend.exception.ResourceNotFoundException;
import com.communityhub.backend.model.Post;
import com.communityhub.backend.repository.CommentRepository;
import com.communityhub.backend.repository.PostRepository;
import com.communityhub.backend.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final VoteRepository voteRepository;
    private final NotificationService notificationService;

    public Post createPost(Post post) {
        post.setId(null);
        Post savedPost = postRepository.save(post);
        
        // Create notification for post creation
        notificationService.createPostNotification(post.getUsername(), savedPost.getId(), post.getTitle());
        
        return savedPost;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByVoteCountDesc();
    }

    public List<Post> getAllPostsOrderByVoteScore() {
        return postRepository.findAllByVoteCountDesc();
    }

    public List<Post> getAllPostsOrderByCreatedAt() {
        return postRepository.findAllOrderByCreatedAt();
    }

    public List<Post> getAllPostsOrderByHot() {
        return postRepository.findAllByVoteCountDesc();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    @Transactional
    public void deletePost(Long id, String requesterUsername) {
        Post post = getPostById(id);
        if (requesterUsername == null || !post.getUsername().equals(requesterUsername)) {
            throw new ForbiddenException("You can only delete your own posts");
        }
        
        // Create notification for post deletion
        notificationService.createPostDeletedNotification(post.getUsername(), post.getId(), post.getTitle());
        
        // First delete related votes
        voteRepository.deleteByPostId(post.getId());
        
        // Then delete related comments
        commentRepository.deleteByPostId(post.getId());
        
        // Finally delete the post
        postRepository.delete(post);
    }

    public Integer getVoteCount(Long postId) {
        Integer voteCount = postRepository.getVoteCountByPostId(postId);
        return voteCount != null ? voteCount : 0;
    }

    public List<Post> getPostsWithVoteCount(List<Post> posts) {
        List<Post> postsWithVoteCount = new ArrayList<>();
        for (Post post : posts) {
            post.setUpvotes(post.getUpvotes() != null ? post.getUpvotes() : 0);
            post.setDownvotes(post.getDownvotes() != null ? post.getDownvotes() : 0);
            postsWithVoteCount.add(post);
        }
        return postsWithVoteCount;
    }

    public List<Post> getPostsSortedBy(String sortBy) {
        switch (sortBy.toLowerCase()) {
            case "top":
                return getAllPostsOrderByVoteScore();
            case "new":
                return getAllPostsOrderByCreatedAt();
            case "hot":
                return getAllPostsOrderByHot();
            default:
                return getAllPosts();
        }
    }
}

