package com.urlshortner.shortly.Auth.exception.custom;

import com.urlshortner.shortly.common.response.ApiErrorModel;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    private void writeResponse(HttpServletResponse response, int status, ApiErrorModel apiError) throws IOException {

        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        objectMapper.writeValue(response.getWriter(), apiError);
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.AuthenticationException authException) throws IOException, ServletException {
        ApiErrorModel apiError = ApiErrorModel.builder()
                .success(false)
                .message("Authentication is required to access this resource")
                .build();

        writeResponse(
                response,
                HttpServletResponse.SC_UNAUTHORIZED,
                apiError
        );
    }
}

