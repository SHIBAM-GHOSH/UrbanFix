package com.urbanfix.service.Implementation;

import com.urbanfix.dto.ComplaintResponse;
import com.urbanfix.dto.CreateComplaintRequest;
import com.urbanfix.entity.User;
import com.urbanfix.repository.ComplaintRepository;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.service.InterFaces.ComplaintService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.urbanfix.exception.ResourceNotFoundException;

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
    public ComplaintResponse createComplaint(
            CreateComplaintRequest request) {

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

        return null;
    }
}