package com.urbanfix.dto;

// DTO returned after successful login
public class LoginResponse 
    {

        private String message;

        public LoginResponse() {
        }

        public LoginResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }