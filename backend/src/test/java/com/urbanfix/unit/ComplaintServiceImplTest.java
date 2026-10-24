package com.urbanfix.unit;

import com.urbanfix.dto.ComplaintRequestDTO;
import com.urbanfix.dto.ComplaintResponseDTO;
import com.urbanfix.Mapper.ComplaintMapper;
import com.urbanfix.entity.Complaint;
import com.urbanfix.entity.User;
import com.urbanfix.enums.ComplaintStatus;
import com.urbanfix.enums.Role;
import com.urbanfix.exception.InvalidOperationException;
import com.urbanfix.exception.ResourceNotFoundException;
import com.urbanfix.repository.ComplaintRepository;
import com.urbanfix.repository.UserRepository;
import com.urbanfix.service.Implementation.ComplaintServiceImpl;
import com.urbanfix.service.InterFaces.AiService;
import com.urbanfix.service.InterFaces.FileStorageService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * ==============================================================================
 * WHITE-BOX UNIT TESTS: ComplaintServiceImpl
 * Category: Unit Testing (White-box) — Mocked dependencies
 * Tests: Business logic for complaint creation, retrieval, delete authorization.
 * Test IDs: UT-CS-01 through UT-CS-07
 * ==============================================================================
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UT: ComplaintServiceImpl — Business Logic Tests")
class ComplaintServiceImplTest {

    @Mock private ComplaintRepository complaintRepository1;
    @Mock private UserRepository userRepository1;
    // Use real mapper but instantiate service manually, no mock needed
    private ComplaintMapper complaintMapper1 = new ComplaintMapper();
    @Mock private FileStorageService fileStorageService1;
    @Mock private AiService aiService1;

    // Service instantiated manually in setUp to ensure real mapper is injected
    private ComplaintServiceImpl complaintService;

    private User citizenUser;
    private User adminUser;
    private User otherUser;
    private Complaint complaint;

    @BeforeEach
    void setUp() {
        citizenUser = new User();
        citizenUser.setId(1L);
        citizenUser.setEmail("citizen@urbanfix.test");
        citizenUser.setRole(Role.USER);

        adminUser = new User();
        adminUser.setId(99L);
        adminUser.setEmail("admin@urbanfix.com");
        adminUser.setRole(Role.ADMIN);

        otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other@urbanfix.test");
        otherUser.setRole(Role.USER);

        complaint = new Complaint();
        complaint.setId(10L);
        complaint.setTitle("Pothole on MG Road");
        complaint.setDescription("Large pothole causing accidents");
        complaint.setCategory("Roads");
        complaint.setLocation("MG Road, Bangalore");
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setUser(citizenUser);

        // Mock the security context so getCurrentUser() works (lenient stubbing)
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        lenient().when(ctx.getAuthentication()).thenReturn(auth);
        lenient().when(auth.getName()).thenReturn(citizenUser.getEmail());
        SecurityContextHolder.setContext(ctx);

        lenient().when(userRepository1.findByEmail(citizenUser.getEmail())).thenReturn(Optional.of(citizenUser));

        // Manually construct the service with real mapper
        complaintService = new ComplaintServiceImpl(complaintRepository1, userRepository1, complaintMapper1, fileStorageService1, aiService1);
    }

    /**
     * UT-CS-01: getAllComplaints — Returns List
     * Verifies that getAllComplaints returns a list (even if empty).
     */
    @Test
    @DisplayName("UT-CS-01: getAllComplaints returns list from repository")
    void testGetAllComplaints_ReturnsListFromRepository() {
        when(complaintRepository1.findComplaintsFiltered(null, null, null))
                .thenReturn(List.of(complaint));
        // Using real mapper, no mocking needed

        List<ComplaintResponseDTO> results = complaintService.getAllComplaints(null, null);

        assertNotNull(results);
        assertEquals(1, results.size());
        verify(complaintRepository1, times(1)).findComplaintsFiltered(null, null, null);
    }

