package com.urbanfix.service;

import com.urbanfix.dto.LoginRequest;
import com.urbanfix.dto.RegisterRequest;

public interface AuthService {

    // Register a new user
    String register(RegisterRequest request);

    // Authenticate an existing user
    String login(LoginRequest request);
}