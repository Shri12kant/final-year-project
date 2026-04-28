package com.communityhub.backend.auth;

import com.communityhub.backend.auth.dto.AuthResponse;
import com.communityhub.backend.auth.dto.LoginRequest;
import com.communityhub.backend.auth.dto.RegisterRequest;
import com.communityhub.backend.auth.dto.UserDto;
import com.communityhub.backend.security.SecurityUser;
import com.communityhub.backend.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        // Send verification email
        emailVerificationService.generateVerificationToken(request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        try {
            log.info("Email verification attempt with token: {}", token);
            boolean verified = emailVerificationService.verifyEmail(token);
            if (verified) {
                log.info("Email verified successfully for token: {}", token);
                return ResponseEntity.ok("✅ Email verified successfully! You can now use your account.");
            } else {
                log.warn("Email verification failed - Invalid or expired token: {}", token);
                return ResponseEntity.badRequest().body("❌ Invalid or expired verification link. Please request a new verification email.");
            }
        } catch (Exception e) {
            log.error("Email verification error for token: {} | Error: {}", token, e.getMessage(), e);
            return ResponseEntity.status(500).body("⚠️ Server error during verification. Please try again later.");
        }
    }

    @GetMapping("/me")
    public UserDto me(@AuthenticationPrincipal SecurityUser user) {
        return UserDto.builder()
                .id(user.getUser().getId())
                .username(user.getUser().getUsername())
                .email(user.getUser().getEmail())
                .build();
    }
}
