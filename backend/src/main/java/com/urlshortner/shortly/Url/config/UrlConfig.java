package com.urlshortner.shortly.Url.config;

import com.urlshortner.shortly.Url.utility.OriginalURLValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

import java.security.SecureRandom;

@Configuration
public class UrlConfig {
    @Bean
    public SecureRandom secureRandom(){
        return new SecureRandom();
    }

    @Bean
    public OriginalURLValidator originalURLValidator(){
        return new OriginalURLValidator();
    }
}
