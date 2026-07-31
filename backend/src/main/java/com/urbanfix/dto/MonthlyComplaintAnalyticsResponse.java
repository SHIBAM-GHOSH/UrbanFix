package com.urbanfix.dto;

public class MonthlyComplaintAnalyticsResponse {

    private int year;
    private int month;
    private long complaintCount;

    public MonthlyComplaintAnalyticsResponse(int year, int month, long complaintCount) {
        this.year = year;
        this.month = month;
        this.complaintCount = complaintCount;
    }

    public int getYear() {
        return year;
    }

    public int getMonth() {
        return month;
    }

    public long getComplaintCount() {
        return complaintCount;
    }
}