package com.urlshortner.shortly.Url.events;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClickCaptureEvent {
    UUID eventId;
    UUID shortUrlId;
    String shortCode;
    Instant clickedAt;
    String userAgent;
    String referrer;
    String ipAddress;
}
