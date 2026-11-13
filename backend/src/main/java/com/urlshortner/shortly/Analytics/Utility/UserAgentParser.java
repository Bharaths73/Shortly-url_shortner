package com.urlshortner.shortly.Analytics.Utility;

import com.urlshortner.shortly.Analytics.dtos.UserAgentDetails;
import lombok.RequiredArgsConstructor;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserAgentParser {

    private static final String UNKNOWN = "Unknown";
    private static final int MAX_USER_AGENT_LENGTH = 2048;

    private final UserAgentAnalyzer userAgentAnalyzer;

    public UserAgentDetails parse(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) {
            return new UserAgentDetails(UNKNOWN, UNKNOWN, UNKNOWN);
        }
        String normalizedUserAgent = userAgent.length() > MAX_USER_AGENT_LENGTH
                ? userAgent.substring(0, MAX_USER_AGENT_LENGTH)
                : userAgent;
        try {
            UserAgent agent = userAgentAnalyzer.parse(normalizedUserAgent);
            return new UserAgentDetails(
                    getValue(agent, "AgentName"),
                    getValue(agent, "OperatingSystemName"),
                    getValue(agent, "DeviceClass")
            );

        } catch (Exception exception) {
            return new UserAgentDetails(UNKNOWN, UNKNOWN, UNKNOWN);
        }
    }

    private String getValue(UserAgent agent, String field) {
        String value = agent.getValue(field);
        return value == null || value.isBlank() ? UNKNOWN : value;
    }
}
