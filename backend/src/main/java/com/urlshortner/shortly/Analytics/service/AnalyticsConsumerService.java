package com.urlshortner.shortly.Analytics.service;

import com.urlshortner.shortly.Analytics.Utility.UserAgentParser;
import com.urlshortner.shortly.Analytics.dtos.UserAgentDetails;
import com.urlshortner.shortly.Analytics.entities.ClickEventEntity;
import com.urlshortner.shortly.Analytics.repository.ClickEventRepository;
import com.urlshortner.shortly.Url.events.ClickCaptureEvent;
import com.urlshortner.shortly.Url.repository.UrlRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsConsumerService {

    private final ClickEventRepository clickEventRepository;
    private final UrlRepo urlRepo;
    private final UserAgentAnalyzer analyzer;
    private final UserAgentParser parser;
    private static final int MAX_USER_AGENT_LENGTH = 2048;

    @Transactional
    @CacheEvict(cacheNames = "analyticsDashboardCache", key = "#event.userId")
    public void processClickEvent(ClickCaptureEvent event) {
        if (clickEventRepository.existsByEventId(event.getEventId())) {
            log.info("Duplicate click event ignored: {}", event.getEventId());
            return;
        }
        ClickEventEntity entity = new ClickEventEntity();
        entity.setEventId(event.getEventId());
        entity.setShortUrlId(event.getShortUrlId());
        entity.setShortCode(event.getShortCode());
        entity.setClickedAt(event.getClickedAt());
        entity.setUserAgent(truncate(event.getUserAgent(), MAX_USER_AGENT_LENGTH));

        UserAgentDetails agentDetails = parser.parse(event.getUserAgent());

        entity.setIpAddress(event.getIpAddress());
        entity.setBrowser(agentDetails.browser());
        entity.setOperatingSystem(agentDetails.operatingSystem());
        entity.setDeviceType(agentDetails.deviceType());
        entity.setReferrer(event.getReferrer());
        urlRepo.incrementClickCount(event.getShortUrlId());
        clickEventRepository.save(entity);
        log.info("Click event persisted successfully: {}", event.getEventId());
    }

    private String truncate(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
    }
}
