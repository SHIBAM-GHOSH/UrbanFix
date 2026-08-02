package com.urbanfix.repository;

import com.urbanfix.dto.CategoryAnalyticsResponse;
import com.urbanfix.dto.MonthlyComplaintAnalyticsResponse;
import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // Find all complaints created by a specific user entity
    List<Complaint> findByUser(User user);

    // Count total complaints submitted by a specific user
    long countByUser(User user);

    // Count complaints submitted by a user with a specific status
    long countByUserAndStatus(User user, ComplaintStatus status);

    // Count total complaints in the system with a specific status
    long countByStatus(ComplaintStatus status);

    // Fetch complaints created by the logged-in user with optional status and category filters (Sorted newest-first)
    @Query("""
        SELECT c FROM Complaint c
        WHERE c.user = :user
          AND (:status IS NULL OR c.status = :status)
          AND (:category IS NULL OR :category = '' OR c.category = :category)
        ORDER BY c.createdAt DESC
    """)
    List<Complaint> findMyComplaintsFiltered(
        @Param("user") User user,
        @Param("status") ComplaintStatus status,
        @Param("category") String category);

    // Fetch all complaints in the system with optional status and category filters (Sorted newest-first)
    @Query("""
        SELECT c FROM Complaint c
        WHERE (:status IS NULL OR c.status = :status)
          AND (:category IS NULL OR :category = '' OR c.category = :category)
        ORDER BY c.createdAt DESC
    """)
    List<Complaint> findAllComplaintsFiltered(
        @Param("status") ComplaintStatus status,
        @Param("category") String category);

    // Group complaints by category and return category counts for analytics
    @Query("""
        SELECT new com.urbanfix.dto.CategoryAnalyticsResponse(
                c.category,
                COUNT(c)
        )
        FROM Complaint c
        GROUP BY c.category
        ORDER BY COUNT(c) DESC
    """)   
    List<CategoryAnalyticsResponse> getCategoryAnalytics();

    // Group complaints by year and month for analytics chart
    @Query("""
        SELECT new com.urbanfix.dto.MonthlyComplaintAnalyticsResponse(
                YEAR(c.createdAt),
                MONTH(c.createdAt),
                COUNT(c)
        )
        FROM Complaint c
        GROUP BY YEAR(c.createdAt), MONTH(c.createdAt)
        ORDER BY YEAR(c.createdAt), MONTH(c.createdAt)
    """)
    List<MonthlyComplaintAnalyticsResponse> getMonthlyComplaintAnalytics();
}
