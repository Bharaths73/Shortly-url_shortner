package com.urlshortner.shortly.Url.service;

import com.urlshortner.shortly.Url.exception.custom.ShortCodGenerationException;
import com.urlshortner.shortly.Url.service.UrlServiceInterfaces.ShortCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class ShortCodeGeneratorImplementation implements ShortCodeGenerator {
    private static final char[] BASE62 = "01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".toCharArray();
    private static final int BASE_LENGTH = BASE62.length;
    private final SecureRandom random;

    @Value("${short-url.length}")
    private int length;

    @Override
    public String generate() {
        if(length<=0){
            throw new IllegalArgumentException("Code length must be between 6 and 8");
        }
        char[] code = new char[length];
        for(int i=0; i<length; i++){
            code[i]=BASE62[random.nextInt(BASE_LENGTH)];
        }
        return new String(code);
    }
}
