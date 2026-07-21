package com.urbanfix.dto;

import com.urbanfix.enums.ComplaintStatus;

import java.time.LocalDateTime;

public class ComplaintResponse {

    private Long id;

    private String title;

    private String description;

    private String category;

    private String location;

    private Double latitude;

    private Double longitude;

    private String imageUrl;

    private ComplaintStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Name of the user who created the complaint
    private String userName;

    public ComplaintResponse() {
    }

    // Generate Getters and Setters
}