package com.urbanfix.controller;

import java.util.List;

import org.springframework.data.domain.Page;
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
import com.urbanfix.dto.CreateComplaintRequest; //dATA TRANSFER OBJECT   
import com.urbanfix.dto.DashboardStatsResponse;
import com.urbanfix.dto.UpdateComplaintRequest;
import com.urbanfix.dto.UpdateComplaintStatusRequest;
import com.urbanfix.enums.ComplaintStatus;
import com.urbanfix.service.InterFaces.ComplaintService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController 
    {
        
        private final ComplaintService complaintService1;

        // @NoArgsConstructor is removed and @RequiredArgsConstructor is used
        // to automatically inject the ComplaintService dependency.

        @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ComplaintResponse> createComplaint( @Valid @ModelAttribute CreateComplaintRequest request,
                                                                    @RequestPart(required = false) MultipartFile image) 
            {
                ComplaintResponse response = complaintService1.createComplaint(request,image);
                return ResponseEntity.status(HttpStatus.CREATED)
                                        .body(response);
            }
        
        @GetMapping
        public ResponseEntity<Page<ComplaintResponse>> getAllComplaints(
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size,
                                        @RequestParam(defaultValue = "createdAt") String sortBy,
                                        @RequestParam(defaultValue = "desc") String direction,
                                        @RequestParam(required = false) ComplaintStatus status,
                                        @RequestParam(required = false) String keyword) 
            {       
                    System.out.println(">>> Entered getAllComplaints controller");
                    Page<ComplaintResponse> responses = complaintService1.getAllComplaints(page,size,sortBy,direction,status,keyword);

                    return ResponseEntity.ok(responses);
            }

    
        @GetMapping("/{complaintId}")
        public ResponseEntity<ComplaintResponse> getComplaintById( @PathVariable Long complaintId) 
                {
                    
                    ComplaintResponse response = complaintService1.getComplaintById(complaintId);

                    return ResponseEntity.ok(response);
                }
        

        @PutMapping("/{complaintId}")
        public ResponseEntity<ComplaintResponse> updateComplaint( @PathVariable Long complaintId,
                                                                    @Valid
                                                                    @RequestBody
                                                                    UpdateComplaintRequest request) 
            {
                ComplaintResponse response = complaintService1.updateComplaint( complaintId, request);
                return ResponseEntity.ok(response);
            }
        
        @DeleteMapping("/{complaintId}")
        public ResponseEntity<String> deleteComplaint(@PathVariable Long complaintId) 
            {
                complaintService1.deleteComplaint(complaintId);
                return ResponseEntity.ok("Complaint deleted successfully.");
            }

        @GetMapping("/my")
        public ResponseEntity<List<ComplaintResponse>> getMyComplaints() 
            {
                List<ComplaintResponse> responses = complaintService1.getMyComplaints();
                return ResponseEntity.ok(responses);
            }

                /**
         * Search complaints by title or description.
         */
        @GetMapping("/search")
        public ResponseEntity<Page<ComplaintResponse>> searchComplaints(

                                @RequestParam String keyword,
                                @RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "10") int size) 
                {

                Page<ComplaintResponse> responses = complaintService1
                                                        .searchComplaints(keyword, page, size);
                return ResponseEntity.ok(responses);
                }

        // Update the status of a complaint
        @PatchMapping("/{id}/status")
        //@PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ComplaintResponse> updateComplaintStatus(@PathVariable Long id,
                                                                        @Valid
                                                                        @RequestBody
                                                                        UpdateComplaintStatusRequest request) 
        {
            ComplaintResponse response = complaintService1.updateComplaintStatus(id, request);
            return ResponseEntity.ok(response);
        }
                /**
         * Retrieves dashboard statistics.
         * Accessible only by administrators.
         */
        @GetMapping("/dashboard")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<DashboardStatsResponse> getDashboardStatistics()
            {

                DashboardStatsResponse response =
                        complaintService1.getDashboardStatistics();
                return ResponseEntity.ok(response);
            }



    }