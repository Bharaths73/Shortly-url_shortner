package com.urlshortner.shortly.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ApiResponseModel<T>{
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public ApiResponseModel() {
        this.timestamp = LocalDateTime.now();
    }

}
