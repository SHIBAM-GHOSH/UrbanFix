package com.urbanfix.controller;

import com.urbanfix.dto.CategoryAnalyticsResponse;
import com.urbanfix.dto.ComplaintResponse;
import com.urbanfix.dto.DashboardStatsResponse;
import com.urbanfix.enums.ComplaintStatus;
import com.urbanfix.service.InterFaces.ComplaintService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ComplaintService complaintService1;

    // GET /api/admin/complaints : Retrieve all complaints for admin management view with optional filters
    @GetMapping("/complaints")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all complaints for Admin with optional filters")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) String category) {

        List<ComplaintResponse> response = complaintService1.getAllComplaintsForAdmin(status, category);
        return ResponseEntity.ok(response);
    }

    // GET /api/admin/dashboard : Retrieve high-level dashboard metrics (Total, Pending, In Progress, Resolved counts)
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard statistics")
    public ResponseEntity<DashboardStatsResponse> getDashboardStatistics() {
        DashboardStatsResponse response = complaintService1.getDashboardStatistics();
        return ResponseEntity.ok(response);
    }

    // GET /api/admin/dashboard/categories : Retrieve complaint count grouped by category for analytics
    @GetMapping("/dashboard/categories")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get category breakdown analytics")
    public ResponseEntity<List<CategoryAnalyticsResponse>> getCategoryAnalytics() {
        List<CategoryAnalyticsResponse> response = complaintService1.getCategoryAnalytics();
        return ResponseEntity.ok(response);
    }
}