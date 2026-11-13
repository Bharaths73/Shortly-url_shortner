package com.urlshortner.shortly.Auth.service.Implementation;

import com.urlshortner.shortly.Auth.dtos.*;
import com.urlshortner.shortly.Auth.entities.RefreshToken;
import com.urlshortner.shortly.Auth.entities.User;
import com.urlshortner.shortly.Auth.exception.custom.EmailNotVerifiedException;
import com.urlshortner.shortly.Auth.exception.custom.InvalidCredentialsException;
import com.urlshortner.shortly.Auth.exception.custom.UserAlreadyExistsException;
import com.urlshortner.shortly.Auth.repository.RefreshTokenRepository;
import com.urlshortner.shortly.Auth.repository.UserRepo;
import com.urlshortner.shortly.Auth.service.CookieService;
import com.urlshortner.shortly.Auth.service.Interfaces.UserAuthService;
import com.urlshortner.shortly.Auth.service.JWTService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserAuthServiceImpl implements UserAuthService {

    final private UserRepo userRepo;
    final private ModelMapper modelMapper;
    final private AuthenticationManager authenticationManager;
    final private JWTService jwtService;
    final private BCryptPasswordEncoder bCryptPasswordEncoder;
    final private CookieService cookieService;
    final private RefreshTokenRepository refreshTokenRepository;

    @Override
    public UserDto login(UserLoginDto user, HttpServletResponse response) {
        Authentication authentication;

        try {
            authentication=authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            user.getPassword()));
        } catch (BadCredentialsException e){
            throw new InvalidCredentialsException("Invalid username or password");
        } catch (DisabledException ex) {
            throw new EmailNotVerifiedException("Please verify your email using the verification link sent to your email");
        }

        User validUser=(User) authentication.getPrincipal();
        String jti = UUID.randomUUID().toString();
        RefreshToken refreshTokenOb = RefreshToken.builder()
                .jti(jti)
                .user(validUser)
                .revoked(false)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .build();
        refreshTokenRepository.save(refreshTokenOb);
        String accessToken=jwtService.generateAccessToken(validUser);
        String refreshToken=jwtService.generateRefreshToken(validUser,refreshTokenOb.getJti());
        cookieService.attachRefreshCookie(response, refreshToken, (int) jwtService.getRefreshTtlSeconds());
        cookieService.addNoStoreHeaders(response);
        return UserDto
                .builder()
                .accessToken(accessToken)
                .id(validUser.getId())
                .email(validUser.getEmail())
                .firstName(validUser.getFirstName())
                .lastName(validUser.getLastName())
                .isVerified(validUser.isVerified())
                .build();
    }

    @Override
    public UserDto register(UserRegisterDto user) {
        String email = user.getEmail();
        Optional<User> userModel = userRepo.findByEmail(email);
        if(userModel.isPresent()){
            throw new UserAlreadyExistsException("Email Already Exists");
        }
        User userEntity = modelMapper.map(user,User.class);
        userEntity.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userEntity.setVerified(true);
        User savedUser = userRepo.save(userEntity);
        return modelMapper.map(savedUser,UserDto.class);
    }

    @Override
    public UserDto getUser(UUID id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public UserDto updateUser() {
        return null;
    }

    @Override
    public String deleteUser() {
        return "";
    }

    @Override
    public TokenResponse refreshToken(RefreshTokenRequest body, HttpServletResponse response, HttpServletRequest request) throws InterruptedException {
        String refreshToken = readRefreshTokenFromRequest(body, request)
                .orElseThrow(() -> new BadCredentialsException("Refresh token is missing"));

        if(!jwtService.isRefreshToken(refreshToken)){
            throw new BadCredentialsException("Invalid Refresh Token Type");
        }

        String jti = jwtService.getJti(refreshToken);
        String userId = jwtService.extractUserName(refreshToken);
        RefreshToken storedRefreshToken = refreshTokenRepository
                .findByJti(jti).orElseThrow(() -> new BadCredentialsException("Refresh token not recognized"));

        if(storedRefreshToken.isRevoked()){
            throw new BadCredentialsException("Refresh token expired or revoked");
        }

        if(storedRefreshToken.getExpiresAt().isBefore(Instant.now())){
            throw new BadCredentialsException("Refresh token expired");
        }

        if(!storedRefreshToken.getUser().getEmail().equals(userId)){
            throw new BadCredentialsException("Refresh token does not belong to this user");
        }

        //refresh token ko rotate:
        storedRefreshToken.setRevoked(true);
        String newJti= UUID.randomUUID().toString();
        storedRefreshToken.setReplacedByToken(newJti);
        refreshTokenRepository.save(storedRefreshToken);

        User user = storedRefreshToken.getUser();

        var newRefreshTokenOb = RefreshToken.builder()
                .jti(newJti)
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .revoked(false)
                .build();

        refreshTokenRepository.save(newRefreshTokenOb);
        String newAccessToken= jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user, newRefreshTokenOb.getJti());

        cookieService.attachRefreshCookie(response, newRefreshToken, (int) jwtService.getRefreshTtlSeconds());
        cookieService.addNoStoreHeaders(response);
        UserDto userDto = modelMapper.map(user, UserDto.class);
        userDto.setPassword(null);
        return TokenResponse.of(newAccessToken, newRefreshToken, jwtService.getAccessTtlSeconds(), userDto);
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        readRefreshTokenFromRequest(null, request).ifPresent(token -> {
            try {
                if (jwtService.isRefreshToken(token)) {
                    String jti = jwtService.getJti(token);
                    refreshTokenRepository.findByJti(jti).ifPresent(rt -> {
                        rt.setRevoked(true);
                        refreshTokenRepository.save(rt);
                    });
                }
            } catch (JwtException ignored) {
            }
        });

        // Use CookieUtil (same behavior)
        cookieService.clearRefreshCookie(response);
        cookieService.addNoStoreHeaders(response);
        SecurityContextHolder.clearContext();
    }

    @Override
    public UserDto getCurrentUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return modelMapper.map(user, UserDto.class);
    }

    private Optional<String> readRefreshTokenFromRequest(RefreshTokenRequest body, HttpServletRequest request) {
//            1. prefer reading refresh token from cookie
        if (request.getCookies() != null) {
            Optional<String> fromCookie = Arrays.stream(request.getCookies())
                    .filter(c -> cookieService.getRefreshTokenCookieName().equals(c.getName()))
                    .map(Cookie::getValue)
                    .filter(v -> !v.isBlank())
                    .findFirst();
            if (fromCookie.isPresent()) {
                return fromCookie;
            }
        }

        // 2 body:
        if (body != null && body.refreshToken() != null && !body.refreshToken().isBlank()) {
            return Optional.of(body.refreshToken());
        }

        //3. custom header
        String refreshHeader = request.getHeader("X-Refresh-Token");
        if (refreshHeader != null && !refreshHeader.isBlank()) {
            return Optional.of(refreshHeader.trim());
        }

        //Authorization = Bearer <token>
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.regionMatches(true, 0, "Bearer ", 0, 7)) {
            String candidate = authHeader.substring(7).trim();
            if (!candidate.isEmpty()) {
                try {
                    if (jwtService.isRefreshToken(candidate)) {
                        return Optional.of(candidate);
                    }
                } catch (Exception ignored) {
                }
            }
        }

        return Optional.empty();
    }

}
