package com.urbanfix.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

import com.urbanfix.enums.ComplaintStatus;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {

    // Primary Key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Complaint title
    @Column(nullable = false)
    private String title;

    // Detailed description
    @Column(nullable = false, length = 1000)
    private String description;

    // Category (Road, Garbage, Water...)
    @Column(nullable = false)
    private String category;

    // Address / Area
    @Column(nullable = false)
    private String location;

    // Latitude
    private Double latitude;

    // Longitude
    private Double longitude;

    // Image URL (Cloudinary later)
    private String imageUrl;

    //Compleint severity
    private String severity;

    // Complaint Status
    @Enumerated(EnumType.STRING)
    private ComplaintStatus status;

    // Time of creation
    private LocalDateTime createdAt;

    // Time of last update
    private LocalDateTime updatedAt;

    // User who created the complaint
    //here User is JAVA_ENTITY_CLASS
    //user is VARIABLE_NAME
    @ManyToOne(fetch = FetchType.LAZY)//@JoinColumn(name = "FOREIGN_KEY_COLUMN_NAME_IN_CURRENT_TABLE")
    @JoinColumn(name = "user_id") //private JAVA_ENTITY_CLASS variableName;
    private User user;


    public Complaint() {
    }

    // Getters and Setters
}