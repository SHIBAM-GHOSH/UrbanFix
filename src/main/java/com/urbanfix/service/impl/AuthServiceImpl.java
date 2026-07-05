package com.urbanfix.service.impl;

import com.urbanfix.dto.LoginRequest;
import com.urbanfix.dto.RegisterRequest;
import com.urbanfix.entity.User;
import com.urbanfix.enums.Role;
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

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        // Create a new User entity
        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // Password will be encrypted later using BCrypt
        user.setPassword(request.getPassword());

        // Every new user is a normal USER
        user.setRole(Role.USER);

        // Save user to database
        userRepository.save(user);

        return "User Registered Successfully";
    }

    @Override
    public String login(LoginRequest request) {

        // JWT logic will come later
        return "Login API Working";
    }
}