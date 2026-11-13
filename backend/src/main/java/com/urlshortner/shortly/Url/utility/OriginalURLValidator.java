package com.urlshortner.shortly.Url.utility;

import com.urlshortner.shortly.Url.exception.custom.URLValidationException;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URISyntaxException;

@Component
public class OriginalURLValidator {
    public void validate(String value){
        try{
            String normalizedUrl = value.trim()
                    .replace("{", "%7B")
                    .replace("}", "%7D")
                    .replace(" ", "%20");

            URI uri = new URI(normalizedUrl);
           String scheme = uri.getScheme();
           if(scheme == null || !(scheme.equalsIgnoreCase("http")||scheme.equalsIgnoreCase("https"))){
               throw new URLValidationException("Only HTTP and HTTPS URLs are supported");
           }
           if(uri.getHost() == null || uri.getHost().isBlank()){
               throw new URLValidationException("Invalid URL host");
           }
        } catch (URISyntaxException e){
            throw new URLValidationException("Invalid original URL: "+e.getMessage());
        }
    }
}
