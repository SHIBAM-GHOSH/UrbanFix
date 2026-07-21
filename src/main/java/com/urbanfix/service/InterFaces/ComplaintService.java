package com.urbanfix.service.InterFaces;

import com.urbanfix.dto.ComplaintResponse;
import com.urbanfix.dto.CreateComplaintRequest;

public interface ComplaintService 
    {

        // Create a new complaint
        ComplaintResponse createComplaint(CreateComplaintRequest request);
    }