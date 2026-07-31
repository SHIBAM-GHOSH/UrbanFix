package com.urbanfix.service.InterFaces;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    // Store the uploaded file and return its accessible URL
   
    // Store the uploaded file and return its accessible URL
    String uploadFile(MultipartFile file);
}