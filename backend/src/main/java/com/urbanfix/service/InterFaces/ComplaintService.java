package com.urbanfix.service.InterFaces;

import com.urbanfix.dto.CategoryAnalyticsResponseDTO;
import com.urbanfix.dto.ComplaintRequestDTO;
import com.urbanfix.dto.ComplaintResponseDTO;
import com.urbanfix.dto.DashboardStatsResponseDTO;
import com.urbanfix.dto.UpdateComplaintStatusRequestDTO;
import com.urbanfix.enums.ComplaintStatus;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ComplaintService {

    // Create a new civic complaint with optional image upload
    ComplaintResponseDTO createComplaint(ComplaintRequestDTO request, MultipartFile image);

    // Retrieve a single complaint by its unique ID
    ComplaintResponseDTO getComplaintById(Long complaintId);

    // Update details of an existing complaint (allowed only for the creator)
    ComplaintResponseDTO updateComplaint(Long complaintId, ComplaintRequestDTO request);

    // Delete a complaint by ID (allowed for creator or admin)
    void deleteComplaint(Long complaintId);

    // Retrieve all complaints created by the logged-in user with optional status and category filters
    List<ComplaintResponseDTO> getMyComplaints(ComplaintStatus status, String category);

    // Retrieve all complaints across the system with optional status and category filters
    List<ComplaintResponseDTO> getAllComplaints(ComplaintStatus status, String category);

    // Update complaint status (Pending, In Progress, Resolved, Rejected)
    ComplaintResponseDTO updateComplaintStatus(Long complaintId, UpdateComplaintStatusRequestDTO request);

    // Retrieve all complaints for admin dashboard with optional status and category filters
   // List<ComplaintResponseDTO> getAllComplaintsForAdmin(ComplaintStatus status, String category);

    // Retrieve high-level complaint statistics for dashboard counters
    DashboardStatsResponseDTO getDashboardStatistics();

    // Retrieve complaint count grouped by category for analytics
    List<CategoryAnalyticsResponseDTO> getCategoryAnalytics();
}
