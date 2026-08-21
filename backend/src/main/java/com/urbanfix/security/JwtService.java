package com.urbanfix.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import java.util.function.Function;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    // Secret key used to sign and verify JWTs
    private static final String SECRET_KEY =
            "mySuperSecretKeyForUrbanFixJwtAuthentication123456789";

    // Token validity (24 hours)
    private static final long JWT_EXPIRATION = 1000 * 60 * 60 * 24;

    // Generate a JWT for the authenticated user
    public String generateToken(UserDetails userDetails) {

        return Jwts.builder()
                            // User's email
                            .subject(userDetails.getUsername())
                            // Token creation time
                            .issuedAt(new Date())
                            // Expiry time
                            .expiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                            // Sign the token
                            .signWith(getSigningKey())

                            .compact();
    }

    // Create signing key from secret
    private SecretKey getSigningKey() 
    {           return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Extract all claims from the JWT
    // Throws: ExpiredJwtException (if token expired), SignatureException / MalformedJwtException (if tampered/invalid)
    private Claims extractAllClaims(String token) 
        {
            return Jwts.parser()
                            .verifyWith(getSigningKey())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();
        }
    // Extract any claim using a resolver function
    public <T> T extractClaim( String token,Function<Claims, T> claimsResolver) 
        {
            Claims claims = extractAllClaims(token);
            return claimsResolver.apply(claims);
        }
    
    // Extract email stored in JWT
    public String extractUsername(String token) 
        {
            return extractClaim(token,Claims::getSubject);
        }
    // Extract token expiration time
    public Date extractExpiration(String token) 
        {
            return extractClaim(token,Claims::getExpiration);
        }
    
    // Check whether the token has expired
    public  boolean isTokenExpired(String token) 
        {
            return extractExpiration(token).before(new Date());
        }

   
}