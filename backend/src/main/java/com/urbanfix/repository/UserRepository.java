package com.urbanfix.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.urbanfix.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}