package com.urbanfix.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public String test() {
        return "UrbanFix Backend is running successfully!";
    }

    @GetMapping("/auth-info")
    public Map<String, Object> getAuthInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return Map.of("authenticated", false);
        }
        return Map.of(
            "name", auth.getName() != null ? auth.getName() : "null",
            "authorities", auth.getAuthorities() != null ? auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList() : "none"
        );
    }
}