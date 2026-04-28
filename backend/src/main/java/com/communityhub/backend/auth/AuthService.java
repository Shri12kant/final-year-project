package com.communityhub.backend.auth;

import com.communityhub.backend.auth.dto.AuthResponse;
import com.communityhub.backend.auth.dto.LoginRequest;
import com.communityhub.backend.auth.dto.RegisterRequest;
import com.communityhub.backend.auth.dto.UserDto;
import com.communityhub.backend.security.JwtService;
import com.communityhub.backend.security.SecurityUser;
import com.communityhub.backend.user.User;
import com.communityhub.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail());
        return AuthResponse.builder()
                .accessToken(token)
                .user(toDto(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()
                )
        );

        SecurityUser principal = (SecurityUser) authentication.getPrincipal();
        User user = principal.getUser();
        String token = jwtService.generateToken(user.getEmail());
        return AuthResponse.builder()
                .accessToken(token)
                .user(toDto(user))
                .build();
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
