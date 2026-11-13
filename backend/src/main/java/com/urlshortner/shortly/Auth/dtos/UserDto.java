package com.urlshortner.shortly.Auth.dtos;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserDto {
    private UUID id;

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String accessToken;

    private boolean isVerified;
}
