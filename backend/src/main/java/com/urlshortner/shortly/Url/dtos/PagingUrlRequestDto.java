package com.urlshortner.shortly.Url.dtos;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PagingUrlRequestDto {
    private List<UrlResponseDto> urls;
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;
    private boolean isLastPage;
    private boolean isFirstPage;
}
