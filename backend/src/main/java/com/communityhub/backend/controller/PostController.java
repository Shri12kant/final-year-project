package com.communityhub.backend.controller;

import com.communityhub.backend.model.Post;
import com.communityhub.backend.model.Vote;
import com.communityhub.backend.security.SecurityUser;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Validated
@CrossOrigin(
    origins = {"http://localhost:5173", "http://localhost:3000", "https://final-year-project-phi-ten.vercel.app"},
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowCredentials = "false"
)
public class PostController {

    private final PostService postService;
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
                .mediaUrl(request.getImageUrl())
                .mediaType(request.getImageUrl() != null ? "image" : null)
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
        try {
            if (user == null || user.getUser() == null) {
                VoteResponse response = new VoteResponse();
                response.setMessage("User not authenticated");
                return ResponseEntity.status(401).body(response);
            }

            String username = user.getUser().getUsername();
            if (username == null || username.isEmpty()) {
                VoteResponse response = new VoteResponse();
                response.setMessage("Invalid user");
                return ResponseEntity.badRequest().body(response);
            }

            if (id == null || id <= 0) {
                VoteResponse response = new VoteResponse();
                response.setMessage("Invalid post ID");
                return ResponseEntity.badRequest().body(response);
            }

            if (request == null || request.getVoteType() == null) {
                VoteResponse response = new VoteResponse();
                response.setMessage("Invalid vote type");
                return ResponseEntity.badRequest().body(response);
            }

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
        } catch (Exception e) {
            VoteResponse response = new VoteResponse();
            response.setMessage("Vote failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
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
    public ResponseEntity<?> deletePost(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id
    ) {
        System.out.println("DEBUG: Controller deletePost called for id: " + id);
        
        try {
            if (user == null) {
                System.out.println("DEBUG: User is null - unauthorized");
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }
            
            if (user.getUser() == null) {
                System.out.println("DEBUG: user.getUser() is null - unauthorized");
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }
            
            String username = user.getUser().getUsername();
            if (username == null || username.isEmpty()) {
                System.out.println("DEBUG: Username is null or empty");
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }
            
            System.out.println("DEBUG: Calling service deletePost for user: " + username);
            postService.deletePost(id, username);
            System.out.println("DEBUG: Service deletePost completed successfully");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in controller deletePost: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Delete failed: " + e.getMessage()));
        }
    }

    
    public static class CreatePostRequest {
        @NotBlank(message = "title is required")
        private String title;
        private String content;
        private String username;
        private String communitySlug;
        private String imageUrl;

        public CreatePostRequest() {}

        public CreatePostRequest(String title, String content, String username, String communitySlug, String imageUrl) {
            this.title = title;
            this.content = content;
            this.username = username;
            this.communitySlug = communitySlug;
            this.imageUrl = imageUrl;
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

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
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

