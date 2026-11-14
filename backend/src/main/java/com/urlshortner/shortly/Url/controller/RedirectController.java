package com.urlshortner.shortly.Url.controller;

import com.urlshortner.shortly.Url.exception.custom.InvalidShortCodeException;
import com.urlshortner.shortly.Url.service.UrlServiceInterfaces.ShortUrlService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class RedirectController {
    private final ShortUrlService service;

    @GetMapping("/{shortcode}")//for redirect
    public ResponseEntity<Void> redirectUrl(@PathVariable String shortcode, HttpServletRequest request){
        if (!shortcode.matches("[a-zA-Z0-9]{6}")) {
            throw new InvalidShortCodeException("Invalid short code");
        }
        String originalUrl = service.getOriginalUrl(shortcode, request);
        String normalizedUrl = originalUrl.replace("{", "%7B").replace("}", "%7D");
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(normalizedUrl));
        headers.setCacheControl(CacheControl.noStore());
        return ResponseEntity.status(HttpStatus.FOUND).headers(headers).build();
    }

}
