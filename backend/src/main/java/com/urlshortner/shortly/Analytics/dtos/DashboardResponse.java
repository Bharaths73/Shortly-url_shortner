package com.urlshortner.shortly.Analytics.dtos;

public record DashboardResponse(
        Long totalUrls,
        Long urlsToday,
        Long urlsThisMonth,
        Long totalClicks,
        Long clicksToday,
        Long clicksThisMonth
) {}
