package com.urbanfix.config;

import com.urbanfix.entity.User;
import com.urbanfix.enums.Role;
import com.urbanfix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize or reset Admin Demo user
        userRepository.findByEmail("admin@urbanfix.com").ifPresentOrElse(
            user -> {
                user.setPassword(passwordEncoder.encode("admin123"));
                user.setRole(Role.ADMIN);
                userRepository.save(user);
            },
            () -> {
                User admin = User.builder()
                        .fullName("System Admin")
                        .email("admin@urbanfix.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);
            }
        );

        // Initialize or reset Citizen Demo user
        userRepository.findByEmail("armytech400@gmail.com").ifPresentOrElse(
            user -> {
                user.setPassword(passwordEncoder.encode("4321"));
                user.setRole(Role.USER);
                userRepository.save(user);
            },
            () -> {
                User citizen = User.builder()
                        .fullName("Citizen Demo User")
                        .email("armytech400@gmail.com")
                        .password(passwordEncoder.encode("4321"))
                        .role(Role.USER)
                        .build();
                userRepository.save(citizen);
            }
        );
    }
}
