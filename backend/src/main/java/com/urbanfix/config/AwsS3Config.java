package com.urbanfix.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

/**
 * Configuration class to set up AWS S3 connection for Spring Boot.
 * It creates a reusable S3Client bean so we can upload files to S3.
 */
@Configuration
public class AwsS3Config {

    // Read AWS region from application.properties (defaults to ap-south-1)
    @Value("${aws.s3.region:ap-south-1}")
    private String region;

    // Read AWS Access Key from application.properties or environment variable
    @Value("${aws.s3.access-key:}")
    private String accessKey;

    // Read AWS Secret Key from application.properties or environment variable
    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    /**
     * Creates and registers the S3Client Spring Bean.
     * This bean is injected into FileStorageServiceImpl to perform image uploads.
     */
    @Bean
    public S3Client s3Client() {
        // 1. If explicit Access Key and Secret Key are provided (e.g. local testing), use them:
        if (accessKey != null && !accessKey.isBlank() && secretKey != null && !secretKey.isBlank()) {
            return S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)
                    ))
                    .build();
        }

        // 2. Otherwise, use AWS Default Credentials Chain (automatically detects AWS EC2 IAM Roles when deployed)
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }
}
