package com.urlshortner.shortly.Auth.filters;

import com.urlshortner.shortly.Auth.service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class JwtFilter extends OncePerRequestFilter{

    private JWTService jwtService;

    private UserDetailsService userDetailsService;

    public JwtFilter(JWTService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService=userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authToken=request.getHeader("Authorization");
        String token=null;
        String username=null;

        if(authToken!=null && authToken.startsWith("Bearer")){
            token=authToken.substring(7);
            try {
                username = jwtService.extractUserName(token);
            } catch (Exception e) {
                throw new RuntimeException("Token is invalid");
            }
        }


        if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null){
            UserDetails userdetails;
            userdetails=userDetailsService.loadUserByUsername(username);

            if(jwtService.validateToken(token,userdetails)){
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken=new UsernamePasswordAuthenticationToken(userdetails, null,userdetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }

        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().startsWith("/api/v1/users/login");
    }

}
