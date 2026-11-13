package com.urlshortner.shortly.Auth.service.Interfaces;

import com.urlshortner.shortly.Auth.dtos.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.UUID;

public interface UserAuthService {
    public UserDto login(UserLoginDto user, HttpServletResponse response);

    public UserDto register(UserRegisterDto user);

    public UserDto getUser(UUID id);

    public UserDto updateUser();

    public String deleteUser();

    public TokenResponse refreshToken(RefreshTokenRequest body, HttpServletResponse response, HttpServletRequest request) throws InterruptedException;

    public void logout(HttpServletRequest request, HttpServletResponse response);

    UserDto getCurrentUser(String email);
}
