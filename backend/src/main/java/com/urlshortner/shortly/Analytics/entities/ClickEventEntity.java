package com.urlshortner.shortly.Analytics.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "click_events",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_click_event_id", columnNames = "event_id")
        },
indexes = {
@Index(
        name = "idx_click_url_clicked",
        columnList = "short_url_id, clicked_at"
),
@Index(
        name = "idx_click_clicked_at",
        columnList = "clicked_at"
)
    }
)
@Getter
@Setter
public class ClickEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    @Column(name = "short_url_id", nullable = false)
    private UUID shortUrlId;

    @Column(nullable = false, length = 6)
    private String shortCode;

    @Column(nullable = false)
    private Instant clickedAt;

    @Column(length = 2048)
    private String userAgent;

    private String browser;

    private String operatingSystem;

    private String deviceType;

    private String referrer;

    @Column(length = 45)
    private String ipAddress;
}