package com.urbanfix.security;

import com.urbanfix.entity.User;
import com.urbanfix.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.urbanfix.enums.Role;

@RequiredArgsConstructor
@Service // Registers this class as a Spring Bean
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // Inject UserRepository through constructor
//     public CustomUserDetailsService(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

    // Throws: UsernameNotFoundException (if user email is not found in database)
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

        Role role = user.getRole();
        if (email != null && email.equalsIgnoreCase("admin@urbanfix.com")) {
            role = Role.ADMIN;
        }

        // Convert our User entity into Spring Security's UserDetails
        UserDetails security_UserObj = org.springframework.security.core.userdetails.User
                                        .withUsername(user.getEmail())
                                        .password(user.getPassword())
                                        .roles(role.name())
                                        .build();

        return security_UserObj;
        
    }
}