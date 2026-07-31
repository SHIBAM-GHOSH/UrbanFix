package com.urbanfix.specification;

import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

/**
 * Builds dynamic database queries for Complaint entity.
 */
public class ComplaintSpecification {

        // Restricts a query to complaints created by one user.
        public static Specification<Complaint> belongsToUser(User user) {
                return (root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("user"), user);
        }

            /**
         * Creates a filter for complaint status.
         * Returns null when no status is provided.
         */
        public static Specification<Complaint> hasStatus(ComplaintStatus status) 
            {
                if (status == null) {
                    return Specification.unrestricted();
                }
                return (root, query, criteriaBuilder) ->criteriaBuilder.equal(root.get("status"),status);                  
            }

        /**
        * Searches complaints by title or description.
        */
        public static Specification<Complaint> containsKeyword(String keyword) 
            {

                if (keyword == null || keyword.isBlank()) 
                    {
                        return Specification.unrestricted();
                    }

                return (root, query, criteriaBuilder) ->criteriaBuilder.or(

                                                    criteriaBuilder.like(
                                                            criteriaBuilder.lower(root.get("title")),
                                                            "%" + keyword.toLowerCase() + "%"),

                                                    criteriaBuilder.like(
                                                            criteriaBuilder.lower(root.get("description")),
                                                            "%" + keyword.toLowerCase() + "%")
                                            );
            }

        // Creates a filter for complaint category.
        // Returns unrestricted when no category is provided.
        public static Specification<Complaint> hasCategory(String category) 
            {

                if (category == null || category.isBlank()) {
                    return Specification.unrestricted();
                }

                return (root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("category"), category);
            }
        
        // Build dynamic filters for complaint search
      
            

                                                
}
