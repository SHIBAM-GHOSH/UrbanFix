package com.urbanfix.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Complaint statistics for the authenticated user")
// Counts are scoped to the user identified by the JWT.
public class UserDashboardStatsResponse {

    private long totalComplaints;

    private long pendingComplaints;

    private long resolvedComplaints;
}
