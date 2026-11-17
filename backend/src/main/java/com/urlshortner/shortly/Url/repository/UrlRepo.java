package com.urlshortner.shortly.Url.repository;

import com.urlshortner.shortly.Analytics.dtos.DashboardStats;
import com.urlshortner.shortly.Url.entities.ShortUrl;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UrlRepo extends JpaRepository<ShortUrl, UUID> {
    Optional<ShortUrl> findByOriginalUrl(String originalUrl);

    Optional<ShortUrl> findByShortCode(String shortCode);

    @Query("select s from ShortUrl s where s.user.id=:id")
    Page<ShortUrl> findByUserId(@Param(value = "id") UUID id, Pageable pageable);

    @Modifying
    @Query("""
        UPDATE ShortUrl c SET c.totalClicks = c.totalClicks + 1 WHERE c.id = :shortUrlId""")
    int incrementClickCount(@Param(value = "shortUrlId") UUID shortUrlId);

    @Query("""
SELECT
        COUNT(s) AS total,
        COALESCE(SUM(CASE
            WHEN s.createdAt >= :todayStart
            AND s.createdAt < :tomorrowStart
            THEN 1 ELSE 0
        END), 0) AS today,
        COALESCE(SUM(CASE
            WHEN s.createdAt >= :monthStart
            AND s.createdAt < :nextMonthStart
            THEN 1 ELSE 0
        END), 0) AS thisMonth
    FROM ShortUrl s
    WHERE s.user.id = :userId
""")
    DashboardStats getUrlStats(UUID userId, LocalDateTime todayStart, LocalDateTime tomorrowStart, LocalDateTime monthStart, LocalDateTime nextMonthStart);
}
