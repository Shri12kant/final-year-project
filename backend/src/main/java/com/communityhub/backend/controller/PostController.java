package com.communityhub.backend.controller;

import com.communityhub.backend.model.Post;
import com.communityhub.backend.model.Vote;
import com.communityhub.backend.security.SecurityUser;
import com.communityhub.backend.service.MediaStorageService;
import com.communityhub.backend.service.PostService;
import com.communityhub.backend.service.VoteService;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Validated
public class PostController {

    private final PostService postService;
    private final MediaStorageService mediaStorageService;
    private final VoteService voteService;

    @PostMapping
    public ResponseEntity<Post> createPost(
            @AuthenticationPrincipal SecurityUser user,
            @Valid @RequestBody CreatePostRequest request
    ) {
        String username = (request.getUsername() != null && !request.getUsername().isBlank())
                ? request.getUsername().trim()
                : user.getUser().getUsername();

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .username(username)
                .communitySlug(request.getCommunitySlug())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(post));
    }

    @PostMapping(value = "/with-media", consumes = {"multipart/form-data"})
    public ResponseEntity<Post> createPostWithMedia(
            @AuthenticationPrincipal SecurityUser user,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "communitySlug", required = false) String communitySlug,
            @RequestParam(value = "username", required = false) String username,
            @RequestPart("file") MultipartFile file
    ) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("title is required");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("content is required");
        }

        String effectiveUsername = (username != null && !username.isBlank())
                ? username.trim()
                : user.getUser().getUsername();

        var stored = mediaStorageService.store(file);
        Post post = Post.builder()
                .title(title.trim())
                .content(content.trim())
                .username(effectiveUsername)
                .communitySlug(communitySlug)
                .mediaUrl(stored.mediaUrl())
                .mediaType(stored.mediaType())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(post));
    }

    @GetMapping
    public List<Post> getAllPosts(
            @RequestParam(defaultValue = "hot") String sortBy
    ) {
        List<Post> posts = postService.getPostsSortedBy(sortBy);
        return postService.getPostsWithVoteCount(posts);
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @GetMapping("/{id}/vote-count")
    public ResponseEntity<Integer> getVoteCount(@PathVariable Long id) {
        Integer voteCount = postService.getVoteCount(id);
        return ResponseEntity.ok(voteCount);
    }

    @GetMapping("/sorted")
    public ResponseEntity<List<Post>> getPostsSorted(
            @RequestParam(defaultValue = "top") String sortBy
    ) {
        List<Post> posts = postService.getPostsSortedBy(sortBy);
        List<Post> postsWithVoteCount = postService.getPostsWithVoteCount(posts);
        return ResponseEntity.ok(postsWithVoteCount);
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<VoteResponse> voteOnPost(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id,
            @RequestBody VoteRequest request
    ) {
        String username = user.getUser().getUsername();
        Vote vote = voteService.voteOnPost(id, username, request.getVoteType());
        
        VoteResponse response = new VoteResponse();
        if (vote == null) {
            response.setMessage("Vote removed successfully");
            response.setVoteType(0);
        } else {
            response.setMessage("Vote recorded successfully");
            response.setVoteType(vote.getVoteType());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/vote")
    public ResponseEntity<UserVoteResponse> getUserVote(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id
    ) {
        String username = user.getUser().getUsername();
        return voteService.getUserVote(id, username)
                .map(vote -> ResponseEntity.ok(new UserVoteResponse(vote.getVoteType())))
                .orElse(ResponseEntity.ok(new UserVoteResponse(0)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id
    ) {
        postService.deletePost(id, user.getUser().getUsername());
        return ResponseEntity.noContent().build();
    }

    
    public static class CreatePostRequest {
        @NotBlank
        private String title;
        @NotBlank
        private String content;
        /**
         * Optional override. If omitted, the authenticated user's username is used.
         */
        private String username;
        
        private String communitySlug;

        public CreatePostRequest() {}

        public CreatePostRequest(String title, String content, String username, String communitySlug) {
            this.title = title;
            this.content = content;
            this.username = username;
            this.communitySlug = communitySlug;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getCommunitySlug() {
            return communitySlug;
        }

        public void setCommunitySlug(String communitySlug) {
            this.communitySlug = communitySlug;
        }
    }

    public static class VoteRequest {
        private Integer voteType; // 1 for upvote, -1 for downvote

        public VoteRequest() {}

        public VoteRequest(Integer voteType) {
            this.voteType = voteType;
        }

        public Integer getVoteType() {
            return voteType;
        }

        public void setVoteType(Integer voteType) {
            this.voteType = voteType;
        }
    }

    public static class VoteResponse {
        private String message;
        private Integer voteType; // 0 if vote was removed, 1 or -1 if voted

        public VoteResponse() {}

        public VoteResponse(String message, Integer voteType) {
            this.message = message;
            this.voteType = voteType;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Integer getVoteType() {
            return voteType;
        }

        public void setVoteType(Integer voteType) {
            this.voteType = voteType;
        }
    }

    public static class UserVoteResponse {
        private Integer voteType; // 0 if no vote, 1 or -1 if voted

        public UserVoteResponse() {}

        public UserVoteResponse(Integer voteType) {
            this.voteType = voteType;
        }

        public Integer getVoteType() {
            return voteType;
        }

        public void setVoteType(Integer voteType) {
            this.voteType = voteType;
        }
    }
}

