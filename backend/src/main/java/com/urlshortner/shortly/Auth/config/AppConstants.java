package com.urlshortner.shortly.Auth.config;

public class AppConstants {
    public final static String[] PUBLIC_URLS = {
            "/api/v1/users/login",
            "/api/v1/users/register",
            "/api/v1/users/google",
            "/v3/api-docs/**",
            "/v2/api-docs",
            "/swagger-resources/**",
            "/swagger-ui/**",
            "/webjars/**",
            "/actuator/health",
            "/oauth2/**",
            "/login/oauth2/**",
            "/api/v1/users/refresh-token",
            "/{shortcode}"
    };
}
