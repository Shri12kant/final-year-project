package com.communityhub.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPostCreationEmail(String userEmail, String username, String postTitle) {
        try {
            log.info("Attempting to send post creation email to: {}", userEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(userEmail);
            message.setSubject("🎉 Your Post Created Successfully!");
            message.setText(buildPostCreationEmail(username, postTitle));
            
            mailSender.send(message);
            log.info("✅ Post creation email sent successfully to: {}", userEmail);
        } catch (Exception e) {
            log.error("❌ Failed to send post creation email to: {} | Error: {}", userEmail, e.getMessage(), e);
            log.error("Email configuration - Host: {}, Port: {}, Username: {}", 
                "smtp.gmail.com", "587", "shrikantkushwaha390@gmail.com");
        }
    }

    public void sendPostDeletionEmail(String userEmail, String username, String postTitle) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(userEmail);
            message.setSubject("🗑️ Your Post Deleted");
            message.setText(buildPostDeletionEmail(username, postTitle));
            
            mailSender.send(message);
            log.info("Post deletion email sent to: {}", userEmail);
        } catch (Exception e) {
            log.error("Failed to send post deletion email to: {}", userEmail, e);
        }
    }

    public void sendVoteNotificationEmail(String userEmail, String postAuthor, String voterUsername, String postTitle) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(userEmail);
            message.setSubject("👍 New Vote on Your Post!");
            message.setText(buildVoteNotificationEmail(postAuthor, voterUsername, postTitle));
            
            mailSender.send(message);
            log.info("Vote notification email sent to: {}", userEmail);
        } catch (Exception e) {
            log.error("Failed to send vote notification email to: {}", userEmail, e);
        }
    }

    private String buildPostCreationEmail(String username, String postTitle) {
        return String.format(
            "🎉 Post Created Successfully!\n\n" +
            "Hello %s!\n\n" +
            "Great news! Your post has been published successfully on CommunityHub.\n\n" +
            "📝 POST DETAILS:\n" +
            "Title: %s\n" +
            "Author: %s\n" +
            "Created: %s\n\n" +
            "✅ What happens next:\n" +
            "   • Your post is now live\n" +
            "   • Other users can vote and comment\n" +
            "   • You'll receive notifications for interactions\n\n" +
            "🚀 Keep creating amazing content!\n\n" +
            "Best regards,\n" +
            "CommunityHub Team\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "This is an automated notification. Please do not reply.",
            username,
            postTitle,
            username,
            java.time.LocalDateTime.now().toString()
        );
    }

    private String buildPostDeletionEmail(String username, String postTitle) {
        return String.format(
            "Hello %s!\n\n" +
            "🗑️ Your post has been deleted successfully.\n\n" +
            "Deleted Post Details:\n" +
            "Title: %s\n" +
            "Deleted: %s\n\n" +
            "If you didn't delete this post, please contact support immediately.\n\n" +
            "Best regards,\n" +
            "CommunityHub Team\n\n" +
            "---\n" +
            "This is an automated notification. Please do not reply to this email.",
            username,
            postTitle,
            java.time.LocalDateTime.now().toString()
        );
    }

    private String buildVoteNotificationEmail(String postAuthor, String voterUsername, String postTitle) {
        return String.format(
            "Hello %s!\n\n" +
            "👍 Exciting news! %s has voted on your post.\n\n" +
            "Post Details:\n" +
            "Title: %s\n" +
            "Voted by: %s\n" +
            "Time: %s\n\n" +
            "Your post is getting engagement! Keep up the great work!\n\n" +
            "Best regards,\n" +
            "CommunityHub Team\n\n" +
            "---\n" +
            "This is an automated notification. Please do not reply to this email.",
            postAuthor,
            voterUsername,
            postTitle,
            voterUsername,
            java.time.LocalDateTime.now().toString()
        );
    }

    public void sendEmailVerificationEmail(String userEmail, String token) {
        try {
            log.info("Attempting to send email verification to: {}", userEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(userEmail);
            message.setSubject("✅ Verify Your CommunityHub Account");
            message.setText(buildEmailVerificationEmail(token));
            
            mailSender.send(message);
            log.info("✅ Email verification sent successfully to: {}", userEmail);
        } catch (Exception e) {
            log.error("❌ Failed to send email verification to: {} | Error: {}", userEmail, e.getMessage(), e);
        }
    }

    private String buildEmailVerificationEmail(String token) {
        return String.format(
            "🎉 Welcome to CommunityHub!\n\n" +
            "Hello User!\n\n" +
            "Thank you for registering with CommunityHub. To complete your registration, please verify your email address.\n\n" +
            "📧 VERIFICATION LINK:\n" +
            "http://localhost:8084/api/auth/verify-email?token=%s\n\n" +
            "⏰ This link will expire in 24 hours.\n\n" +
            "🔐 If you didn't create this account, please ignore this email.\n\n" +
            "✅ After verification, you can:\n" +
            "   • Create and share posts\n" +
            "   • Vote on community content\n" +
            "   • Receive real-time notifications\n\n" +
            "📱 TROUBLESHOOTING:\n" +
            "   • If link doesn't work, copy and paste it in browser\n" +
            "   • Make sure backend is running on port 8084\n" +
            "   • Contact support if issues persist\n\n" +
            "Best regards,\n" +
            "🚀 CommunityHub Team\n\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "This is an automated message. Please do not reply.",
            token
        );
    }
}
