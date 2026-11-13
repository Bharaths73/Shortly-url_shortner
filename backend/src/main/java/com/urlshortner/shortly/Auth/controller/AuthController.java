package com.urlshortner.shortly.Auth.controller;

import com.urlshortner.shortly.Auth.dtos.*;
import com.urlshortner.shortly.Auth.service.Interfaces.UserAuthService;
import com.urlshortner.shortly.common.response.ApiResponseModel;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class AuthController {
    final private UserAuthService userAuthService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponseModel<UserDto>> login(@RequestBody UserLoginDto user, HttpServletResponse response) {
        UserDto authenticatedUser = userAuthService.login(user, response);
        ApiResponseModel<UserDto> userResponse = ApiResponseModel.<UserDto>builder()
                .data(authenticatedUser)
                .success(true)
                .message("User Authenticated Successfully")
                .build();
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponseModel<UserDto>> register(@RequestBody UserRegisterDto user) {
        UserDto savedUser = userAuthService.register(user);
        ApiResponseModel<UserDto> userResponse = ApiResponseModel.<UserDto>builder()
                .data(savedUser)
                .success(true)
                .message("User Registered Successfully")
                .build();
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<ApiResponseModel<UserDto>> getUser(@PathVariable UUID id) {
        UserDto savedUser = userAuthService.getUser(id);
        ApiResponseModel<UserDto> userResponse = ApiResponseModel.<UserDto>builder()
                .data(savedUser)
                .success(true)
                .message("User Fetched Successfully")
                .build();
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponseModel<UserDto>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        UserDto user = userAuthService.getCurrentUser(email);
        ApiResponseModel<UserDto> userResponse = ApiResponseModel.<UserDto>builder()
                .data(user)
                .success(true)
                .message("User Fetched Successfully")
                .build();
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<ApiResponseModel<UserDto>> updateUser(@PathVariable UUID id) {
        return null;
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<ApiResponseModel<UserDto>> deleteUser(@PathVariable UUID id) {
        return null;
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponseModel<TokenResponse>> refreshToken(@RequestBody(required = false) RefreshTokenRequest body, HttpServletResponse response, HttpServletRequest request) throws InterruptedException {
        TokenResponse tokenResponse = userAuthService.refreshToken(body, response, request);
        ApiResponseModel<TokenResponse> tokens = ApiResponseModel.<TokenResponse>builder()
                .data(tokenResponse)
                .success(true)
                .message("Token Refreshed Successfully")
                .build();
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        userAuthService.logout(request, response);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
