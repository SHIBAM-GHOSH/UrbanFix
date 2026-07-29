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
import com.urbanfix.repository.ComplaintRepository;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.service.InterFaces.ComplaintService;
import com.urbanfix.service.InterFaces.FileStorageService;
import com.urbanfix.specification.ComplaintSpecification;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.urbanfix.exception.InvalidOperationException;
import com.urbanfix.exception.ResourceNotFoundException;

import com.urbanfix.entity.Complaint;
import com.urbanfix.enums.*;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
//Spring Boot know 
//Whenever someone asks for a ComplaintService, I'll provide a ComplaintServiceImpl
public class ComplaintServiceImpl implements ComplaintService 
{       

        //Dependecny modeule Injection
        private final ComplaintRepository complaintRepository1;
        private final UserRepository userRepository1;
        private final ComplaintMapper complaintMapper1;
        private final FileStorageService fileStorageService1;
        
        //fucn to Extract curretn user fom context and verify it from DataBase
        private User getCurrentUser() 
                {
    
                        Authentication authentication =SecurityContextHolder.getContext().getAuthentication();
    
                        String email = authentication.getName();
                        return userRepository1.findByEmail(email)
                                                .orElseThrow(() ->
                                                new ResourceNotFoundException("User not found"));
                }
    // public ComplaintServiceImpl(
    //         ComplaintRepository complaintRepository1,
    //         UserRepository userRepository1) {

    //     this.complaintRepository1 = complaintRepository1;
    //     this.userRepository1 = userRepository1;
    // }

