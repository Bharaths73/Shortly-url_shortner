package com.urlshortner.shortly.common.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    protected UUID id;

    @Column(name = "created_at",nullable = false,updatable = false)
    // @Temporal(TemporalType.TIMESTAMP)//tells format
    @CreatedDate//tells to set the date when the entity is created
    protected LocalDateTime createdAt;

    @Column(name = "updated_at",nullable = false)
    // @Temporal(TemporalType.TIMESTAMP)
    @LastModifiedDate//tells to set the date when the entity is updated
    protected LocalDateTime updatedAt;

    // @Version
    // protected Long version;
}
