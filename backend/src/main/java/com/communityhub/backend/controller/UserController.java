package com.communityhub.backend.controller;

import com.communityhub.backend.model.Community;
import com.communityhub.backend.security.SecurityUser;
import com.communityhub.backend.service.CommunityService;
import com.communityhub.backend.user.User;
import com.communityhub.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class UserController {

    private final UserRepository userRepository;
    private final CommunityService communityService;

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@AuthenticationPrincipal SecurityUser securityUser) {
        System.out.println("DEBUG: /users/profile endpoint called");

        try {
            if (securityUser == null) {
                System.out.println("DEBUG: securityUser is null");
                return ResponseEntity.status(401).build();
            }

            if (securityUser.getUser() == null) {
                System.out.println("DEBUG: securityUser.getUser() is null");
                return ResponseEntity.status(401).build();
            }

            String username = securityUser.getUser().getUsername();
            System.out.println("DEBUG: Getting profile for username: " + username);

            if (username == null || username.isEmpty()) {
                System.out.println("DEBUG: username is null or empty");
                return ResponseEntity.badRequest().build();
            }

            Optional<User> userOpt = userRepository.findByUsername(username);

            if (userOpt.isEmpty()) {
                System.out.println("DEBUG: User not found for username: " + username);
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            System.out.println("DEBUG: User found, profileImage: " + user.getProfileImage());

            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername() != null ? user.getUsername() : "");
            response.put("email", user.getEmail() != null ? user.getEmail() : "");
            response.put("profileImage", user.getProfileImage()); // Return null instead of empty string
            response.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt() : "");

            System.out.println("DEBUG: Response profileImage: " + response.get("profileImage"));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("DEBUG: Exception in /users/profile at line: " + e.getStackTrace()[0].getLineNumber());
            System.out.println("DEBUG: Exception message: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get profile: " + e.getMessage()));
        }
    }

    @PostMapping("/profile/image")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @AuthenticationPrincipal SecurityUser securityUser,
            @RequestParam("file") MultipartFile file) {

        if (securityUser == null || securityUser.getUser() == null) {
            return ResponseEntity.status(401).build();
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded"));
        }

        // Validate file type
        if (!file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
        }

        // Limit file size to 5MB
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 5MB"));
        }

        try {
            // Convert file to Base64
            byte[] imageBytes = file.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String dataUrl = "data:" + file.getContentType() + ";base64," + base64Image;

            // Update user profile image in database
            String username = securityUser.getUser().getUsername();
            Optional<User> userOpt = userRepository.findByUsername(username);

            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            System.out.println("DEBUG: Setting profile image for user: " + username);
            System.out.println("DEBUG: Image data URL length: " + dataUrl.length());
            System.out.println("DEBUG: Current profile image before update: " + user.getProfileImage());

            user.setProfileImage(dataUrl);
            System.out.println("DEBUG: Profile image set in user object");

            User savedUser = userRepository.save(user);
            System.out.println("DEBUG: User saved to database");
            System.out.println("DEBUG: Saved profile image: " + savedUser.getProfileImage());

            return ResponseEntity.ok(Map.of(
                "message", "Profile image updated successfully",
                "profileImage", dataUrl
            ));

        } catch (IOException e) {
            System.out.println("DEBUG: IOException during image processing: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to process image"));
        }
    }

    @DeleteMapping("/profile/image")
    public ResponseEntity<Map<String, String>> removeProfileImage(@AuthenticationPrincipal SecurityUser securityUser) {
        if (securityUser == null || securityUser.getUser() == null) {
            return ResponseEntity.status(401).build();
        }

        String username = securityUser.getUser().getUsername();
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        user.setProfileImage(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Profile image removed successfully"));
    }

    @DeleteMapping("/account")
    public ResponseEntity<Map<String, String>> deleteAccount(@AuthenticationPrincipal SecurityUser securityUser) {
        System.out.println("DEBUG: /users/account delete endpoint called");

        if (securityUser == null || securityUser.getUser() == null) {
            System.out.println("DEBUG: securityUser is null");
            return ResponseEntity.status(401).build();
        }

        String username = securityUser.getUser().getUsername();
        System.out.println("DEBUG: Deleting account for username: " + username);

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            System.out.println("DEBUG: User not found for username: " + username);
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        System.out.println("DEBUG: User found, deleting account: " + user.getUsername());

        try {
            // Delete user from database (cascade delete will handle related data)
            userRepository.delete(user);
            System.out.println("DEBUG: User deleted from database");

            return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
        } catch (Exception e) {
            System.out.println("DEBUG: Error deleting account: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to delete account: " + e.getMessage()));
        }
    }

    @GetMapping("/me/communities")
    public ResponseEntity<?> getUserCommunities(@AuthenticationPrincipal SecurityUser user) {
        System.out.println("DEBUG: /users/me/communities endpoint called");
        try {
            if (user == null || user.getUser() == null) {
                System.out.println("DEBUG: User not authenticated");
                return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
            }
            String username = user.getUser().getUsername();
            System.out.println("DEBUG: Fetching communities for user: " + username);
            
            List<Community> communities = communityService.getUserCommunities(username);
            return ResponseEntity.ok(communities);
        } catch (Exception e) {
            System.out.println("DEBUG: Error fetching user communities: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch communities: " + e.getMessage()));
        }
    }
}
