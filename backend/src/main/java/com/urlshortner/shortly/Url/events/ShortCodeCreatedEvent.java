package com.urlshortner.shortly.Url.events;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShortCodeCreatedEvent {
    private UUID eventId;
    private String shortCode;
    private String originalUrl;
    private UUID shortUrlId;
    private String userName;
    private String email;
}
