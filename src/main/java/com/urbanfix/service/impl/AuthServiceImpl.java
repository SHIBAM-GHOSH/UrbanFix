package com.urbanfix.service.impl;

import com.urbanfix.dto.LoginRequest;
import com.urbanfix.dto.RegisterRequest;
import com.urbanfix.entity.User;
import com.urbanfix.enums.Role;
import com.urbanfix.exception.ResourceAlreadyExistsException;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.service.AuthService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already registered");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(Role.USER);

        userRepository.save(user);

        return "User Registered Successfully";
    }

    @Override
    public String login(LoginRequest request) {
        return "Login API Working";
    }
}