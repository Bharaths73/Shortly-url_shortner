package com.urlshortner.shortly.Url.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class UrlResponseDto {
    private UUID id;
    private String originalUrl;
    private String shortCode;
    private long totalClicks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
