package com.urlshortner.shortly.Auth.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserRegisterDto {
    private String firstName;

    private String lastName;

    private String email;

    private String password;
}
