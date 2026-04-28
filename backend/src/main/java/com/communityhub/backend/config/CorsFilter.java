package com.communityhub.backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component
@Order(1)
public class CorsFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(CorsFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        logger.info("CorsFilter initialized");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // Get the origin of the request
        String origin = httpRequest.getHeader("Origin");
        String method = httpRequest.getMethod();
        String uri = httpRequest.getRequestURI();
        
        logger.info("CORS Filter - Method: {}, URI: {}, Origin: {}", method, uri, origin);
        
        // Set CORS headers for all requests
        httpResponse.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", "*");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        httpResponse.setHeader("Access-Control-Max-Age", "3600");
        
        logger.info("CORS Filter - Headers set for origin: {}", origin);
        
        // Handle preflight requests
        if ("OPTIONS".equalsIgnoreCase(method)) {
            logger.info("CORS Filter - Handling OPTIONS preflight request");
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }
        
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Cleanup if needed
    }
}
