package com.urbanfix.Mapper;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.urbanfix.dto.ComplaintRequestDTO;
import com.urbanfix.dto.ComplaintResponseDTO;
import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;

@Component
public class ComplaintMapper {

    public Complaint mapToEntity(
            ComplaintRequestDTO request,
            User currentUser) {

        Complaint complaint = new Complaint();

        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setLocation(request.getLocation());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setImageUrl(request.getImageUrl());

        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());

        complaint.setUser(currentUser);

        return complaint;
    }

//response object for ADMIN dash board
    public ComplaintResponseDTO mapToResponse(Complaint complaint) {

        ComplaintResponseDTO response = new ComplaintResponseDTO();

        response.setId(complaint.getId());
        response.setTitle(complaint.getTitle());
        response.setDescription(complaint.getDescription());
        response.setCategory(complaint.getCategory());
        response.setLocation(complaint.getLocation());
        response.setLatitude(complaint.getLatitude());
        response.setLongitude(complaint.getLongitude());
        response.setImageUrl(complaint.getImageUrl());
        response.setStatus(complaint.getStatus());

        response.setSeverity(complaint.getSeverity());
        response.setCreatedAt(complaint.getCreatedAt());
        response.setUpdatedAt(complaint.getUpdatedAt());
        response.setUserName(complaint.getUser().getFullName());

        return response;
    }
}
