package com.urbanfix.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig 
{   
    private final JwtAuthenticationFilter jwtAuthenticationFilter1;


    // Password Encoder Bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Expose AuthenticationManager as a Spring Bean
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();
    }

    // Configure Spring Security
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception 
            {

                    http
                    // Disable CSRF because we are building a REST API
                    .csrf(csrf -> csrf.disable())
                    // Do not create HTTP sessions (JWT is stateless)
                    .sessionManagement(session ->
                            session.sessionCreationPolicy(
                                    SessionCreationPolicy.STATELESS
                            )
                    )
                    // Configure endpoint authorization
                   .authorizeHttpRequests(auth -> auth.requestMatchers(
                                                                        "/api/auth/**",
                                                                        "/uploads/**",
                                                                        "/v3/api-docs/**",
                                                                        "/swagger-ui/**",
                                                                        "/swagger-ui.html"
                                                                ).permitAll()

                                        .anyRequest().authenticated()
                                )

                    

                    // Execute our JWT filter before Spring's authentication filter
                    .addFilterBefore(
                            jwtAuthenticationFilter1,
                            UsernamePasswordAuthenticationFilter.class
                    );

                return http.build();
            }

}