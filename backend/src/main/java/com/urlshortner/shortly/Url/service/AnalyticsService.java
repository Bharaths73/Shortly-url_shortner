package com.urlshortner.shortly.Url.service;

import com.urlshortner.shortly.Url.entities.ShortUrl;
import com.urlshortner.shortly.Url.events.ClickCaptureEvent;
import com.urlshortner.shortly.Url.producer.ClickEventProducer;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.URL;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpRequest;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {
    private final ClickEventProducer clickEventProducer;

    public void sendClickEvent(ShortUrl url, HttpServletRequest request) {
        try {

            String userAgent = request.getHeader("User-Agent");
            String referrer = extractReferrer(request.getHeader("Referer"));
            String clientIp = request.getRemoteAddr();
//            String visitorId = visitorIdentifierService.generateVisitorId(clientIp, userAgent);
            ClickCaptureEvent event = ClickCaptureEvent
                    .builder()
                    .eventId(UUID.randomUUID())
                    .shortUrlId(url.getId())
//                    .userId(url.getUser() != null ? url.getUser().getId() : null)
                    .shortCode(url.getShortCode())
                    .clickedAt(Instant.now())
                    .userAgent(userAgent)
                    .referrer(referrer)
                    .ipAddress(clientIp)
                    .build();
            clickEventProducer.sendClickEvent(event);
        } catch (Exception exception) {
            log.error(
                    "Unable to track click for shortcode: {}",
                    url.getShortCode(),
                    exception
            );
        }
    }

    private String extractReferrer(String referrer) {
        if (referrer == null || referrer.isBlank()) {
            return "DIRECT";
        }
        try {
            URI uri = URI.create(referrer);
            return uri.getHost() != null ? uri.getHost() : "UNKNOWN";
        } catch (IllegalArgumentException exception) {
            return "UNKNOWN";
        }
    }
}
