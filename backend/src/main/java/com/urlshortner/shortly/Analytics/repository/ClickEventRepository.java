package com.urlshortner.shortly.Analytics.repository;

import com.urlshortner.shortly.Analytics.dtos.DashboardStats;
import com.urlshortner.shortly.Analytics.entities.ClickEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface ClickEventRepository extends JpaRepository<ClickEventEntity, UUID> {

    boolean existsByEventId(UUID eventId);

    @Query(value = """
 SELECT
        COUNT(c.id) AS total,
        COALESCE(SUM(CASE
            WHEN c.clicked_at >= :todayStart
            AND c.clicked_at < :tomorrowStart
            THEN 1 ELSE 0
        END), 0) AS today,
        COALESCE(SUM(CASE
            WHEN c.clicked_at >= :monthStart
            AND c.clicked_at < :nextMonthStart
            THEN 1 ELSE 0
        END), 0) AS thisMonth
    FROM click_events c
    JOIN short_url s ON s.id = c.short_url_id
    WHERE s.user_id = :userId
 """, nativeQuery = true)
    DashboardStats getClickStats(UUID userId, LocalDateTime todayStart, LocalDateTime tomorrowStart, LocalDateTime monthStart, LocalDateTime nextMonthStart);
}
