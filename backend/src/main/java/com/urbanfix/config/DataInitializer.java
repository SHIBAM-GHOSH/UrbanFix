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
        // 1. Initialize or reset Admin Demo user
        userRepository.findByEmail("admin@urbanfix.com").map(user -> {
            user.setPassword(passwordEncoder.encode("admin123"));
            user.setRole(Role.ADMIN);
            return userRepository.save(user);
        }).orElseGet(() -> {
            User newAdmin = new User();
            newAdmin.setFullName("System Admin");
            newAdmin.setEmail("admin@urbanfix.com");
            newAdmin.setPassword(passwordEncoder.encode("admin123"));
            newAdmin.setRole(Role.ADMIN);
            return userRepository.save(newAdmin);
        });

        // 2. Initialize or reset Citizen Demo user (Ghosh)
        userRepository.findByEmail("armytech400@gmail.com").map(user -> {
            user.setFullName("Ghosh");
            user.setPassword(passwordEncoder.encode("4321"));
            user.setRole(Role.USER);
            return userRepository.save(user);
        }).orElseGet(() -> {
            User newCitizen = new User();
            newCitizen.setFullName("Ghosh");
            newCitizen.setEmail("armytech400@gmail.com");
            newCitizen.setPassword(passwordEncoder.encode("4321"));
            newCitizen.setRole(Role.USER);
            return userRepository.save(newCitizen);
        });
    }
}
