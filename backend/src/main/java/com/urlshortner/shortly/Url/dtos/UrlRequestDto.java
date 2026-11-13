package com.urlshortner.shortly.Url.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class UrlRequestDto {
    @NotBlank(message = "Please provide original url")
    private String originalUrl;
}
