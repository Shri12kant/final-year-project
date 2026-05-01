package com.communityhub.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;

@Configuration
public class WebConfig {

    private static final Logger logger = LoggerFactory.getLogger(WebConfig.class);

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        logger.info("WebConfig CORS bean initialized - Frontend URL: {}", frontendUrl);
        
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow specific origins (required when credentials are enabled)
        List<String> allowedOrigins = Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000",
            "https://final-year-project-phi-ten.vercel.app"
        );
        
        // Add custom frontend URL from env if different
        if (!allowedOrigins.contains(frontendUrl)) {
            allowedOrigins.add(frontendUrl);
        }
        
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedOriginPatterns(List.of("*")); // Fallback for dev
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow all needed methods
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("PATCH");
        
        // Enable credentials (required for JWT/cookies)
        config.setAllowCredentials(true);
        
        // Expose Authorization header
        config.addExposedHeader("Authorization");
        config.addExposedHeader("Content-Type");
        
        // Cache preflight response for 1 hour
        config.setMaxAge(3600L);
        
        logger.info("WebConfig CORS configuration: allowedOrigins={}, allowedMethods={}, allowCredentials={}", 
            config.getAllowedOrigins(), config.getAllowedMethods(), config.getAllowCredentials());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        source.registerCorsConfiguration("/uploads/**", config);
        source.registerCorsConfiguration("/api/**", config);
        source.registerCorsConfiguration("/api/images/**", config);
        return source;
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                            "http://localhost:5173",
                            "http://localhost:3000",
                            "https://final-year-project-phi-ten.vercel.app"
                        )
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization", "Content-Type")
                        .allowCredentials(true)
                        .maxAge(3600);
                        
                registry.addMapping("/uploads/**")
                        .allowedOrigins(
                            "http://localhost:5173",
                            "http://localhost:3000",
                            "https://final-year-project-phi-ten.vercel.app"
                        )
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "HEAD", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
                        
                registry.addMapping("/api/images/**")
                        .allowedOrigins(
                            "http://localhost:5173",
                            "http://localhost:3000",
                            "https://final-year-project-phi-ten.vercel.app"
                        )
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
