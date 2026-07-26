package com.urbanfix.service.InterFaces;

//import org.hibernate.query.Page;

import com.urbanfix.dto.ComplaintResponse;
import com.urbanfix.dto.CreateComplaintRequest;
import com.urbanfix.dto.UpdateComplaintRequest;
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

        List<ComplaintResponse> getMyComplaints();

        Page<ComplaintResponse> getAllComplaints(int page ,int size, String sortBy, String direction,
                                                ComplaintStatus status,String keyword);
        
        Page<ComplaintResponse> searchComplaints(String keyword,int page,int size);

    
    }