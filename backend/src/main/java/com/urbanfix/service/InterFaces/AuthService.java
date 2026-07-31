package com.urbanfix.service.InterFaces;

import com.urbanfix.dto.LoginRequest;
import com.urbanfix.dto.LoginResponse;
import com.urbanfix.dto.RegisterRequest;

public interface AuthService {

    // Register a new user
    String register(RegisterRequest request);

    // Authenticate an existing user
    LoginResponse login(LoginRequest request);
}