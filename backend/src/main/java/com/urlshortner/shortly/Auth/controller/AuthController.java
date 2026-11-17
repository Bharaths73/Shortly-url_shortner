package com.urlshortner.shortly.Auth.controller;

import com.urlshortner.shortly.Auth.dtos.*;
import com.urlshortner.shortly.Auth.entities.User;
import com.urlshortner.shortly.Auth.service.Interfaces.UserAuthService;
import com.urlshortner.shortly.common.response.ApiResponseModel;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
                .timestamp(LocalDateTime.now())
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
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<ApiResponseModel<UserDto>> getUser(@PathVariable UUID id) {
        UserDto savedUser = userAuthService.getUser(id);
        savedUser.setPassword(null);
        ApiResponseModel<UserDto> userResponse = ApiResponseModel.<UserDto>builder()
                .data(savedUser)
                .success(true)
                .message("User Fetched Successfully")
                .timestamp(LocalDateTime.now())
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
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/user/me")
    public ResponseEntity<ApiResponseModel<UserDto>> updateUser(@Valid @RequestBody UpdateUserRequestDto userDto, Authentication principal, HttpServletResponse response, HttpServletRequest request) throws InterruptedException {
        User authenticatedUser = (User) principal.getPrincipal();
        UserDto updateUser= userAuthService.updateUser(userDto, authenticatedUser, response, request);
        updateUser.setPassword(null);
        ApiResponseModel<UserDto> userResponse = ApiResponseModel.<UserDto>builder()
                .data(updateUser)
                .success(true)
                .message("User Updated Successfully")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(userResponse);
    }

    @PatchMapping("/user/me/password")
    public ResponseEntity<ApiResponseModel<UserDto>> updateUserPassword(@Valid @RequestBody UpdatePasswordDto passwordDto, Authentication principal) {
        User user = (User) principal.getPrincipal();
        UserDto updateUserPassword = userAuthService.updateUserPassword(passwordDto, user);
        updateUserPassword.setPassword(null);
        ApiResponseModel<UserDto> userResponse = ApiResponseModel.<UserDto>builder()
                .data(updateUserPassword)
                .success(true)
                .message("Password Updated Successfully")
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(userResponse);
    }

//    @DeleteMapping("/user/{id}")
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
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(tokens);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        userAuthService.logout(request, response);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
