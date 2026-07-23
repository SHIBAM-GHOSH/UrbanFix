package com.urbanfix.service.Implementation;

import com.urbanfix.dto.ComplaintResponse;
import com.urbanfix.dto.CreateComplaintRequest;
import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;
import com.urbanfix.repository.ComplaintRepository;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.service.InterFaces.ComplaintService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.urbanfix.exception.ResourceNotFoundException;

import com.urbanfix.entity.Complaint;
import com.urbanfix.enums.*;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl
        implements ComplaintService {

    private final ComplaintRepository complaintRepository1;
    private final UserRepository userRepository1;

    // public ComplaintServiceImpl(
    //         ComplaintRepository complaintRepository1,
    //         UserRepository userRepository1) {

    //     this.complaintRepository1 = complaintRepository1;
    //     this.userRepository1 = userRepository1;
    // }

    @Override
    public ComplaintResponse createComplaint(CreateComplaintRequest request) {

        // Get the currently authenticated user
        Authentication authentication =
                SecurityContextHolder
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
        // Create a new Complaint entity
       
         // Convert receibed DTO to Entity
        Complaint complaint = mapToEntity(request, currentUser);

        // Save complaint
        Complaint savedComplaint = complaintRepository1.save(complaint);

    // Convert Entity to Response DTO
        return mapToResponse(savedComplaint);
        
       
    }


    /**
 * Converts CreateComplaintRequest DTO into Complaint Entity
 */
        private Complaint mapToEntity( CreateComplaintRequest request,User currentUser) 
                {

                        Complaint complaint = new Complaint();

                        complaint.setTitle(request.getTitle());
                        complaint.setDescription(request.getDescription());
                        complaint.setCategory(request.getCategory());
                        complaint.setLocation(request.getLocation());
                        complaint.setLatitude(request.getLatitude());
                        complaint.setLongitude(request.getLongitude());
                        complaint.setImageUrl(request.getImageUrl());

                        // Default values
                        complaint.setStatus(ComplaintStatus.PENDING);
                        complaint.setCreatedAt(LocalDateTime.now());
                        complaint.setUpdatedAt(LocalDateTime.now());

                        // Associate complaint with logged-in user
                        complaint.setUser(currentUser);

                        return complaint;
                }
        /**
 * Converts Complaint Entity into ComplaintResponse DTO
 */
        private ComplaintResponse mapToResponse(Complaint complaint) 
                {

                        ComplaintResponse response = new ComplaintResponse();

                        response.setId(complaint.getId());
                        response.setTitle(complaint.getTitle());
                        response.setDescription(complaint.getDescription());
                        response.setCategory(complaint.getCategory());
                        response.setLocation(complaint.getLocation());
                        response.setLatitude(complaint.getLatitude());
                        response.setLongitude(complaint.getLongitude());
                        response.setImageUrl(complaint.getImageUrl());
                        response.setStatus(complaint.getStatus());
                        response.setCreatedAt(complaint.getCreatedAt());
                        response.setUpdatedAt(complaint.getUpdatedAt());

                        response.setUserName(
                                complaint.getUser().getFullName()
                        );

                        return response;
                }
}