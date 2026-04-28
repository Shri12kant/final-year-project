package com.communityhub.backend.service;

import com.communityhub.backend.model.Comment;
import com.communityhub.backend.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostService postService;

    public Comment addComment(Long postId, Comment comment) {
        // Ensure the parent post exists before saving comment.
        postService.getPostById(postId);

        comment.setId(null);
        comment.setPostId(postId);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(Long postId) {
        // Fail fast if post does not exist.
        postService.getPostById(postId);
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }
}

