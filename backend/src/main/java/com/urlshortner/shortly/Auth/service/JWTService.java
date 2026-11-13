package com.urlshortner.shortly.Auth.service;

import com.urlshortner.shortly.Auth.entities.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Getter
public class JWTService {
    @Value("${security.jwt.secret}")
    private String SECRET;

    @Value("${security.jwt.access-ttl-seconds}")
    private long accessTtlSeconds;

    @Value("${security.jwt.refresh-ttl-seconds}")
    private long refreshTtlSeconds;

    @Value("${security.jwt.issuer}")
    private String issuer;

    public String generateAccessToken(User user){
        Map<String,Object> claims=new HashMap<>();
        claims.put("typ","access");
        return createToken(claims,user.getEmail());
    }

    private String createToken(Map<String, Object> claims, String identity) {
        Instant now = Instant.now();
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(identity)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(Date.from(now.plusSeconds(accessTtlSeconds)))
                .and()
                .signWith(getSignKey())
                .compact();
    }

    public String generateRefreshToken(User user, String jti) {
        Instant now = Instant.now();
        return Jwts.builder()
                .id(jti)
                .subject(user.getEmail())
                .issuer(issuer)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(refreshTtlSeconds)))
                .claim("typ", "refresh")
                .signWith(getSignKey())
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parser().verifyWith(getSignKey()).build().parseSignedClaims(token);
    }


    public boolean isAccessToken(String token) {
        Claims c = parse(token).getPayload();
        return "access".equals(c.get("typ"));
    }


    public boolean isRefreshToken(String token) {
        Claims c = parse(token).getPayload();
        return "refresh".equals(c.get("typ"));
    }

    public String getJti(String token) {
        return parse(token).getPayload().getId();
    }

    public String getEmail(String token) {
        Claims c = parse(token).getPayload();
        return (String) c.get("email");
    }

    private SecretKey getSignKey() {
        byte[] keyBytes= Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean validateToken(String token, UserDetails userdetails) {
        final String userName=extractUserName(token);
        return(userName.equals(userdetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims=extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

