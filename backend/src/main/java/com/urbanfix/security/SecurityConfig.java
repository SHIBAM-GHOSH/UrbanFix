package com.urbanfix.security;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig 
{   
    private final JwtAuthenticationFilter jwtAuthenticationFilter1;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOrigins;

    // Password Encoder Bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS Configuration Bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Configure Spring Security filters blocks 
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception 
            {

                    http
                    // Enable CORS with our source configuration
                    .cors(cors -> cors.configurationSource(corsConfigurationSource()))
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
                                                                        "/api/test",
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
