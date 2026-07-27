package com.urbanfix.service.Implementation;

import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.io.IOException;

import com.urbanfix.exception.InvalidOperationException;
import com.urbanfix.service.InterFaces.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageServiceImpl implements FileStorageService {

@Override
public String uploadFile(MultipartFile file) 
        {   
            // Reject empty uploads
            if (file.isEmpty()) 
                {
                    throw new InvalidOperationException("Image file cannot be empty.");
                }
            // Extract the original file name
            String originalFileName = file.getOriginalFilename();

            // Validate that the uploaded file is an image
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new InvalidOperationException("Only image files are allowed.");
            }
            // Generate a unique file name
            String uniqueFileName = UUID.randomUUID() + "_" + originalFileName;
            // Define the upload directory
            Path uploadPath = Paths.get("uploads");
            // Build the complete destination path
            Path filePath = uploadPath.resolve(uniqueFileName);

            try {

                    // Create the upload directory if it doesn't exist
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }

                    // Copy the uploaded file to the destination
                    Files.copy(
                            file.getInputStream(),
                            filePath,
                            StandardCopyOption.REPLACE_EXISTING
                    );
                    // Return the relative URL of the uploaded image
                    return "/uploads/" + uniqueFileName;

                } 
            catch (IOException exception) 
                {
                    throw new RuntimeException( "Failed to upload image.", exception);
                }
        }
}