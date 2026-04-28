package com.communityhub.backend;

import com.communityhub.backend.service.EmailService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
public class CommunityHubBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommunityHubBackendApplication.class, args);
    }
}
