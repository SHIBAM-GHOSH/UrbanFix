package com.urbanfix.dto;

import com.urbanfix.enums.Role;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authenticated user profile")
// Safe profile payload; the entity password is intentionally never exposed.
public class UserProfileResponse {

    private Long id;

    private String fullName;

    private String email;

    private Role role;
}
