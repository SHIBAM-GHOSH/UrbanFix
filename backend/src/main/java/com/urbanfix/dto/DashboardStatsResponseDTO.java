package com.urbanfix.dto;

import lombok.Data;

@Data
public class DashboardStatsResponseDTO {

    private long totalComplaints;

    private long pendingComplaints;

    private long inProgressComplaints;

    private long resolvedComplaints;

    public DashboardStatsResponseDTO()
    {

    }

    public DashboardStatsResponseDTO(long totalComplaints, long pendingComplaints, long inProgressComplaints, long resolvedComplaints) {
        this.totalComplaints = totalComplaints;
        this.pendingComplaints = pendingComplaints;
        this.inProgressComplaints = inProgressComplaints;
        this.resolvedComplaints = resolvedComplaints;
    }
}
