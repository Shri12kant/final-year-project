package com.communityhub.backend.controller;

import com.communityhub.backend.model.Notification;
import com.communityhub.backend.security.SecurityUser;
import com.communityhub.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(
            @AuthenticationPrincipal SecurityUser user
    ) {
        String username = user.getUser().getUsername();
        List<Notification> notifications = notificationService.getUserNotifications(username);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @AuthenticationPrincipal SecurityUser user
    ) {
        String username = user.getUser().getUsername();
        List<Notification> notifications = notificationService.getUnreadNotifications(username);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal SecurityUser user
    ) {
        String username = user.getUser().getUsername();
        Long count = notificationService.getUnreadCount(username);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUser user
    ) {
        String username = user.getUser().getUsername();
        notificationService.markAsRead(id, username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal SecurityUser user
    ) {
        String username = user.getUser().getUsername();
        notificationService.markAllAsRead(username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cleanup")
    public ResponseEntity<Void> cleanupReadNotifications(
            @AuthenticationPrincipal SecurityUser user
    ) {
        String username = user.getUser().getUsername();
        notificationService.cleanupReadNotifications(username);
        return ResponseEntity.ok().build();
    }
}
