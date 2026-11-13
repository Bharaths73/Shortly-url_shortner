package com.urlshortner.shortly.Auth.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String otp;

    private boolean isVerified=false;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
       return List.of();
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    public boolean isEnabled() {
        return this.isVerified;
    }
}

