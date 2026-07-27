package com.urbanfix.repository;

import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

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
}