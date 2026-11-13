package com.urlshortner.shortly.Url.exception.custom;

public class UserNotFoundException extends RuntimeException{

    public UserNotFoundException(String message) {
        super(message);
    }
}