    /**
     * UT-CS-02: getAllComplaints — Empty List
     * Verifies that an empty database returns an empty list (not null, not exception).
     */
    @Test
    @DisplayName("UT-CS-02: getAllComplaints returns empty list when no complaints exist")
    void testGetAllComplaints_NoneExist_ReturnsEmptyList() {
        when(complaintRepository1.findComplaintsFiltered(null, null, null)).thenReturn(List.of());

        List<ComplaintResponseDTO> results = complaintService.getAllComplaints(null, null);

        assertNotNull(results);
        assertTrue(results.isEmpty(), "Result should be empty but was: " + results.size());
    }

    /**
     * UT-CS-03: getComplaintById — Existing ID
     * Verifies correct complaint is returned for a valid ID.
     */
    @Test
    @DisplayName("UT-CS-03: getComplaintById returns complaint for valid ID")
    void testGetComplaintById_ValidId_ReturnsComplaint() {
        ComplaintResponseDTO expectedResponse = new ComplaintResponseDTO();
        when(complaintRepository1.findById(10L)).thenReturn(Optional.of(complaint));
        // Using real mapper, no mocking needed

        ComplaintResponseDTO result = complaintService.getComplaintById(10L);

        assertNotNull(result);
        verify(complaintRepository1, times(1)).findById(10L);
    }

    /**
     * UT-CS-04: getComplaintById — Non-Existent ID
     * Verifies ResourceNotFoundException is thrown for an ID that doesn't exist.
     */
    @Test
    @DisplayName("UT-CS-04: getComplaintById throws ResourceNotFoundException for invalid ID")
    void testGetComplaintById_InvalidId_ThrowsResourceNotFoundException() {
        when(complaintRepository1.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> complaintService.getComplaintById(999L),
                "Should throw ResourceNotFoundException for non-existent complaint ID");
    }

    /**
     * UT-CS-05: deleteComplaint — Owner Can Delete Own Complaint
     * Verifies that the original creator can successfully delete their complaint.
     */
    @Test
    @DisplayName("UT-CS-05: deleteComplaint succeeds for complaint owner")
    void testDeleteComplaint_ByOwner_Succeeds() {
        when(complaintRepository1.findById(10L)).thenReturn(Optional.of(complaint));

        assertDoesNotThrow(() -> complaintService.deleteComplaint(10L));
        verify(complaintRepository1, times(1)).delete(complaint);
    }

    /**
     * UT-CS-06: deleteComplaint — Non-Owner Cannot Delete (Authorization)
     * Verifies that a different citizen cannot delete someone else's complaint.
     */
    @Test
    @DisplayName("UT-CS-06: deleteComplaint throws InvalidOperationException for non-owner")
    void testDeleteComplaint_ByNonOwner_ThrowsInvalidOperationException() {
        // Switch security context to otherUser
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn(otherUser.getEmail());
        SecurityContextHolder.setContext(ctx);
        when(userRepository1.findByEmail(otherUser.getEmail())).thenReturn(Optional.of(otherUser));

        when(complaintRepository1.findById(10L)).thenReturn(Optional.of(complaint));

        assertThrows(InvalidOperationException.class, () -> complaintService.deleteComplaint(10L),
                "Non-owner should not be able to delete the complaint");
        verify(complaintRepository1, never()).delete(any());
    }

    /**
     * UT-CS-07: deleteComplaint — Admin Can Delete Any Complaint
     * Verifies that an ADMIN can delete a complaint regardless of ownership.
     */
    @Test
    @DisplayName("UT-CS-07: deleteComplaint succeeds for ADMIN user on any complaint")
    void testDeleteComplaint_ByAdmin_Succeeds() {
        // Switch security context to admin
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn(adminUser.getEmail());
        SecurityContextHolder.setContext(ctx);
        when(userRepository1.findByEmail(adminUser.getEmail())).thenReturn(Optional.of(adminUser));

        when(complaintRepository1.findById(10L)).thenReturn(Optional.of(complaint));

        assertDoesNotThrow(() -> complaintService.deleteComplaint(10L));
        verify(complaintRepository1, times(1)).delete(complaint);
    }
}
