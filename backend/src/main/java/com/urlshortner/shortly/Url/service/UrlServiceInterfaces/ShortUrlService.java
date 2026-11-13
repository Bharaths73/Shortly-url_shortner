package com.urlshortner.shortly.Url.service.UrlServiceInterfaces;


import com.urlshortner.shortly.Auth.entities.User;
import com.urlshortner.shortly.Url.dtos.UrlRequestDto;
import com.urlshortner.shortly.Url.dtos.UrlResponseDto;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.UUID;

public interface ShortUrlService {
    UrlResponseDto createShortUrl(UrlRequestDto requestDto, User principal);

    String getOriginalUrl(String shortCode, HttpServletRequest request);

    UrlResponseDto getShortCodeDetails(String shortcode);

    List<UrlResponseDto> getUserShortUrls(UUID userId);
}
