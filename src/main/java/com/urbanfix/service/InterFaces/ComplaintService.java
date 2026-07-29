package com.urbanfix.service.InterFaces;

import com.urbanfix.dto.CategoryAnalyticsResponse;

//import org.hibernate.query.Page;

import com.urbanfix.dto.ComplaintResponse;
import com.urbanfix.dto.CreateComplaintRequest;
import com.urbanfix.dto.DashboardStatsResponse;
import com.urbanfix.dto.MonthlyComplaintAnalyticsResponse;
import com.urbanfix.dto.UpdateComplaintRequest;
import com.urbanfix.dto.UpdateComplaintStatusRequest;
import com.urbanfix.enums.ComplaintStatus;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ComplaintService 
    {

        // Create a new complaint
        ComplaintResponse createComplaint(CreateComplaintRequest request,MultipartFile image);

        //List<ComplaintResponse> getAllComplaints();
        ComplaintResponse getComplaintById(Long complaintId);
        ComplaintResponse updateComplaint( Long complaintId, UpdateComplaintRequest request);
        void deleteComplaint(Long complaintId);
        // Returns the authenticated user's complaints with optional filters.
        Page<ComplaintResponse> getMyComplaints(
                        int page,
                        int size,
                        String sortBy,
                        String direction,
                        ComplaintStatus status,
                        String category,
                        String keyword);

        Page<ComplaintResponse> getAllComplaints(int page ,int size, String sortBy, String direction,
                                                ComplaintStatus status,String keyword);
        
        Page<ComplaintResponse> searchComplaints(String keyword,int page,int size);

        // Update the status of an existing complaint
        ComplaintResponse updateComplaintStatus(Long complaintId,UpdateComplaintStatusRequest request);

        // Retrieve all complaints for the admin dashboard
        Page<ComplaintResponse> getAllComplaintsForAdmin(
                ComplaintStatus status,
                String  category,
                int page,
                int size,
                String sortBy,
                String sortDirection);
        
        // Retrieve complaint statistics for the admin dashboard
        DashboardStatsResponse getDashboardStatistics();

                /**
         * Retrieves complaint count grouped by category.
         */
        List<CategoryAnalyticsResponse> getCategoryAnalytics();
        List<MonthlyComplaintAnalyticsResponse> getMonthlyComplaintAnalytics();
    
    }