    @Override
        public ComplaintResponse createComplaint(CreateComplaintRequest request,MultipartFile image)
                {
                        // Get the currently authenticated user
                        Authentication authentication = SecurityContextHolder
                                                                .getContext()
                                                                .getAuthentication();
                        // Extract the logged-in user's email
                        String email = authentication.getName();
                        // Fetch the user from the database
                        User currentUser = userRepository1
                                .findByEmail(email)
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "User not found with email: " + email
                                        ));
                        // Upload the image if provided
                        String imageUrl = null;
                        if (image != null && !image.isEmpty()) {
                        imageUrl = fileStorageService1.uploadFile(image);
                        
                                }
                        
                        // Convert receibed DTO to Entity
                        Complaint complaint = complaintMapper1.mapToEntity(request, currentUser);
                        // Associate the uploaded image with the complaint
                        complaint.setImageUrl(imageUrl);
                        // Save complaint
                        Complaint savedComplaint = complaintRepository1.save(complaint);

                        // Convert Entity to Response DTO
                        return complaintMapper1.mapToResponse(savedComplaint);     
                }
        
        @Override
        public Page<ComplaintResponse> getAllComplaints(int page, int size, String sortBy,String direction ,ComplaintStatus status,String keyword)         
                {       // Fetch all complaints from the database
                        Sort sort = direction.equalsIgnoreCase("desc")
                                        ? Sort.by(sortBy).descending()
                                        : Sort.by(sortBy).ascending();
                        Pageable pageable = PageRequest.of(page,size,sort);
                                ///////
                                // Build a dynamic query using reusable specifications
                        // Start with an empty specification
                        Specification<Complaint> specification = Specification.unrestricted();
                        // Add status filter if provided
                        specification = specification.and(ComplaintSpecification.hasStatus(status));
                        // Add keyword filter if provided
                        specification = specification.and(ComplaintSpecification.containsKeyword(keyword));
                        // Execute the query with pagination and sorting
                        Page<Complaint> complaints =complaintRepository1.findAll(specification,pageable);

                        return complaints.map(complaintMapper1::mapToResponse);
                                ////////////////                               
                }
        @Override
        public ComplaintResponse getComplaintById(Long complaintId) 
                {
                        Complaint complaint = complaintRepository1
                                                .findById(complaintId)
                                                .orElseThrow(() ->
                                                        new ResourceNotFoundException(
                                                                "Complaint not found with id: " + complaintId));
                        
                        ComplaintResponse response = complaintMapper1.mapToResponse(complaint);
                        return response;
                }
        
        @Override
        public ComplaintResponse updateComplaint(Long complaintId, UpdateComplaintRequest request) 
                {
                        Complaint complaint = complaintRepository1
                                                .findById(complaintId)
                                                .orElseThrow(() ->
                                                        new ResourceNotFoundException(
                                                                "Complaint not found with id: " + complaintId
                                                        ));
                        
                        //Get the logged-in user
                        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                        String email = authentication.getName();
                        User currentUser = userRepository1.findByEmail(email)
                                                        .orElseThrow(() -> 
                                                        new ResourceNotFoundException("User not found"));
                        
                        //Only the creator of the complaint should be able to edit it.
                        if (!complaint.getUser().getId().equals(currentUser.getId()))
                        {
                                throw new InvalidOperationException(
                                        "You are not allowed to update this complaint."
                                );
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
        @Override
        public
        void deleteComplaint(Long complaintId)
                {       
                        //get the complaint block from DB
                        Complaint complaint = complaintRepository1
                                                .findById(complaintId)
                                                .orElseThrow(() ->
                                                        new ResourceNotFoundException(
                                                                "Complaint not found with id: " + complaintId
                                                        ));


                        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                        String email = authentication.getName();
                        User currentUser = userRepository1.findByEmail(email)
                                                        .orElseThrow(() -> 
                                                        new ResourceNotFoundException("User not found"));
                        
                        //Check that the complaint belongs to the current user
                        if (!complaint.getUser().getId().equals(currentUser.getId()))
                        {
                                throw new InvalidOperationException(
                                                "You are not allowed to delete this complaint."
                                );
                        }

                        complaintRepository1.delete(complaint);

                }
        @Override
        public List<ComplaintResponse> getMyComplaints() 
                {
                        User currentUser = getCurrentUser();
                        List<Complaint> complaints = complaintRepository1.findByUser(currentUser);
                        List<ComplaintResponse> responses = new ArrayList<>();

                        for (Complaint complaint : complaints) {
                                responses.add(
                                        complaintMapper1.mapToResponse(complaint));
                        }
                        return responses;
                }
        
        @Override
        public Page<ComplaintResponse> searchComplaints(String keyword,int page,int size) 
                {
                        // Create pagination request
                        Pageable pageable = PageRequest.of(page, size);
                        // Search complaints by title or description
                        Page<Complaint> complaints =
                                        complaintRepository1
                                                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                                                                                                        keyword,
                                                                                                        keyword,
                                                                                                        pageable);
                        // Convert entities into API response DTOs
                        return complaints.map(complaintMapper1::mapToResponse);
                }
        
        @Override
        @PreAuthorize("hasRole('ADMIN')")
        public ComplaintResponse updateComplaintStatus(Long complaintId,UpdateComplaintStatusRequest request) 
                {       
                        // // Get the currently authenticated user
                        // Authentication authentication = SecurityContextHolder
                        //                                 .getContext()
                        //                                 .getAuthentication();

                        // // Allow only ADMIN users to update complaint status
                        // if (authentication.getAuthorities().stream()
                        //         .noneMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) 
                        //         {

                        //         throw new InvalidOperationException("Only admins can update complaint status.");
                        //         }

                        // Fetch the complaint from the database
                        Complaint complaint = complaintRepository1
                                .findById(complaintId)
                                .orElseThrow(() ->
                                        new ResourceNotFoundException(
                                                "Complaint not found with id: " + complaintId
                                        ));

                        // Update the complaint status
                        complaint.setStatus(request.getStatus());
                        // Persist the updated complaint
                        Complaint updatedComplaint = complaintRepository1.save(complaint);
                        // Convert entity to response DTO
                        return complaintMapper1.mapToResponse(updatedComplaint);
                }

        @Override
        public Page<ComplaintResponse> getAllComplaintsForAdmin(
                ComplaintStatus status,String category,
                int page,int size,
                String sortBy,String sortDirection) 
                {
                        // Create sorting configuration
                        Sort sort = sortDirection.equalsIgnoreCase("asc")
                                ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();

                        // Create pageable request
                        Pageable pageable = PageRequest.of(page, size, sort);
                        // Build dynamic filters
                        Specification<Complaint> specification =Specification
                                                .where(ComplaintSpecification.hasStatus(status))
                                                .and(ComplaintSpecification.hasCategory(category));

                        // Fetch filtered complaints
                        Page<Complaint> complaintPage = complaintRepository1.findAll(specification, pageable);
                        // Convert entities to DTOs
                        return complaintPage.map(complaintMapper1::mapToResponse);
                }
        @Override
        public DashboardStatsResponse getDashboardStatistics() 
                {
                        // Count all complaints
                        long totalComplaints = complaintRepository1.count();

                        // Count complaints by status
                        long pendingComplaints =
                                complaintRepository1.countByStatus(ComplaintStatus.PENDING);

                        long inProgressComplaints =
                                complaintRepository1.countByStatus(ComplaintStatus.IN_PROGRESS);

                        long resolvedComplaints =
                                complaintRepository1.countByStatus(ComplaintStatus.RESOLVED);

                        // Build dashboard response
                        return new DashboardStatsResponse(
                                        totalComplaints,
                                        pendingComplaints,
                                        inProgressComplaints,
                                        resolvedComplaints);
                }
        @Override
        public List<CategoryAnalyticsResponse> getCategoryAnalytics() 
        {

                // Retrieve complaint count grouped by category
                return complaintRepository1.getCategoryAnalytics();
        }

        @Override
        public List<MonthlyComplaintAnalyticsResponse> getMonthlyComplaintAnalytics() 
                {
                        // Retrieve complaint count grouped by year and month
                        return complaintRepository1.getMonthlyComplaintAnalytics();
                }

}



        