package com.urbanfix.service.Implementation;

import com.urbanfix.Mapper.ComplaintMapper;
import com.urbanfix.dto.AiClassificationDTO;
import com.urbanfix.dto.CategoryAnalyticsResponseDTO;
import com.urbanfix.dto.ComplaintRequestDTO;
import com.urbanfix.dto.ComplaintResponseDTO;
import com.urbanfix.dto.DashboardStatsResponseDTO;
import com.urbanfix.dto.UpdateComplaintStatusRequestDTO;
import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;
import com.urbanfix.enums.Role;
import com.urbanfix.repository.ComplaintRepository;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.service.InterFaces.AiService;
import com.urbanfix.service.InterFaces.ComplaintService;
import com.urbanfix.service.InterFaces.FileStorageService;

import lombok.RequiredArgsConstructor;

import java.util.*;

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

    private final AiService aiService1;

    // Helper method: Fetches the currently authenticated User entity from DB using JWT SecurityContext
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository1.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // Create a new complaint entity, upload optional image, and associate with logged-in user
    @Override
    public ComplaintResponseDTO createComplaint(ComplaintRequestDTO request, MultipartFile image) 
        {
            User currentUser = getCurrentUser();
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = fileStorageService1.uploadFile(image);
            }
            //make a complaint object container
            Complaint complaint = complaintMapper1.mapToEntity(request, currentUser);
            complaint.setImageUrl(imageUrl);
//----------------------------------------------------
            // 2. Call Gemini AI to classify category, severity, and structure description
            AiClassificationDTO aiResult = aiService1.classifyComplaint(request.getTitle(), request.getDescription());

            if(aiResult != null)
            {
                // Auto-assign AI Category
                if (aiResult.getCategory() != null && !aiResult.getCategory().isEmpty()) {
                    complaint.setCategory(aiResult.getCategory());
                }

                // Auto-assign AI Severity (HIGH, MEDIUM, LOW)
                complaint.setSeverity(aiResult.getSeverity());

                // Auto-assign AI Structured Description
                if (aiResult.getStructuredDescription() != null && !aiResult.getStructuredDescription().isEmpty()) {
                    complaint.setDescription(aiResult.getStructuredDescription());
                }                
  
            }
//------------------------------------------------------------

            //store the complaint contanier to DB usgin repository
            Complaint savedComplaint = complaintRepository1.save(complaint);

            return complaintMapper1.mapToResponse(savedComplaint);
        }

    // Fetch all complaints system-wide with optional status/category filters (Returns simple List)
    //status is an enum and category is a string
    @Override
    public List<ComplaintResponseDTO> getAllComplaints(ComplaintStatus status, String category) 
        {
            List<Complaint> complaints = complaintRepository1.findComplaintsFiltered(null,status, category);
            List<ComplaintResponseDTO> responseList = new ArrayList<>();

            for (Complaint complaint : complaints) {
                ComplaintResponseDTO response = complaintMapper1.mapToResponse(complaint);
                responseList.add(response);
            }

            return responseList;

        }

    // Fetch single complaint details by ID
    @Override
    public ComplaintResponseDTO getComplaintById(Long complaintId) {
        Complaint complaint = complaintRepository1.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        return complaintMapper1.mapToResponse(complaint);
    }

    // Update title, description, category, or location of a complaint (Creator only)
    @Override
    public ComplaintResponseDTO updateComplaint(Long complaintId, ComplaintRequestDTO request) {
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
    public List<ComplaintResponseDTO> getMyComplaints(ComplaintStatus status, String category) 
        {
            User currentUser = getCurrentUser();
            List<Complaint> complaints = complaintRepository1.findComplaintsFiltered(currentUser, status, category);
            //return complaints.stream().map(complaintMapper1::mapToResponse).toList();
            List<ComplaintResponseDTO> responseList = new ArrayList<>();

            for (Complaint complaint : complaints) {
                ComplaintResponseDTO response = complaintMapper1.mapToResponse(complaint);
                responseList.add(response);
            }

            return responseList;

        }

    // Update status of a complaint (Admin only endpoint)
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ComplaintResponseDTO updateComplaintStatus(Long complaintId, UpdateComplaintStatusRequestDTO request) {
        Complaint complaint = complaintRepository1.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + complaintId));

        complaint.setStatus(request.getStatus());
        Complaint updatedComplaint = complaintRepository1.save(complaint);
        return complaintMapper1.mapToResponse(updatedComplaint);
    }


    // Compute high-level dashboard metrics (Total, Pending, In Progress, Resolved counts)
    @Override
    public DashboardStatsResponseDTO getDashboardStatistics() {
        long totalComplaints = complaintRepository1.count();
        long pendingComplaints = complaintRepository1.countByStatus(ComplaintStatus.PENDING);
        long inProgressComplaints = complaintRepository1.countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolvedComplaints = complaintRepository1.countByStatus(ComplaintStatus.RESOLVED);

        return new DashboardStatsResponseDTO(
                totalComplaints,
                pendingComplaints,
                inProgressComplaints,
                resolvedComplaints);
    }

    // Retrieve complaint counts grouped by category for analytics
    @Override
    public List<CategoryAnalyticsResponseDTO> getCategoryAnalytics() {
        return complaintRepository1.getCategoryAnalytics();
    }
}
