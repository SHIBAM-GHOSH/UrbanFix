package com.urbanfix.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.urbanfix.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);// optional is a class that is used to represent a value that may or may not be present.

    boolean existsByEmail(String email);
}