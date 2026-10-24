package com.urbanfix.unit;

import com.urbanfix.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ==============================================================================
 * WHITE-BOX UNIT TESTS: JwtService
 * Category: Unit Testing (White-box)
 * Tests: Token generation, username extraction, expiry logic, tamper detection.
 * Test IDs: UT-JWT-01 through UT-JWT-06
 * ==============================================================================
 */
@DisplayName("UT: JwtService — Token Lifecycle Tests")
class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails validUser;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        validUser = new User("citizen@urbanfix.test", "hashedpassword", Collections.emptyList());
    }

    /**
     * UT-JWT-01: Token Generation — Valid User
     * Verifies that generateToken() returns a non-null, non-empty JWT string.
     */
    @Test
    @DisplayName("UT-JWT-01: generateToken returns non-null JWT for valid user")
    void testGenerateToken_ValidUser_ReturnsNonNullToken() {
        String token = jwtService.generateToken(validUser);

        assertNotNull(token, "Token should not be null");
        assertFalse(token.isBlank(), "Token should not be blank");
        assertTrue(token.split("\\.").length == 3, "JWT must have 3 parts separated by dots");
    }

    /**
     * UT-JWT-02: Username Extraction — Correct Subject
     * Verifies that the email embedded in the token matches the original user.
     */
    @Test
    @DisplayName("UT-JWT-02: extractUsername returns correct email from token")
    void testExtractUsername_ReturnsCorrectEmail() {
        String token = jwtService.generateToken(validUser);
        String extractedEmail = jwtService.extractUsername(token);

        assertEquals("citizen@urbanfix.test", extractedEmail,
                "Extracted email must match the original user email");
    }

    /**
     * UT-JWT-03: Token Expiry — Fresh Token Is Not Expired
     * Verifies that a newly generated token has a future expiry date.
     */
    @Test
    @DisplayName("UT-JWT-03: freshly generated token is not expired")
    void testIsTokenExpired_FreshToken_ReturnsFalse() {
        String token = jwtService.generateToken(validUser);
        boolean expired = jwtService.isTokenExpired(token);

        assertFalse(expired, "Freshly generated token must NOT be expired");
    }

    /**
     * UT-JWT-04: Expiry Date — Set to ~24 Hours in the Future
     * Verifies that the expiration date is roughly 24 hours from now.
     */
    @Test
    @DisplayName("UT-JWT-04: token expiry is approximately 24 hours from now")
    void testExtractExpiration_IsApproximately24HoursFromNow() {
        String token = jwtService.generateToken(validUser);
        Date expiry = jwtService.extractExpiration(token);

        long nowMs = System.currentTimeMillis();
        long expiryMs = expiry.getTime();
        long differenceHours = (expiryMs - nowMs) / (1000 * 60 * 60);

        assertTrue(differenceHours >= 23 && differenceHours <= 25,
                "Token expiry should be approximately 24 hours from now, but was: " + differenceHours + "h");
    }

    /**
     * UT-JWT-05: Tampered Token — extractUsername Throws Exception
     * Verifies that a tampered (invalid signature) token is rejected.
     */
    @Test
    @DisplayName("UT-JWT-05: tampered token throws exception on parse")
    void testExtractUsername_TamperedToken_ThrowsException() {
        String token = jwtService.generateToken(validUser);
        String tamperedToken = token.substring(0, token.lastIndexOf('.') + 1) + "INVALIDSIGNATURE";

        assertThrows(Exception.class, () -> jwtService.extractUsername(tamperedToken),
                "Tampered token should throw an exception");
    }

    /**
     * UT-JWT-06: Malformed Token — Completely Invalid String
     * Verifies that a completely invalid JWT string is rejected.
     */
    @Test
    @DisplayName("UT-JWT-06: completely malformed token throws exception")
    void testExtractUsername_MalformedToken_ThrowsException() {
        assertThrows(Exception.class, () -> jwtService.extractUsername("not.a.valid.jwt.token"),
                "Malformed JWT should throw an exception");
    }
}
