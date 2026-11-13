package com.urlshortner.shortly.Url.producer;

import com.urlshortner.shortly.Url.events.ClickCaptureEvent;
import com.urlshortner.shortly.Url.events.ShortCodeCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CreatedEventProducer {
    private final KafkaTemplate<String, ShortCodeCreatedEvent> kafkaTemplate;

    @Value("${kafka.topic.short-url-created}")
    private String SHORT_URL_CREATED_TOPIC;

    public void sendClickEvent(ShortCodeCreatedEvent shortCodeCreatedEvent) {
        kafkaTemplate.send(SHORT_URL_CREATED_TOPIC, shortCodeCreatedEvent.getShortUrlId().toString(), shortCodeCreatedEvent)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send click event: {}", ex.getMessage());
                    } else {
                        log.debug(
                                "Create event published successfully. EventId={}, Partition={}, Offset={}",
                                shortCodeCreatedEvent.getEventId(),
                                result.getRecordMetadata().partition(),
                                result.getRecordMetadata().offset()
                        );
                    }
                });
    }
}
