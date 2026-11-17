package com.urlshortner.shortly.Analytics.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class UserCreatedEvent {
    private UUID eventId;
    private String email;
    private String token;
}
