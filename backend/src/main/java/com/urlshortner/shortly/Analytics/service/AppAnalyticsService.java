package com.urlshortner.shortly.Analytics.service;

import com.urlshortner.shortly.Analytics.dtos.DashboardResponse;
import com.urlshortner.shortly.Analytics.dtos.DashboardStats;
import com.urlshortner.shortly.Analytics.repository.ClickEventRepository;
import com.urlshortner.shortly.Url.repository.UrlRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppAnalyticsService {
    private final UrlRepo urlRepo;
    private final ClickEventRepository clickEventRepository;

    public DashboardResponse getAnalyticsDashboard(UUID userId) {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        LocalDate firstDayOfMonth = today.withDayOfMonth(1);
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime tomorrowStart = today.plusDays(1).atStartOfDay();
        LocalDateTime monthStart = firstDayOfMonth.atStartOfDay();
        LocalDateTime nextMonthStart = firstDayOfMonth.plusMonths(1).atStartOfDay();
        DashboardStats urlStats = urlRepo.getUrlStats(
                userId,
                todayStart,
                tomorrowStart,
                monthStart,
                nextMonthStart
        );
        DashboardStats clickStats = clickEventRepository.getClickStats(
                userId,
                todayStart,
                tomorrowStart,
                monthStart,
                nextMonthStart
        );

        return new DashboardResponse(
                urlStats.getTotal(),
                urlStats.getToday(),
                urlStats.getThisMonth(),
                clickStats.getTotal(),
                clickStats.getToday(),
                clickStats.getThisMonth()
        );
    }

    public String getClickAnalytics() {
        return "";
    }
}
