package com.urlshortner.shortly.Url.entities;

import com.urlshortner.shortly.Auth.entities.User;
import com.urlshortner.shortly.common.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity()
@Table(name = "short_url",
        indexes = {
                @Index(
                        name = "idx_url_user_created",
                        columnList = "user_id, created_at"
                )
       },
        uniqueConstraints = {
        @UniqueConstraint(
             name = "uk_url_short_code",
             columnNames = "short_code"
        )}
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShortUrl extends BaseEntity {

    @Column(name = "original_url", nullable = false, length = 2048)
    private String originalUrl;

    @Column(name = "short_code",nullable = false,length = 16)
    private String shortCode;

    @Column(nullable = false)
    private Long totalClicks=0L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
