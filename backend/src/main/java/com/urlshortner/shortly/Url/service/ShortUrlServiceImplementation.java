package com.urlshortner.shortly.Url.service;

import com.urlshortner.shortly.Auth.entities.User;
import com.urlshortner.shortly.Auth.repository.UserRepo;
import com.urlshortner.shortly.Url.dtos.UrlRequestDto;
import com.urlshortner.shortly.Url.dtos.UrlResponseDto;
import com.urlshortner.shortly.Url.entities.ShortUrl;
import com.urlshortner.shortly.Url.events.ShortCodeCreatedEvent;
import com.urlshortner.shortly.Url.exception.custom.ResourceAlreadyExistsException;
import com.urlshortner.shortly.Url.exception.custom.ResourceNotFoundException;
import com.urlshortner.shortly.Url.exception.custom.ShortCodGenerationException;
import com.urlshortner.shortly.Url.exception.custom.UserNotFoundException;
import com.urlshortner.shortly.Url.producer.CreatedEventProducer;
import com.urlshortner.shortly.Url.repository.UrlRepo;
import com.urlshortner.shortly.Url.service.UrlServiceInterfaces.ShortCodeGenerator;
import com.urlshortner.shortly.Url.service.UrlServiceInterfaces.ShortUrlService;
import com.urlshortner.shortly.Url.utility.ConstraintClassifier;
import com.urlshortner.shortly.Url.utility.OriginalURLValidator;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShortUrlServiceImplementation implements ShortUrlService {
    private final UrlRepo repo;
    private final OriginalURLValidator originalURLValidator;
    private final ShortCodeGenerator generator;
    private final UrlWriter writer;
    private final ConstraintClassifier classifier;
    private final AnalyticsService analyticsService;
    private final CreatedEventProducer CreatedEventProducer;
    private final UserRepo userRepo;

    @Value("${short-url.max-retries}")
    private Integer MAX_RETRIES;

    @Override
    public UrlResponseDto createShortUrl(UrlRequestDto requestDto, User principal) {
        String url = requestDto.getOriginalUrl().trim();
        Optional<ShortUrl> originalUrl = repo.findByOriginalUrl(url);
        if(originalUrl.isPresent()){
            throw new ResourceAlreadyExistsException("This Url already exists in the system");
        }
        originalURLValidator.validate(url);
        for(int attempt=0; attempt<MAX_RETRIES; attempt++){
           String code = generator.generate();
           try {
               ShortUrl shortUrl = writer.insert(url, code, principal);
               UrlResponseDto urlResponseDto = UrlResponseDto.builder()
                       .originalUrl(shortUrl.getOriginalUrl())
                       .shortCode(shortUrl.getShortCode())
                       .id(shortUrl.getId())
                       .createdAt(shortUrl.getCreatedAt())
                       .updatedAt(shortUrl.getUpdatedAt())
                       .build();
               //send kafka event for notification
               ShortCodeCreatedEvent event = ShortCodeCreatedEvent
                       .builder()
                       .eventId(UUID.randomUUID())
                       .originalUrl(shortUrl.getOriginalUrl())
                       .shortCode(shortUrl.getShortCode())
                       .shortUrlId(shortUrl.getId())
                       .email(principal.getEmail())
                       .userName(principal.getFirstName() + " " + principal.getLastName())
                       .build();
               CreatedEventProducer.sendClickEvent(event);
               return urlResponseDto;
           } catch (DataIntegrityViolationException e) {
               if(!classifier.isShortCodeConflict(e)){
                   log.error("Error while generating shortcode ",e);
                   throw new ShortCodGenerationException("Something went wrong");
//                   throw e;
               }
               log.warn("Short code collision. Retrying...");
           }
        }
        throw new ShortCodGenerationException("Failed to generate short url");
    }

    @Override
    public String getOriginalUrl(String shortCode, HttpServletRequest request) {
        Optional<ShortUrl> shortUrl = repo.findByShortCode(shortCode);
        if(shortUrl.isEmpty()){
            throw new ResourceNotFoundException("Short code not found");
        }
        analyticsService.sendClickEvent(shortUrl.get(), request);
        return shortUrl.get().getOriginalUrl();
    }

    @Override
    public UrlResponseDto getShortCodeDetails(String shortcode) {
        Optional<ShortUrl> shortUrl = repo.findByShortCode(shortcode);
        if(shortUrl.isEmpty()){
            throw new ResourceNotFoundException("Short code not found");
        }
        ShortUrl shortUrlDb = shortUrl.get();
        return UrlResponseDto
                .builder()
                .id(shortUrlDb.getId())
                .shortCode(shortUrlDb.getShortCode())
                .originalUrl(shortUrlDb.getOriginalUrl())
                .updatedAt(shortUrlDb.getUpdatedAt())
                .createdAt(shortUrlDb.getCreatedAt())
                .build();
    }

    @Override
    public List<UrlResponseDto> getUserShortUrls(UUID userId) {
        User user = userRepo.findById(userId).orElseThrow(()->new UserNotFoundException("User Not Found"));
        List<ShortUrl> userShortUrls = repo.findByUserId(user.getId());
        return userShortUrls.stream().map((url)->{
            return UrlResponseDto
                    .builder()
                    .id(url.getId())
                    .shortCode(url.getShortCode())
                    .originalUrl(url.getOriginalUrl())
                    .updatedAt(url.getUpdatedAt())
                    .createdAt(url.getCreatedAt())
                    .build();
        }).toList();
    }
}
