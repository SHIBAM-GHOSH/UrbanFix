package com.urbanfix.service.impl;

import com.urbanfix.dto.LoginRequest;
import com.urbanfix.dto.LoginResponse;
import com.urbanfix.dto.RegisterRequest;
import com.urbanfix.entity.User;
import com.urbanfix.enums.Role;
import com.urbanfix.exception.ResourceAlreadyExistsException;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    //the below objects are automatically put into AuthService Object when its created
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // public AuthServiceImpl(UserRepository userRepository,PasswordEncoder passwordEncoder,
    //                         AuthenticationManager authenticationManager) 
    //     {

    //         this.userRepository = userRepository;
    //         this.passwordEncoder = passwordEncoder;
    //         this.authenticationManager = authenticationManager;
    //     }

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
    public LoginResponse login(LoginRequest request) {

        // Ask Spring Security to authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // JWT token will be added here tomorrow
        return new LoginResponse("Login Successful");
    }
}

