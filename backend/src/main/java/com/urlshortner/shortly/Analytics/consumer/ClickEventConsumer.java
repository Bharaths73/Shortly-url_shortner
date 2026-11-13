package com.urlshortner.shortly.Analytics.consumer;

import com.urlshortner.shortly.Analytics.service.AnalyticsConsumerService;
import com.urlshortner.shortly.Url.events.ClickCaptureEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ClickEventConsumer {

    private final AnalyticsConsumerService analyticsConsumerService;

    @KafkaListener(
            topics = "${kafka.topic.short-url-clicked}",
            groupId = "analytics-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(ClickCaptureEvent event) {
        log.info("Received click event: {}", event.getEventId());
        analyticsConsumerService.processClickEvent(event);
    }
}
