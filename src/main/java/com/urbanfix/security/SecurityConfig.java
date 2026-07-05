package com.urbanfix.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // Password Encoder Bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configure Spring Security
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http

            // Disable CSRF for REST APIs
            .csrf(csrf -> csrf.disable())

            // Authorization Rules
            .authorizeHttpRequests(auth -> auth

                    // Allow anyone to access authentication APIs
                    .requestMatchers("/api/auth/**").permitAll()

                    // Every other API requires authentication
                    .anyRequest().authenticated()
            )

            // Basic Authentication (temporary)
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

}