package com.urlshortner.shortly.Analytics.controller;

import com.urlshortner.shortly.Analytics.dtos.DashboardResponse;
import com.urlshortner.shortly.Analytics.service.AppAnalyticsService;
import com.urlshortner.shortly.Auth.entities.User;
import com.urlshortner.shortly.Auth.exception.custom.InvalidCredentialsException;
import com.urlshortner.shortly.common.response.ApiResponseModel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AppAnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponseModel<DashboardResponse>> getAnalyticsDashboard(Authentication principal) {
        User user = (User)principal.getPrincipal();
        if((user!=null) && (user.getId()!=null)){
            DashboardResponse dashboardResponse = analyticsService.getAnalyticsDashboard(user.getId());
            ApiResponseModel<DashboardResponse> response = ApiResponseModel.<DashboardResponse>builder()
                    .data(dashboardResponse)
                    .success(true)
                    .message("Analytics Dashboard Fetched Successfully")
                    .timestamp(LocalDateTime.now())
                    .build();
            return ResponseEntity.ok(response);
        }
        throw new InvalidCredentialsException("User is not Authenticated");
    }

    @GetMapping("/clicks")
    public String getClicksAnalytics() {
        return analyticsService.getClickAnalytics();
    }
}
