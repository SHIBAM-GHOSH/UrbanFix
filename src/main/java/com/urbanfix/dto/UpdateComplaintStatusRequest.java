package com.urbanfix.dto;

import com.urbanfix.enums.ComplaintStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateComplaintStatusRequest {

    @NotNull(message = "Status is required.")
    private ComplaintStatus status;
}