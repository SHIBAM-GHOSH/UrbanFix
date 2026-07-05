package com.urbanfix.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

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

}