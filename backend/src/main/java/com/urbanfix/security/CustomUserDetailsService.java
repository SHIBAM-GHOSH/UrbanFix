package com.urbanfix.security;

import com.urbanfix.entity.User;
import com.urbanfix.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service // Registers this class as a Spring Bean
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // Inject UserRepository through constructor
//     public CustomUserDetailsService(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Find the user in MySQL using email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: " + email
                        )
                );
        System.out.println("Role from DB: " + user.getRole());

        // Convert our User entity into Spring Security's UserDetails
        UserDetails security_UserObj = org.springframework.security.core.userdetails.User
                                        .withUsername(user.getEmail())
                                        .password(user.getPassword())
                                        .roles(user.getRole().name())
                                        .build();

        return security_UserObj;
        
    }
}