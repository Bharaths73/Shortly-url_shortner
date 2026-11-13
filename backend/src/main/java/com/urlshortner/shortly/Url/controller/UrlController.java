package com.urlshortner.shortly.Url.controller;

import com.urlshortner.shortly.Auth.entities.User;
import com.urlshortner.shortly.Url.dtos.UrlRequestDto;
import com.urlshortner.shortly.Url.dtos.UrlResponseDto;
import com.urlshortner.shortly.Url.exception.custom.InvalidShortCodeException;
import com.urlshortner.shortly.common.response.ApiResponseModel;
import com.urlshortner.shortly.Url.service.AnalyticsService;
import com.urlshortner.shortly.Url.service.UrlServiceInterfaces.ShortUrlService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/urls")
@RequiredArgsConstructor
@Validated
public class UrlController {

    private final ShortUrlService service;
    private final AnalyticsService analyticsService;

    @PostMapping("/url")
    public ResponseEntity<ApiResponseModel<UrlResponseDto>> createShortUrl(@RequestBody UrlRequestDto requestDto, Authentication authentication){
         UrlResponseDto shortUrlResponse = service.createShortUrl(requestDto,(User) authentication.getPrincipal());
        ApiResponseModel<UrlResponseDto> response = ApiResponseModel.<UrlResponseDto>builder()
                .message("Successfully Created Short Url")
                .success(true)
                .data(shortUrlResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/url/{shortcode}")// to get details of shortcode
    public ResponseEntity<ApiResponseModel<UrlResponseDto>> getShortUrlDetails(@PathVariable String shortcode){
        if (!shortcode.matches("[a-zA-Z0-9]{6}")) {
            throw new InvalidShortCodeException("Invalid short code");
        }
        UrlResponseDto urlResponseDto = service.getShortCodeDetails(shortcode);
        ApiResponseModel<UrlResponseDto> response = ApiResponseModel.<UrlResponseDto>builder()
                .message("Successfully Fetched Information about Short Code")
                .success(true)
                .data(urlResponseDto)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{shortcode}")//for redirect
    public ResponseEntity<Void> redirectUrl(@PathVariable String shortcode, HttpServletRequest request){
        if (!shortcode.matches("[a-zA-Z0-9]{6}")) {
            throw new InvalidShortCodeException("Invalid short code");
        }
        String originalUrl = service.getOriginalUrl(shortcode, request);
        String normalizedUrl = originalUrl.replace("{", "%7B").replace("}", "%7D");
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(normalizedUrl));
        headers.setCacheControl(CacheControl.noStore());
        return ResponseEntity.status(HttpStatus.FOUND).headers(headers).build();
    }

    @GetMapping("/user/{userId}")//get all urls for specific user and add paging
    public ResponseEntity<ApiResponseModel<List<UrlResponseDto>>> getUserUrls(@PathVariable UUID userId){
        List<UrlResponseDto> urlResponseDtos = service.getUserShortUrls(userId);
        ApiResponseModel<List<UrlResponseDto>> response = ApiResponseModel.<List<UrlResponseDto>>builder()
                .message("Successfully Fetched Urls")
                .success(true)
                .data(urlResponseDtos)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/url/{shortcode}")
    public String deleteUrl(String body){
        return "";
    }
}
