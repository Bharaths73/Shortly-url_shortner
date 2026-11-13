package com.urlshortner.shortly.Auth.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLoginDto {
    private String email;
    private String password;
}
