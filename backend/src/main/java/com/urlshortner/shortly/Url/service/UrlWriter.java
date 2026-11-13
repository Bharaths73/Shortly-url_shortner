package com.urlshortner.shortly.Url.service;

import com.urlshortner.shortly.Auth.entities.User;
import com.urlshortner.shortly.Url.entities.ShortUrl;
import com.urlshortner.shortly.Url.repository.UrlRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UrlWriter {
    private final UrlRepo repo;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ShortUrl insert(String originalUrl, String shortUrl, User user){
        ShortUrl url = new ShortUrl();
        url.setOriginalUrl(originalUrl);
        url.setShortCode(shortUrl);
        url.setUser(user);
        return repo.saveAndFlush(url);
    }
}
