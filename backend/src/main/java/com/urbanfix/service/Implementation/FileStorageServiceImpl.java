package com.urbanfix.service.Implementation;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import com.urbanfix.exception.InvalidOperationException;
import com.urbanfix.service.InterFaces.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

/**
 * Service implementation for handling image uploads.
 * Supports both AWS S3 cloud storage and local disk storage based on configuration.
 */
@Service
public class FileStorageServiceImpl implements FileStorageService {

    // AWS S3 client injected from AwsS3Config bean
    private final S3Client s3Client;

    // Specifies storage mode: 's3' or 'local'
    @Value("${storage.provider:s3}")
    private String storageProvider;

    // Target S3 bucket name
    @Value("${aws.s3.bucket-name:urbanfix-uploads}")
    private String bucketName;

    // Target AWS Region
    @Value("${aws.s3.region:ap-south-1}")
    private String region;

    // Constructor injection for S3Client
    public FileStorageServiceImpl(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Main upload method: validates file and routes upload to S3 or local disk.
     */
    @Override
    public String uploadFile(MultipartFile file) {
        // 1. Reject empty files
        if (file.isEmpty()) {
            throw new InvalidOperationException("Image file cannot be empty.");
        }

        // 2. Reject non-image file types
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidOperationException("Only image files are allowed.");
        }

        // 3. Generate a unique filename using UUID to prevent naming collisions
        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID() + "_" + (originalFileName != null ? originalFileName.replaceAll("\\s+", "_") : "image.jpg");

        // 4. If configured for S3, upload to AWS S3
        if ("s3".equalsIgnoreCase(storageProvider)) {
            return uploadToS3(file, uniqueFileName, contentType);
        }

        // 5. Otherwise, fall back to local disk storage
        return uploadToLocal(file, uniqueFileName);
    }

    /**
     * Uploads the file stream directly to AWS S3 bucket and returns the public HTTPS URL.
     */
    private String uploadToS3(MultipartFile file, String fileName, String contentType) {
        try {
            String s3Key = "uploads/" + fileName;

            // Build S3 upload request with content type (so browser opens image properly)
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .contentType(contentType)
                    .build();

            // Stream file content directly to S3
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // Construct and return full public S3 URL
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, s3Key);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to AWS S3", e);
        }
    }

    /**
     * Fallback method: saves file into local /uploads folder.
     */
    private String uploadToLocal(MultipartFile file, String uniqueFileName) {
        try {
            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + uniqueFileName;
        } catch (IOException exception) {
            throw new RuntimeException("Failed to upload image locally.", exception);
        }
    }
}
