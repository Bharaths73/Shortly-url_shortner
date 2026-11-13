package com.urlshortner.shortly.Analytics.dtos;

public record UserAgentDetails(
        String browser,
        String operatingSystem,
        String deviceType
) {}
