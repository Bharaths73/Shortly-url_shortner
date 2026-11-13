package com.urlshortner.shortly.Notification.consumer;

import com.urlshortner.shortly.Notification.service.NotificationService;
import com.urlshortner.shortly.Url.events.ShortCodeCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ShortCodeCreatedConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "${kafka.topic.short-url-created}",
            groupId = "url-notification-group"
    )
    public void consume(ShortCodeCreatedEvent event) {
        log.info("Received URL creation event: {}", event.getEventId());
        notificationService.sendUrlCreatedNotification(event);
        log.info("URL creation notification processed: {}", event.getEventId());
    }
}
