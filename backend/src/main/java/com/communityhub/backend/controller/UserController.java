package com.communityhub.backend.controller;

import com.communityhub.backend.user.User;
import com.communityhub.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("DEBUG: /users/profile endpoint called");
        
        if (userDetails == null) {
            System.out.println("DEBUG: userDetails is null");
            return ResponseEntity.status(401).build();
        }

        String username = userDetails.getUsername();
        System.out.println("DEBUG: Getting profile for username: " + username);
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            System.out.println("DEBUG: User not found for username: " + username);
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        System.out.println("DEBUG: User found, profileImage: " + user.getProfileImage());
        
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("profileImage", user.getProfileImage());
        response.put("createdAt", user.getCreatedAt());

        System.out.println("DEBUG: Response profileImage: " + response.get("profileImage"));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile/image")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        
        if (userDetails == null) {
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
            String username = userDetails.getUsername();
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
    public ResponseEntity<Map<String, String>> removeProfileImage(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        String username = userDetails.getUsername();
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
    public ResponseEntity<Map<String, String>> deleteAccount(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("DEBUG: /users/account delete endpoint called");
        
        if (userDetails == null) {
            System.out.println("DEBUG: userDetails is null");
            return ResponseEntity.status(401).build();
        }

        String username = userDetails.getUsername();
        System.out.println("DEBUG: Deleting account for username: " + username);
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            System.out.println("DEBUG: User not found for username: " + username);
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        System.out.println("DEBUG: User found, deleting account: " + user.getUsername());
        
        // Delete user from database (cascade delete will handle related data)
        userRepository.delete(user);
        System.out.println("DEBUG: User deleted from database");
        
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}
