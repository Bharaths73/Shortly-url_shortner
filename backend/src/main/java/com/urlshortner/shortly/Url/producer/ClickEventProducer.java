package com.urlshortner.shortly.Url.producer;

import com.urlshortner.shortly.Url.events.ClickCaptureEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClickEventProducer {
    private final KafkaTemplate<String, ClickCaptureEvent> kafkaTemplate;

    @Value("${kafka.topic.short-url-clicked}")
    private String SHORT_URL_CLICKED_TOPIC;

    public void sendClickEvent(ClickCaptureEvent clickCaptureEvent) {
        kafkaTemplate.send(SHORT_URL_CLICKED_TOPIC, clickCaptureEvent.getShortUrlId().toString(), clickCaptureEvent)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send click event: {}", ex.getMessage());
                    } else {
                        log.debug(
                                "Click event published successfully. EventId={}, Partition={}, Offset={}",
                                clickCaptureEvent.getEventId(),
                                result.getRecordMetadata().partition(),
                                result.getRecordMetadata().offset()
                        );
                    }
                });
    }
}
