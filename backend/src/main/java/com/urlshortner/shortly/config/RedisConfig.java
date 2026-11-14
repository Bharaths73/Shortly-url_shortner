package com.urlshortner.shortly.config;

import com.urlshortner.shortly.Analytics.dtos.DashboardResponse;
import com.urlshortner.shortly.Url.dtos.ShortUrlCacheDto;
import com.urlshortner.shortly.Url.dtos.UrlRequestDto;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.*;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        ObjectMapper objectMapper = JsonMapper.builder()
                .findAndAddModules()
                .build();

        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .disableCachingNullValues()
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())
                );

        RedisCacheConfiguration shortUrlConfig = defaultConfig.serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                        new JacksonJsonRedisSerializer<>(objectMapper, ShortUrlCacheDto.class)
                )
        );

        RedisCacheConfiguration shortUrlDetailConfig = defaultConfig
                .entryTtl(Duration.ofMinutes(15))
                .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                        new JacksonJsonRedisSerializer<>(objectMapper, UrlRequestDto.class)
                )
        );

        RedisCacheConfiguration analyticsConfig = defaultConfig
                .entryTtl(Duration.ofMinutes(2))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                new JacksonJsonRedisSerializer<>(objectMapper, DashboardResponse.class)
                        )
                );
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withCacheConfiguration("shortUrlCache", shortUrlConfig)
                .withCacheConfiguration("shortUrlDetailsCache", shortUrlDetailConfig)
                .withCacheConfiguration("analyticsDashboardCache", analyticsConfig)
                .build();
    }
}
