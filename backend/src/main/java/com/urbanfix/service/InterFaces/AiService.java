package com.urbanfix.service.InterFaces;
import com.urbanfix.dto.AiClassificationDTO;

public interface AiService{
    AiClassificationDTO classifyComplaint(String title, String description);
        
}