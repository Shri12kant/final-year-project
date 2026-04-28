package com.communityhub.backend.controller;

import com.communityhub.backend.model.Comment;
import com.communityhub.backend.security.SecurityUser;
import com.communityhub.backend.service.CommentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
@Validated
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long postId,
            @Valid @RequestBody AddCommentRequest request
    ) {
        String username = (request.getUsername() != null && !request.getUsername().isBlank())
                ? request.getUsername().trim()
                : user.getUser().getUsername();

        Comment comment = Comment.builder()
                .text(request.getText())
                .username(username)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.addComment(postId, comment));
    }

    @GetMapping
    public List<Comment> getCommentsByPostId(@PathVariable Long postId) {
        return commentService.getCommentsByPostId(postId);
    }

    public static class AddCommentRequest {
        @NotBlank
        private String text;
        /**
         * Optional override. If omitted, the authenticated user's username is used.
         */
        private String username;

        public AddCommentRequest() {}

        public AddCommentRequest(String text, String username) {
            this.text = text;
            this.username = username;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
}

