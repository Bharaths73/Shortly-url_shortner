package com.urlshortner.shortly.Url.exception.custom;

public class URLValidationException extends RuntimeException{
    public URLValidationException(String message){
        super(message);
    }
}
