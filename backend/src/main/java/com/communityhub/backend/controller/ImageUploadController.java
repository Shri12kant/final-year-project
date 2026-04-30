package com.communityhub.backend.controller;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageUploadController {

    @Autowired
    private Cloudinary cloudinary;

    // Allowed image types
    private static final String[] ALLOWED_TYPES = {
        "image/jpeg", "image/png", "image/gif", "image/webp"
    };

    // Max file size: 10MB
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file) {
        
        Map<String, Object> response = new HashMap<>();

        // Validation 1: Check if file is empty
        if (file.isEmpty()) {
            response.put("success", false);
            response.put("error", "File is empty");
            return ResponseEntity.badRequest().body(response);
        }

        // Validation 2: Check file type
        String contentType = file.getContentType();
        if (contentType == null || !isAllowedType(contentType)) {
            response.put("success", false);
            response.put("error", "Only JPG, PNG, GIF, and WEBP images are allowed");
            return ResponseEntity.badRequest().body(response);
        }

        // Validation 3: Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            response.put("success", false);
            response.put("error", "File size exceeds 10MB limit");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Upload to Cloudinary
            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("folder", "communityhub/posts");
            uploadParams.put("resource_type", "image");
            uploadParams.put("quality", "auto");
            uploadParams.put("fetch_format", "auto");

            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(), 
                uploadParams
            );

            // Extract URL and public ID
            String imageUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            response.put("success", true);
            response.put("url", imageUrl);
            response.put("publicId", publicId);
            response.put("message", "Image uploaded successfully");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("success", false);
            response.put("error", "Failed to read file: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/delete/{publicId}")
    public ResponseEntity<Map<String, Object>> deleteImage(@PathVariable String publicId) {
        Map<String, Object> response = new HashMap<>();

        try {
            cloudinary.uploader().destroy(publicId, new HashMap<>());
            
            response.put("success", true);
            response.put("message", "Image deleted successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Delete failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    private boolean isAllowedType(String contentType) {
        for (String type : ALLOWED_TYPES) {
            if (type.equals(contentType)) {
                return true;
            }
        }
        return false;
    }
}
