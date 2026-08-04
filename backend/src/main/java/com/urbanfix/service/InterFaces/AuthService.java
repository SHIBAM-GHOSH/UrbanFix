package com.urbanfix.service.InterFaces;

import com.urbanfix.dto.LoginRequestDTO;
import com.urbanfix.dto.LoginResponseDTO;
import com.urbanfix.dto.RegisterRequestDTO;

public interface AuthService {

    // Register a new user
    String register(RegisterRequestDTO request);

    // Authenticate an existing user
    LoginResponseDTO login(LoginRequestDTO request);
}