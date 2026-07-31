package com.urbanfix.exception;

// Custom exception for duplicate resources
public class ResourceAlreadyExistsException extends RuntimeException {

    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}