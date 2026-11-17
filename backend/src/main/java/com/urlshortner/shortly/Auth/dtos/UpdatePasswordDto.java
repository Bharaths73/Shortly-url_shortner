package com.urlshortner.shortly.Auth.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePasswordDto {
    @NotBlank(message = "Current Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String currentPassword;

    @NotBlank(message = "New Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String newPassword;
}
