package com.urbanfix.service.Implementation;

import com.urbanfix.dto.DashboardStatsResponseDTO;
import com.urbanfix.dto.UserProfileResponseDTO;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;
import com.urbanfix.exception.ResourceNotFoundException;
import com.urbanfix.repository.ComplaintRepository;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.service.InterFaces.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;  //final mean its value cannot be changed after initialization
    private final ComplaintRepository complaintRepository;

    // Resolves the JWT subject to the current persisted user.
    private User getCurrentUser() {  // get user row from table to user object
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(email) //findbyEmail return  user object if user is found else NULL
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public UserProfileResponseDTO getCurrentUserProfile() {
        User user1 = getCurrentUser(); //get curretn userdetaisl into object container 

        return new UserProfileResponseDTO(user1.getId(), user1.getFullName(), user1.getEmail(), user1.getRole());
    }

    @Override
    public DashboardStatsResponseDTO getCurrentUserDashboardStatistics() {
        User user = getCurrentUser();

        return new DashboardStatsResponseDTO(
                complaintRepository.countByUser(user),
                complaintRepository.countByUserAndStatus(user, ComplaintStatus.PENDING),
                complaintRepository.countByUserAndStatus(user, ComplaintStatus.IN_PROGRESS),
                complaintRepository.countByUserAndStatus(user, ComplaintStatus.RESOLVED));
    }
}
