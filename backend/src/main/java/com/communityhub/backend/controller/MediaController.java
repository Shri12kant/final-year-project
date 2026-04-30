package com.communityhub.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
@CrossOrigin(origins = "*")
public class MediaController {

    private static final Logger logger = LoggerFactory.getLogger(MediaController.class);

    @Value("${app.media.upload-dir:uploads}")
    private String uploadDir;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        logger.info("MediaController: Requested file: {}", filename);
        logger.info("MediaController: Upload directory config: {}", uploadDir);
        
        try {
            // Get the absolute path
            Path basePath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = basePath.resolve(filename);
            
            logger.info("MediaController: Base path: {}", basePath);
            logger.info("MediaController: Full file path: {}", filePath);
            logger.info("MediaController: File exists check: {}", filePath.toFile().exists());
            
            // Check if base directory exists
            File baseDir = basePath.toFile();
            if (!baseDir.exists()) {
                logger.error("MediaController: Base directory does not exist: {}", basePath);
                return ResponseEntity.notFound().build();
            }
            
            // List files in directory for debugging
            File[] files = baseDir.listFiles();
            if (files != null) {
                logger.info("MediaController: Files in directory: {} files", files.length);
                for (File f : files) {
                    logger.info("MediaController: - {}", f.getName());
                }
            }
            
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                logger.info("MediaController: File found and readable: {}", filename);
                // Determine content type
                String contentType = determineContentType(filename);
                
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                        .body(resource);
            } else {
                logger.error("MediaController: File not found or not readable: {}", filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            logger.error("MediaController: MalformedURLException for file: {}", filename, e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("MediaController: Unexpected error serving file: {}", filename, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    private String determineContentType(String filename) {
        String lowerFilename = filename.toLowerCase();
        if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (lowerFilename.endsWith(".png")) {
            return "image/png";
        } else if (lowerFilename.endsWith(".gif")) {
            return "image/gif";
        } else if (lowerFilename.endsWith(".webp")) {
            return "image/webp";
        } else if (lowerFilename.endsWith(".mp4")) {
            return "video/mp4";
        } else if (lowerFilename.endsWith(".webm")) {
            return "video/webm";
        }
        return "application/octet-stream";
    }
}
