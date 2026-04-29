package com.communityhub.backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@Order(1)
public class CorsFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(CorsFilter.class);

    private static final List<String> ALLOWED_ORIGINS = Arrays.asList(
        "http://localhost:5173",
        "http://localhost:5174",
        "https://final-year-project-phi-ten.vercel.app",
        "https://final-year-project-ijhsttq54.vercel.app"
    );

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("CorsFilter initialized");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        String origin = httpRequest.getHeader("Origin");
        String method = httpRequest.getMethod();
        String uri = httpRequest.getRequestURI();
        
        logger.info("CORS Filter - Method: {}, URI: {}, Origin: {}", method, uri, origin);
        logger.info("CORS Filter - ALLOWED_ORIGINS: {}", ALLOWED_ORIGINS);
        
        if (origin != null && ALLOWED_ORIGINS.contains(origin)) {
            logger.info("CORS Filter - Origin {} is ALLOWED", origin);
            httpResponse.setHeader("Access-Control-Allow-Origin", origin);
            httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            httpResponse.setHeader("Access-Control-Allow-Headers", "*");
            httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpResponse.setHeader("Access-Control-Max-Age", "3600");
        } else if (origin != null) {
            logger.warn("CORS Filter - Origin {} is NOT ALLOWED", origin);
        }
        
        logger.info("CORS Filter - Headers set for origin: {}", origin);
        
        if ("OPTIONS".equalsIgnoreCase(method)) {
            logger.info("CORS Filter - Handling OPTIONS preflight request");
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }
}