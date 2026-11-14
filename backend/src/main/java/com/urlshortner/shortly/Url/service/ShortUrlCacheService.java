package com.urlshortner.shortly.Url.service;

import com.urlshortner.shortly.Url.dtos.ShortUrlCacheDto;
import com.urlshortner.shortly.Url.entities.ShortUrl;
import com.urlshortner.shortly.Url.exception.custom.ResourceNotFoundException;
import com.urlshortner.shortly.Url.repository.UrlRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShortUrlCacheService {

    private final UrlRepo repo;

    @Cacheable(cacheNames = "shortUrlCache", key = "#shortCode")
    public ShortUrlCacheDto getCachedShortUrl(String shortCode) {
        ShortUrl shortUrl = repo.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("Short code not found"));
        return new ShortUrlCacheDto(
                shortUrl.getId(),
                shortUrl.getUser().getId(),
                shortUrl.getShortCode(),
                shortUrl.getOriginalUrl()
        );
    }
}
