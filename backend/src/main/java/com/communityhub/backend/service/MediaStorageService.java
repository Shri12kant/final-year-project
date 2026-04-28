package com.communityhub.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class MediaStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"
    );

    private final Path uploadDir;

    public MediaStorageService(@Value("${app.media.upload-dir:uploads}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public StoredMedia store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Media file is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only JPG/PNG/WEBP/GIF images or MP4/WEBM videos are allowed");
        }

        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not initialize upload directory");
        }

        String ext = extensionFromContentType(contentType);
        String fileName = UUID.randomUUID() + ext;
        Path target = uploadDir.resolve(fileName);

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not store media file");
        }

        String mediaType = contentType.startsWith("video/") ? "video" : "image";
        return new StoredMedia("/uploads/" + fileName, mediaType);
    }

    private String extensionFromContentType(String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            case "video/mp4" -> ".mp4";
            case "video/webm" -> ".webm";
            default -> "";
        };
    }

    public record StoredMedia(String mediaUrl, String mediaType) {
    }
}
