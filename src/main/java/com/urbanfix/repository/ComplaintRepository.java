package com.urbanfix.repository;

import com.urbanfix.dto.CategoryAnalyticsResponse;
import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long>,
        JpaSpecificationExecutor<Complaint> {

    // Find all complaints created by a specific user
    List<Complaint> findByUser(User user);
    
   // Page<Complaint> findByStatus(ComplaintStatus status,Pageable pageable);
    Page<Complaint> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String title,
        String description,
        Pageable pageable);
    
        /**
     * Counts complaints with the given status.
     */
    long countByStatus(ComplaintStatus status);
        /**
     * Retrieves complaint count grouped by category.
     */
        /**SELECT category,
         COUNT(*)
    FROM complaints
    GROUP BY category
    ORDER BY COUNT(*) DESC; */
    //creating DTO objects directly. by new keyword 
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

    //syntax -@Query(...)
    //List<CategoryAnalyticsResponse> getCategoryAnalytics();
}