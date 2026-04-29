package com.communityhub.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verifications")
public record EmailVerification(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id,
    
    @Column(nullable = false, unique = true)
    String email,
    
    @Column(nullable = false, unique = true)
    String token,
    
    @Column(nullable = false)
    LocalDateTime expiresAt,
    
    @Column(nullable = false)
    boolean verified,
    
    @CreationTimestamp
    LocalDateTime createdAt
) {
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
