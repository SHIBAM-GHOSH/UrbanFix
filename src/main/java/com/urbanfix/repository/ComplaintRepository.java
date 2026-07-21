package com.urbanfix.repository;

import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository
        extends JpaRepository<Complaint, Long> {

    // Find all complaints created by a specific user
    List<Complaint> findByUser(User user);
}