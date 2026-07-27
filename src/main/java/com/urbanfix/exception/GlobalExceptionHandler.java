package com.urbanfix.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.bind.MethodArgumentNotValidException;

import org.springframework.security.authentication.BadCredentialsException;

import java.util.HashMap;
import java.util.Map;

import java.util.Map;

@ControllerAdvice // Watches all controllers for exceptions
public class GlobalExceptionHandler {

    // Handles duplicate resource exceptions
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateResource(
            ResourceAlreadyExistsException ex) {

        Map<String, String> response = Map.of(
                "error", ex.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    // Handles validation errors (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
                MethodArgumentNotValidException ex) 
        {

            Map<String, String> errors = new HashMap<>();

            ex.getBindingResult().getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });

            Map<String, Object> response = new HashMap<>();

            response.put("status", 400);
            response.put("message", "Validation Failed");
            response.put("errors", errors);

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

    // Handles invalid login credentials
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(
            BadCredentialsException ex)
            {

                Map<String, String> response = Map.of(
                        "error", "Invalid email or password"
                );

                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }

    // Handles invalid business operations
    @ExceptionHandler(InvalidOperationException.class)
    public ResponseEntity<Map<String, String>> handleInvalidOperation(InvalidOperationException ex) 
            {
                Map<String, String> response = Map.of("error", ex.getMessage());
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) 
    {
            Map<String, String> response = Map.of("error", ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Handles files exceeding the maximum upload size
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException ex) 
        {

            Map<String, String> response = Map.of("error", "File size exceeds the maximum limit of 5 MB.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

}