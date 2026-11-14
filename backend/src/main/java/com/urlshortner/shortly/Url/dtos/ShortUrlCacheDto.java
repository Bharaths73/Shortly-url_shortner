package com.urlshortner.shortly.Url.dtos;

import java.util.UUID;

public record ShortUrlCacheDto(
        UUID id,
        UUID userId,
        String shortCode,
        String originalUrl
) {}
