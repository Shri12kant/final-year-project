package com.communityhub.backend.controller;

import com.communityhub.backend.model.Community;
import com.communityhub.backend.security.SecurityUser;
import com.communityhub.backend.service.CommunityService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
@RequestMapping("/api/communities")
@RequiredArgsConstructor
@Validated
public class CommunityController {

    private final CommunityService communityService;

    @PostMapping
    public ResponseEntity<?> createCommunity(
            @AuthenticationPrincipal SecurityUser user,
            @Valid @RequestBody CreateCommunityRequest request
    ) {
        try {
            // Generate slug from name
            String slug = request.getName().toLowerCase()
                    .replaceAll("[^a-z0-9\\s]", "")
                    .replaceAll("\\s+", "-")
                    .substring(0, Math.min(request.getName().length(), 50));

            Community community = new Community();
            community.setSlug(slug);
            community.setName(request.getName());
            community.setDescription(request.getDescription());
            community.setRules(request.getRules());
            community.setAccent(request.getAccent() != null ? request.getAccent() : "from-blue-500/20 to-cyan-500/20");
            community.setCreatedBy(user.getUser().getUsername());
            community.setMemberCount(1); // Creator is first member

            Community savedCommunity = communityService.createCommunity(community);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCommunity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create community: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getCommunityBySlug(@PathVariable String slug) {
        try {
            Community community = communityService.getCommunityBySlug(slug);
            return ResponseEntity.ok(community);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Community not found"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCommunity(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCommunityRequest request
    ) {
        try {
            Community communityDetails = new Community();
            communityDetails.setName(request.getName());
            communityDetails.setDescription(request.getDescription());
            communityDetails.setRules(request.getRules());
            communityDetails.setAccent(request.getAccent());

            Community updated = communityService.updateCommunity(id, communityDetails, user.getUser().getUsername());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update community"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommunity(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id
    ) {
        try {
            communityService.deleteCommunity(id, user.getUser().getUsername());
            return ResponseEntity.ok(Map.of("message", "Community deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete community"));
        }
    }

    // Request DTOs
    @Data
    @NoArgsConstructor
    public static class CreateCommunityRequest {
        @NotBlank(message = "Name is required")
        @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
        private String name;

        @NotBlank(message = "Description is required")
        @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
        private String description;

        private String rules;

        private String accent;
    }

    @Data
    @NoArgsConstructor
    public static class UpdateCommunityRequest {
        @NotBlank(message = "Name is required")
        @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
        private String name;

        @NotBlank(message = "Description is required")
        @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
        private String description;

        private String rules;

        private String accent;
    }
}
