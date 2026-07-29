package com.urbanfix.controller;

import com.urbanfix.dto.CategoryAnalyticsResponse;
import com.urbanfix.dto.ComplaintResponse;
import com.urbanfix.dto.DashboardStatsResponse;
import com.urbanfix.dto.MonthlyComplaintAnalyticsResponse;
import com.urbanfix.enums.ComplaintStatus;
import com.urbanfix.service.InterFaces.ComplaintService;

import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;

import java.util.List;

//import com.urbanfix.entity.ComplaintCategory;
//import com.urbanfix.entity.ComplaintStatus;


import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ComplaintService complaintService1;

    // Retrieve all complaints (Admin only)
    @GetMapping("/complaints")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ComplaintResponse>> getAllComplaints(


            @RequestParam(required = false)
            ComplaintStatus status,

            @RequestParam(required = false)
            String  category,

            @RequestParam(defaultValue = "0")
            @Min(0)
            int page,

            @RequestParam(defaultValue = "10")
            @Min(1)
            int size,

            @RequestParam(defaultValue = "createdAt")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String sortDirection) {

        Page<ComplaintResponse> response =
                complaintService1.getAllComplaintsForAdmin(
                        status, category,
                        page,
                        size,
                        sortBy,
                        sortDirection
                );

        return ResponseEntity.ok(response);
    }

        /**
     * Retrieves dashboard statistics.
     * Accessible only by administrators.
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsResponse> getDashboardStatistics() 
    {
            DashboardStatsResponse response =
                    complaintService1.getDashboardStatistics();
            return ResponseEntity.ok(response);
    }
        /**
     * Retrieves complaint count grouped by category.
     * Accessible only by administrators.
     */
    @GetMapping("/dashboard/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CategoryAnalyticsResponse>> getCategoryAnalytics() 
        {

            List<CategoryAnalyticsResponse> response =
                    complaintService1.getCategoryAnalytics();

            return ResponseEntity.ok(response);
        }

                /**
         * Retrieves complaint count grouped by year and month.
         * Accessible only by administrators.
         */
        @GetMapping("/dashboard/monthly")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<MonthlyComplaintAnalyticsResponse>> getMonthlyComplaintAnalytics() 
        {

                List<MonthlyComplaintAnalyticsResponse> response =complaintService1.getMonthlyComplaintAnalytics();
                return ResponseEntity.ok(response);
        }
}