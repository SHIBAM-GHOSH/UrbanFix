package com.urbanfix.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponseDTO {

    private long totalComplaints;

    private long pendingComplaints;

    private long inProgressComplaints;

    private long resolvedComplaints;
}
