package com.urbanfix.service.InterFaces;

import com.urbanfix.dto.DashboardStatsResponseDTO;
import com.urbanfix.dto.UserProfileResponseDTO;

public interface UserService {

    // Returns the profile for the user identified by the JWT
    UserProfileResponseDTO getCurrentUserProfile();

    // Returns complaint counts for the authenticated user's dashboard
    DashboardStatsResponseDTO getCurrentUserDashboardStatistics();
}
