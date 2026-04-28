package com.communityhub.backend.auth.dto;

public class AuthResponse {
    private String accessToken;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(String accessToken, UserDto user) {
        this.accessToken = accessToken;
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String accessToken;
        private UserDto user;

        public Builder accessToken(String accessToken) {
            this.accessToken = accessToken;
            return this;
        }

        public Builder user(UserDto user) {
            this.user = user;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(accessToken, user);
        }
    }
}
