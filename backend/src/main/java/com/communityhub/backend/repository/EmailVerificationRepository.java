package com.communityhub.backend.repository;

import com.communityhub.backend.model.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    
    Optional<EmailVerification> findByToken(String token);
    
    void deleteByEmail(String email);
    
    boolean existsByEmailAndVerifiedTrue(String email);
}
