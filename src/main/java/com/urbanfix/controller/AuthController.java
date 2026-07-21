package com.urbanfix.controller;

import com.urbanfix.dto.LoginRequest;
import com.urbanfix.dto.LoginResponse;
import com.urbanfix.dto.RegisterRequest;
import com.urbanfix.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // Marks this class as a REST Controller
@RequestMapping("/api/auth") // Base URL
public class AuthController {

    private final AuthService authService;

    // Constructor Injection
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public String test() {
        return "Auth API Working";
    }

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {

        String response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    
    // User Login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) 
        {

            LoginResponse response = authService.login(request);

            return ResponseEntity.ok(response);
        }

}