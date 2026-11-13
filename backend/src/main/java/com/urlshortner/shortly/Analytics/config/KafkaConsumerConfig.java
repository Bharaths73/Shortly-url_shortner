package com.urlshortner.shortly.Analytics.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConsumerConfig {

    @Value("${kafka.topic.short-url-clicked-dlt}")
    private String SHORT_CODE_CLICKED_DLT;

    @Value("${kafka.topic.short-url-created-dlt}")
    private String SHORT_CODE_CREATED_DLT;

    @Bean
    public NewTopic ShortCodeClickedDltTopic() {
        return TopicBuilder.name(SHORT_CODE_CLICKED_DLT)
                .partitions(3)
                .replicas(3)
                .build();
    }

    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<Object, Object> kafkaTemplate) {
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(kafkaTemplate, (record, exception) -> {
            return new org.apache.kafka.common.TopicPartition(record.topic()+"-dlt", record.partition());
        });
        FixedBackOff fixedBackOff = new FixedBackOff(1000L, 5);// Retry every 1 second, up to 5 times
        return new DefaultErrorHandler(recoverer, fixedBackOff);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<Object, Object> kafkaListenerContainerFactory(ConsumerFactory<Object, Object> consumerFactory, DefaultErrorHandler errorHandler) {
        ConcurrentKafkaListenerContainerFactory<Object, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConcurrency(3);
        factory.setCommonErrorHandler(errorHandler);
        factory.setConsumerFactory(consumerFactory);
        return factory;
    }
}
