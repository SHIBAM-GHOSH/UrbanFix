package com.urbanfix.service.InterFaces;

import com.urbanfix.dto.CategoryAnalyticsResponse;
import com.urbanfix.dto.ComplaintResponse;
import com.urbanfix.dto.CreateComplaintRequest;
import com.urbanfix.dto.DashboardStatsResponse;
import com.urbanfix.dto.MonthlyComplaintAnalyticsResponse;
import com.urbanfix.dto.UpdateComplaintRequest;
import com.urbanfix.dto.UpdateComplaintStatusRequest;
import com.urbanfix.enums.ComplaintStatus;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ComplaintService {

    // Create a new civic complaint with optional image upload
    ComplaintResponse createComplaint(CreateComplaintRequest request, MultipartFile image);

    // Retrieve a single complaint by its unique ID
    ComplaintResponse getComplaintById(Long complaintId);

    // Update details of an existing complaint (allowed only for the creator)
    ComplaintResponse updateComplaint(Long complaintId, UpdateComplaintRequest request);

    // Delete a complaint by ID (allowed for creator or admin)
    void deleteComplaint(Long complaintId);

    // Retrieve all complaints created by the logged-in user with optional status and category filters
    List<ComplaintResponse> getMyComplaints(ComplaintStatus status, String category);

    // Retrieve all complaints across the system with optional status and category filters
    List<ComplaintResponse> getAllComplaints(ComplaintStatus status, String category);

    // Update complaint status (Pending, In Progress, Resolved, Rejected)
    ComplaintResponse updateComplaintStatus(Long complaintId, UpdateComplaintStatusRequest request);

    // Retrieve all complaints for admin dashboard with optional status and category filters
    List<ComplaintResponse> getAllComplaintsForAdmin(ComplaintStatus status, String category);

    // Retrieve high-level complaint statistics for dashboard counters
    DashboardStatsResponse getDashboardStatistics();

    // Retrieve complaint count grouped by category for analytics
    List<CategoryAnalyticsResponse> getCategoryAnalytics();

    // Retrieve monthly complaint counts for analytics charts
    List<MonthlyComplaintAnalyticsResponse> getMonthlyComplaintAnalytics();
}
