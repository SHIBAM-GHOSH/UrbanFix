package com.urbanfix.service.Implementation;

import com.urbanfix.dto.UserDashboardStatsResponse;
import com.urbanfix.dto.UserProfileResponse;
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

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;

    // Resolves the JWT subject to the current persisted user.
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public UserProfileResponse getCurrentUserProfile() {
        User user = getCurrentUser();

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole());
    }

    @Override
    public UserDashboardStatsResponse getCurrentUserDashboardStatistics() {
        User user = getCurrentUser();

        return new UserDashboardStatsResponse(
                complaintRepository.countByUser(user),
                complaintRepository.countByUserAndStatus(user, ComplaintStatus.PENDING),
                complaintRepository.countByUserAndStatus(user, ComplaintStatus.RESOLVED));
    }
}
