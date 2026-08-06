package com.urbanfix.service.Implementation;

import com.urbanfix.dto.LoginRequestDTO;
import com.urbanfix.dto.LoginResponseDTO;
import com.urbanfix.dto.RegisterRequestDTO;
import com.urbanfix.entity.User;
import com.urbanfix.enums.Role;
import com.urbanfix.exception.ResourceAlreadyExistsException;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.security.CustomUserDetailsService;
import com.urbanfix.security.JwtService;
import com.urbanfix.service.InterFaces.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor //enables insitailzation of final viriavbles 
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    @Override
    public String register(RegisterRequestDTO request) {

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
        public LoginResponseDTO login(LoginRequestDTO request) 
        {
            // 1. Fetch user from database by email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));

            // 2. Verify entered raw password against hashed password in database
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            // 3. Convert 'user' to Spring's UserDetails directly (No 2nd database query!)
            UserDetails userDetails = org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .roles(user.getRole().name())
                    .build();

            // 4.spring-security requiress userDetails format for JWT generation
            String jwt = jwtService.generateToken(userDetails);

            // 5. Return JWT response to client
            return new LoginResponseDTO(jwt);
    }

}

