package com.urbanfix.controller;

import com.urbanfix.dto.DashboardStatsResponseDTO;
import com.urbanfix.dto.UserProfileResponseDTO;
import com.urbanfix.service.InterFaces.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    // Returns the profile belonging to the authenticated JWT subject.
    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<UserProfileResponseDTO> getCurrentUserProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    // Returns dashboard counts only for the authenticated user.
    @GetMapping("/me/dashboard")
    @Operation(summary = "Get current user dashboard statistics")
    public ResponseEntity<DashboardStatsResponseDTO> getCurrentUserDashboardStatistics() {
        return ResponseEntity.ok(userService.getCurrentUserDashboardStatistics());
    }
}
