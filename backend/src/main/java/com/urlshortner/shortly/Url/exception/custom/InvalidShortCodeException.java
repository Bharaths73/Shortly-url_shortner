package com.urlshortner.shortly.Url.exception.custom;

public class InvalidShortCodeException extends RuntimeException{
    public InvalidShortCodeException(String message){
        super(message);
    }

}
