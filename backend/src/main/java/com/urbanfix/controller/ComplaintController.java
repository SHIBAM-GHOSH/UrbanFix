package com.urbanfix.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.urbanfix.dto.ComplaintResponse;
import com.urbanfix.dto.CreateComplaintRequest;
import com.urbanfix.dto.DashboardStatsResponse;
import com.urbanfix.dto.UpdateComplaintRequest;
import com.urbanfix.dto.UpdateComplaintStatusRequest;
import com.urbanfix.enums.ComplaintStatus;
import com.urbanfix.service.InterFaces.ComplaintService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService1;

    // POST /api/complaints : Create a new civic complaint with multipart form data
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create a new complaint")
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @ModelAttribute CreateComplaintRequest request,
            @RequestPart(required = false) MultipartFile image) {
        ComplaintResponse response = complaintService1.createComplaint(request, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/complaints : Retrieve all complaints in the system with optional status/category filters
    @GetMapping
    @Operation(summary = "Get all complaints with optional filters")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) String category) {
        List<ComplaintResponse> responses = complaintService1.getAllComplaints(status, category);
        return ResponseEntity.ok(responses);
    }

    // GET /api/complaints/{complaintId} : Get a specific complaint by ID
    @GetMapping("/{complaintId}")
    @Operation(summary = "Get complaint by ID")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long complaintId) {
        ComplaintResponse response = complaintService1.getComplaintById(complaintId);
        return ResponseEntity.ok(response);
    }

    // PUT /api/complaints/{complaintId} : Update details of an existing complaint (creator only)
    @PutMapping("/{complaintId}")
    @Operation(summary = "Update complaint details")
    public ResponseEntity<ComplaintResponse> updateComplaint(
            @PathVariable Long complaintId,
            @Valid @RequestBody UpdateComplaintRequest request) {
        ComplaintResponse response = complaintService1.updateComplaint(complaintId, request);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/complaints/{complaintId} : Delete a complaint (creator or admin only)
    @DeleteMapping("/{complaintId}")
    @Operation(summary = "Delete a complaint")
    public ResponseEntity<String> deleteComplaint(@PathVariable Long complaintId) {
        complaintService1.deleteComplaint(complaintId);
        return ResponseEntity.ok("Complaint deleted successfully.");
    }

    // GET /api/complaints/my : Retrieve complaints submitted by the authenticated user
    @GetMapping("/my")
    @Operation(summary = "Get the authenticated user's complaints")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) String category) {
        List<ComplaintResponse> responses = complaintService1.getMyComplaints(status, category);
        return ResponseEntity.ok(responses);
    }

    // PATCH /api/complaints/{id}/status : Update complaint status
    @PatchMapping("/{id}/status")
    @Operation(summary = "Update complaint status")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateComplaintStatusRequest request) {
        ComplaintResponse response = complaintService1.updateComplaintStatus(id, request);
        return ResponseEntity.ok(response);
    }

    // GET /api/complaints/dashboard : Retrieve aggregate statistics (admin only)
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardStatsResponse> getDashboardStatistics() {
        DashboardStatsResponse response = complaintService1.getDashboardStatistics();
        return ResponseEntity.ok(response);
    }
}
