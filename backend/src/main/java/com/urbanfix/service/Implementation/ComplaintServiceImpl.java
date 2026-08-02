package com.urbanfix.service.Implementation;

import com.urbanfix.Mapper.ComplaintMapper;
import com.urbanfix.dto.CategoryAnalyticsResponse;
import com.urbanfix.dto.ComplaintResponse;
import com.urbanfix.dto.CreateComplaintRequest;
import com.urbanfix.dto.DashboardStatsResponse;
import com.urbanfix.dto.MonthlyComplaintAnalyticsResponse;
import com.urbanfix.dto.UpdateComplaintRequest;
import com.urbanfix.dto.UpdateComplaintStatusRequest;
import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;
import com.urbanfix.enums.Role;
import com.urbanfix.repository.ComplaintRepository;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.service.InterFaces.ComplaintService;
import com.urbanfix.service.InterFaces.FileStorageService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.urbanfix.exception.InvalidOperationException;
import com.urbanfix.exception.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository1;
    private final UserRepository userRepository1;
    private final ComplaintMapper complaintMapper1;
    private final FileStorageService fileStorageService1;

    // Helper method: Fetches the currently authenticated User entity from DB using JWT SecurityContext
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository1.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // Create a new complaint entity, upload optional image, and associate with logged-in user
    @Override
    public ComplaintResponse createComplaint(CreateComplaintRequest request, MultipartFile image) {
        User currentUser = getCurrentUser();

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileStorageService1.uploadFile(image);
        }

        Complaint complaint = complaintMapper1.mapToEntity(request, currentUser);
        complaint.setImageUrl(imageUrl);
        Complaint savedComplaint = complaintRepository1.save(complaint);

        return complaintMapper1.mapToResponse(savedComplaint);
    }

    // Fetch all complaints system-wide with optional status/category filters (Returns simple List)
    @Override
    public List<ComplaintResponse> getAllComplaints(ComplaintStatus status, String category) {
        List<Complaint> complaints = complaintRepository1.findAllComplaintsFiltered(status, category);
        return complaints.stream().map(complaintMapper1::mapToResponse).toList();
    }

    // Fetch single complaint details by ID
    @Override
    public ComplaintResponse getComplaintById(Long complaintId) {
        Complaint complaint = complaintRepository1.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        return complaintMapper1.mapToResponse(complaint);
    }

    // Update title, description, category, or location of a complaint (Creator only)
    @Override
    public ComplaintResponse updateComplaint(Long complaintId, UpdateComplaintRequest request) {
        Complaint complaint = complaintRepository1.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        User currentUser = getCurrentUser();
        if (!complaint.getUser().getId().equals(currentUser.getId())) {
            throw new InvalidOperationException("You are not allowed to update this complaint.");
        }

        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setLocation(request.getLocation());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setImageUrl(request.getImageUrl());

        Complaint updatedComplaint = complaintRepository1.save(complaint);
        return complaintMapper1.mapToResponse(updatedComplaint);
    }

    // Delete a complaint by ID (Allowed for original creator or admin)
    @Override
    public void deleteComplaint(Long complaintId) {
        Complaint complaint = complaintRepository1.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        User currentUser = getCurrentUser();
        boolean isOwner = complaint.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new InvalidOperationException("You are not allowed to delete this complaint.");
        }

        complaintRepository1.delete(complaint);
    }

    // Fetch complaints created ONLY by the authenticated user with optional filters (Returns simple List)
    @Override
    public List<ComplaintResponse> getMyComplaints(ComplaintStatus status, String category) {
        User currentUser = getCurrentUser();
        List<Complaint> complaints = complaintRepository1.findMyComplaintsFiltered(currentUser, status, category);
        return complaints.stream().map(complaintMapper1::mapToResponse).toList();
    }

    // Update status of a complaint (Admin only endpoint)
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ComplaintResponse updateComplaintStatus(Long complaintId, UpdateComplaintStatusRequest request) {
        Complaint complaint = complaintRepository1.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        complaint.setStatus(request.getStatus());
        Complaint updatedComplaint = complaintRepository1.save(complaint);
        return complaintMapper1.mapToResponse(updatedComplaint);
    }

    // Fetch all complaints for Admin management view with optional filters (Returns simple List)
    @Override
    public List<ComplaintResponse> getAllComplaintsForAdmin(ComplaintStatus status, String category) {
        List<Complaint> complaints = complaintRepository1.findAllComplaintsFiltered(status, category);
        return complaints.stream().map(complaintMapper1::mapToResponse).toList();
    }

    // Compute high-level dashboard metrics (Total, Pending, In Progress, Resolved counts)
    @Override
    public DashboardStatsResponse getDashboardStatistics() {
        long totalComplaints = complaintRepository1.count();
        long pendingComplaints = complaintRepository1.countByStatus(ComplaintStatus.PENDING);
        long inProgressComplaints = complaintRepository1.countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolvedComplaints = complaintRepository1.countByStatus(ComplaintStatus.RESOLVED);

        return new DashboardStatsResponse(
                totalComplaints,
                pendingComplaints,
                inProgressComplaints,
                resolvedComplaints);
    }

    // Retrieve complaint counts grouped by category for analytics
    @Override
    public List<CategoryAnalyticsResponse> getCategoryAnalytics() {
        return complaintRepository1.getCategoryAnalytics();
    }

    // Retrieve monthly complaint counts for analytics charts
    @Override
    public List<MonthlyComplaintAnalyticsResponse> getMonthlyComplaintAnalytics() {
        return complaintRepository1.getMonthlyComplaintAnalytics();
    }
}
