package com.urlshortner.shortly.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ApiErrorModel {
    private boolean success;
    private String message;
    private LocalDateTime timestamp;
    private Map<String,String> errors;

    public ApiErrorModel() {
        this.timestamp = LocalDateTime.now();
    }
}
