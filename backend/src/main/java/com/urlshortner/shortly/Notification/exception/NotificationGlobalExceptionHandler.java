package com.urlshortner.shortly.Notification.exception;

import com.urlshortner.shortly.Notification.exception.custom.EmailSendingException;
import com.urlshortner.shortly.common.response.ApiErrorModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class NotificationGlobalExceptionHandler {
    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<?> emailSendingError(EmailSendingException e){
        ApiErrorModel errorModel = ApiErrorModel.builder().message(e.getMessage()).success(false).timestamp(LocalDateTime.now()).build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorModel);
    }
}
