package com.communityhub.backend.service;

import com.communityhub.backend.model.EmailVerification;
import com.communityhub.backend.repository.EmailVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {

    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailService emailService;

    public String generateVerificationToken(String email) {
        // Delete any existing verification for this email
        emailVerificationRepository.deleteByEmail(email);
        
        String token = UUID.randomUUID().toString();
        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .verified(false)
                .build();
        
        emailVerificationRepository.save(verification);
        
        // Send verification email
        emailService.sendEmailVerificationEmail(email, token);
        
        log.info("Verification token generated for email: {}", email);
        return token;
    }

    @Transactional
    public boolean verifyEmail(String token) {
        EmailVerification verification = emailVerificationRepository.findByToken(token).orElse(null);
        
        if (verification == null) {
            log.warn("Invalid verification token: {}", token);
            return false;
        }
        
        if (verification.isExpired()) {
            log.warn("Expired verification token: {}", token);
            emailVerificationRepository.delete(verification);
            return false;
        }
        
        if (verification.isVerified()) {
            log.warn("Already verified token: {}", token);
            return false;
        }
        
        // Mark as verified
        verification.setVerified(true);
        emailVerificationRepository.save(verification);
        
        log.info("Email verified successfully: {}", verification.getEmail());
        return true;
    }

    public boolean isEmailVerified(String email) {
        return emailVerificationRepository.existsByEmailAndVerifiedTrue(email);
    }
}
