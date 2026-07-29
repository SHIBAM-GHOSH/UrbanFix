package com.urbanfix.service.InterFaces;

import com.urbanfix.dto.UserDashboardStatsResponse;
import com.urbanfix.dto.UserProfileResponse;

public interface UserService {

    // Returns the profile for the user identified by the JWT.
    UserProfileResponse getCurrentUserProfile();

    // Returns complaint counts for the authenticated user's dashboard.
    UserDashboardStatsResponse getCurrentUserDashboardStatistics();
}
