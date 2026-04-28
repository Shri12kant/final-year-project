package com.communityhub.backend.service;

import com.communityhub.backend.model.Notification;
import com.communityhub.backend.repository.NotificationRepository;
import com.communityhub.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Transactional
    public Notification createNotification(String username, String type, String message, 
                                         Long relatedPostId, String relatedUsername) {
        Notification notification = Notification.builder()
                .username(username)
                .type(type)
                .message(message)
                .relatedPostId(relatedPostId)
                .relatedUsername(relatedUsername)
                .isRead(false)
                .build();
        
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(String username) {
        return notificationRepository.findByUsernameOrderByCreatedAtDesc(username);
    }

    public List<Notification> getUnreadNotifications(String username) {
        return notificationRepository.findByUsernameAndIsReadFalseOrderByCreatedAtDesc(username);
    }

    public Long getUnreadCount(String username) {
        Long count = notificationRepository.countUnreadNotifications(username);
        System.out.println("DEBUG: Getting unread count for user: " + username + ", count: " + count);
        return count;
    }

    @Transactional
    public void markAsRead(Long notificationId, String username) {
        notificationRepository.markAsRead(notificationId, username);
    }

    @Transactional
    public void markAllAsRead(String username) {
        notificationRepository.markAllAsRead(username);
    }

    @Transactional
    public void cleanupReadNotifications(String username) {
        notificationRepository.deleteByUsernameAndIsReadTrue(username);
    }

    // Notification creation helpers
    public void createVoteNotification(String postAuthor, String voterUsername, Long postId, String postTitle) {
        if (!postAuthor.equals(voterUsername)) {
            String message = String.format("%s voted on your post", voterUsername);
            createNotification(postAuthor, "VOTE", message, postId, voterUsername);
            
            // Send email notification to post author
            try {
                String userEmail = getUserEmail(postAuthor);
                if (userEmail != null) {
                    emailService.sendVoteNotificationEmail(userEmail, postAuthor, voterUsername, postTitle);
                }
            } catch (Exception e) {
                log.error("Failed to send vote notification email to user: {}", postAuthor, e);
            }
        }
    }

    public void createCommentNotification(String postAuthor, String commenterUsername, Long postId) {
        if (!postAuthor.equals(commenterUsername)) {
            String message = String.format("%s commented on your post", commenterUsername);
            createNotification(postAuthor, "COMMENT", message, postId, commenterUsername);
        }
    }

    public void createMentionNotification(String mentionedUsername, String mentionerUsername, Long postId) {
        if (!mentionedUsername.equals(mentionerUsername)) {
            String message = String.format("%s mentioned you in a post", mentionerUsername);
            createNotification(mentionedUsername, "MENTION", message, postId, mentionerUsername);
        }
    }

    public void createPostNotification(String postAuthor, Long postId, String postTitle) {
        String message = String.format("You created a new post");
        createNotification(postAuthor, "POST_CREATED", message, postId, postAuthor);
        
        // Send email notification
        try {
            String userEmail = getUserEmail(postAuthor);
            if (userEmail != null) {
                emailService.sendPostCreationEmail(userEmail, postAuthor, postTitle);
            }
        } catch (Exception e) {
            log.error("Failed to send post creation email to user: {}", postAuthor, e);
        }
    }

    public void createPostDeletedNotification(String postAuthor, Long postId, String postTitle) {
        String message = String.format("Your post was deleted");
        createNotification(postAuthor, "POST_DELETED", message, postId, postAuthor);
        
        // Send email notification
        try {
            String userEmail = getUserEmail(postAuthor);
            if (userEmail != null) {
                emailService.sendPostDeletionEmail(userEmail, postAuthor, postTitle);
            }
        } catch (Exception e) {
            log.error("Failed to send post deletion email to user: {}", postAuthor, e);
        }
    }

    public void createSystemNotification(String username, String message, String type) {
        createNotification(username, type, message, null, "System");
    }

    private String getUserEmail(String username) {
        try {
            return userRepository.findByUsernameIgnoreCase(username)
                    .map(user -> user.getEmail())
                    .orElse(null);
        } catch (Exception e) {
            log.error("Failed to get email for user: {}", username, e);
            return null;
        }
    }
}
