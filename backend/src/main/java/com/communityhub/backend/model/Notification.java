package com.communityhub.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String username;        // recipient username

    @Column(nullable = false, length = 20)
    private String type;            // VOTE, COMMENT, MENTION

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "related_post_id")
    private Long relatedPostId;

    @Column(name = "related_username", length = 100)
    private String relatedUsername;  // who performed action

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getRelatedPostId() {
        return relatedPostId;
    }

    public void setRelatedPostId(Long relatedPostId) {
        this.relatedPostId = relatedPostId;
    }

    public String getRelatedUsername() {
        return relatedUsername;
    }

    public void setRelatedUsername(String relatedUsername) {
        this.relatedUsername = relatedUsername;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String username;
        private String type;
        private String message;
        private Long relatedPostId;
        private String relatedUsername;
        private LocalDateTime createdAt;
        private Boolean isRead = false;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder type(String type) {
            this.type = type;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder relatedPostId(Long relatedPostId) {
            this.relatedPostId = relatedPostId;
            return this;
        }

        public Builder relatedUsername(String relatedUsername) {
            this.relatedUsername = relatedUsername;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder isRead(Boolean isRead) {
            this.isRead = isRead;
            return this;
        }

        public Notification build() {
            Notification notification = new Notification();
            notification.id = this.id;
            notification.username = this.username;
            notification.type = this.type;
            notification.message = this.message;
            notification.relatedPostId = this.relatedPostId;
            notification.relatedUsername = this.relatedUsername;
            notification.createdAt = this.createdAt;
            notification.isRead = this.isRead;
            return notification;
        }
    }
}
