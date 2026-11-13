package com.urlshortner.shortly.Auth.exception;

import com.urlshortner.shortly.Auth.exception.custom.EmailNotVerifiedException;
import com.urlshortner.shortly.Auth.exception.custom.InvalidCredentialsException;
import com.urlshortner.shortly.Auth.exception.custom.UserAlreadyExistsException;
import com.urlshortner.shortly.common.response.ApiErrorModel;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiErrorModel> handleInvalidCredentials(InvalidCredentialsException ex, HttpServletRequest request) {
        ApiErrorModel error = ApiErrorModel.builder()
                .success(false)
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(error);
    }

    @ExceptionHandler(EmailNotVerifiedException.class)
    public ResponseEntity<ApiErrorModel> handleEmailNotVerified(
            EmailNotVerifiedException ex,
            HttpServletRequest request) {

        ApiErrorModel error = ApiErrorModel.builder()
                .success(false)
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(error);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiErrorModel> handleEmailAlreadyExists(
            UserAlreadyExistsException ex,
            HttpServletRequest request) {

        ApiErrorModel error = ApiErrorModel.builder()
                .success(false)
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(error);
    }
}
