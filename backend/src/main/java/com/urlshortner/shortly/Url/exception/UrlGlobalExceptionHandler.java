package com.urlshortner.shortly.Url.exception;

import com.urlshortner.shortly.Url.exception.custom.*;
import com.urlshortner.shortly.common.response.ApiErrorModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class UrlGlobalExceptionHandler {

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<?> resourceAlreadyExists(ResourceAlreadyExistsException e){
        ApiErrorModel errorModel = ApiErrorModel.builder().message(e.getMessage()).success(false).timestamp(LocalDateTime.now()).build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorModel);
    }

    @ExceptionHandler(URLValidationException.class)
    public ResponseEntity<?> urlValidationError(URLValidationException e){
        ApiErrorModel errorModel = ApiErrorModel.builder().message(e.getMessage()).success(false).timestamp(LocalDateTime.now()).build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorModel);
    }

    @ExceptionHandler(ShortCodGenerationException.class)
    public ResponseEntity<?> failedToGenerateShortUrl(ShortCodGenerationException e){
        ApiErrorModel errorModel = ApiErrorModel.builder().message(e.getMessage()).success(false).timestamp(LocalDateTime.now()).build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorModel);
    }

    @ExceptionHandler(InvalidShortCodeException.class)
    public ResponseEntity<?> shortCodeInvalid(InvalidShortCodeException e){
        ApiErrorModel errorModel = ApiErrorModel.builder().message(e.getMessage()).success(false).timestamp(LocalDateTime.now()).build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorModel);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> userNotExistsError(UserNotFoundException e){
        ApiErrorModel errorModel = ApiErrorModel.builder().message(e.getMessage()).success(false).timestamp(LocalDateTime.now()).build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorModel);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> resourceNotFoundError(ResourceNotFoundException e){
        ApiErrorModel errorModel = ApiErrorModel.builder().message(e.getMessage()).success(false).timestamp(LocalDateTime.now()).build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorModel);
    }
}
