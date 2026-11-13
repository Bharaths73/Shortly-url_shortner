package com.urlshortner.shortly.Auth.exception.custom;

public class InvalidCredentialsException extends RuntimeException{
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
