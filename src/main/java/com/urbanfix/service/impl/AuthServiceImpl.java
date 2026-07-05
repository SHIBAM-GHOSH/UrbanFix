package com.urbanfix.service.impl;

import com.urbanfix.dto.LoginRequest;
import com.urbanfix.dto.RegisterRequest;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.service.AuthService;
import org.springframework.stereotype.Service;

@Service // Marks this class as a Spring Service Bean
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    // Constructor Injection (Recommended by Spring)
    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public String register(RegisterRequest request) {

        // Business logic will be added in the next step
        return "Register API Working";
    }

    @Override
    public String login(LoginRequest request) {

        // JWT logic will come later
        return "Login API Working";
    }
}