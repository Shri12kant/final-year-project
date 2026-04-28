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
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 100)
    private String username;

    @Column(length = 500)
    private String mediaUrl;

    @Column(length = 20)
    private String mediaType;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Integer upvotes = 0;

    @Column(nullable = false)
    private Integer downvotes = 0;

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getUpvotes() {
        return upvotes;
    }

    public void setUpvotes(Integer upvotes) {
        this.upvotes = upvotes;
    }

    public Integer getDownvotes() {
        return downvotes;
    }

    public void setDownvotes(Integer downvotes) {
        this.downvotes = downvotes;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String content;
        private String username;
        private String mediaUrl;
        private String mediaType;
        private LocalDateTime createdAt;
        private Integer upvotes = 0;
        private Integer downvotes = 0;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder content(String content) {
            this.content = content;
            return this;
        }

        public Builder username(String username) {
            this.username = username;
            return this;
        }

        public Builder mediaUrl(String mediaUrl) {
            this.mediaUrl = mediaUrl;
            return this;
        }

        public Builder mediaType(String mediaType) {
            this.mediaType = mediaType;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder upvotes(Integer upvotes) {
            this.upvotes = upvotes;
            return this;
        }

        public Builder downvotes(Integer downvotes) {
            this.downvotes = downvotes;
            return this;
        }

        public Post build() {
            Post post = new Post();
            post.id = this.id;
            post.title = this.title;
            post.content = this.content;
            post.username = this.username;
            post.mediaUrl = this.mediaUrl;
            post.mediaType = this.mediaType;
            post.createdAt = this.createdAt;
            post.upvotes = this.upvotes;
            post.downvotes = this.downvotes;
            return post;
        }
    }
}

