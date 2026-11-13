package com.urlshortner.shortly.Url.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.config.TopicConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaProducerConfig {

    @Value("${kafka.topic.short-url-clicked}")
    private String SHORT_URL_CLICKED_TOPIC;

    @Value("${kafka.topic.short-url-created}")
    private String SHORT_URL_CREATED_TOPIC;

    @Bean
    public NewTopic createTopicShortUrlClicked() {
        return TopicBuilder
                .name(SHORT_URL_CLICKED_TOPIC)
                .partitions(6)
                .replicas(3)
                .config(TopicConfig.RETENTION_MS_CONFIG,"604800000")
                .config(TopicConfig.CLEANUP_POLICY_CONFIG,"delete")
                .config(TopicConfig.MIN_IN_SYNC_REPLICAS_CONFIG,"2")
                .config(TopicConfig.SEGMENT_BYTES_CONFIG,"1073741824")
                .build();
    }

    @Bean
    public NewTopic createTopicShortUrlCreated() {
        return TopicBuilder
                .name(SHORT_URL_CREATED_TOPIC)
                .partitions(6)
                .replicas(3)
                .config(TopicConfig.RETENTION_MS_CONFIG,"604800000")//1week
                .config(TopicConfig.CLEANUP_POLICY_CONFIG,"delete")
                .config(TopicConfig.MIN_IN_SYNC_REPLICAS_CONFIG,"2")
                .config(TopicConfig.SEGMENT_BYTES_CONFIG,"1073741824")//1gb
                .build();
    }
}
