package com.urbanfix.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.security.core.Authentication;

import java.io.IOException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService1;
    private final CustomUserDetailsService customUserDetailsService1;

    // Throws: ServletException, IOException (on filter chain error)
    // Throws: JwtException (if token invalid/tampered), UsernameNotFoundException (if user email not in DB)
    @Override
    protected void doFilterInternal( HttpServletRequest request,HttpServletResponse response,FilterChain filterChain)
            throws ServletException, IOException 
            {
                // Read the Authorization header
                String authHeader = request.getHeader("Authorization");

                // If no JWT is present, continue to the next filter
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {

                    filterChain.doFilter(request, response);
                    return;
                }

                // Extract the JWT by removing "Bearer "
                String jwt = authHeader.substring(7);
                // Extract email from the JWT
                String email = jwtService1.extractUsername(jwt);
                // Authenticate only if no user is currently authenticated
                if (email != null &&SecurityContextHolder.getContext().getAuthentication() == null)
                    {
                        // Validate the JWT expiry date 
                        if (!jwtService1.isTokenExpired(jwt))
                            {       
                                //now query the data base  Load the user's details from the database
                                //if E-mail not found, it automatically throws UsernameNotFoundException and reject the request.
                                UserDetails userDetailOBJ =customUserDetailsService1.loadUserByUsername(email);
                                // Create an Authentication object
                                UsernamePasswordAuthenticationToken authentication =
                                                     new UsernamePasswordAuthenticationToken(userDetailOBJ,null,userDetailOBJ.getAuthorities());

                                // Attach request-specific details
                                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                                // Store the authenticated user in the SecurityContext
                                SecurityContextHolder.getContext().setAuthentication(authentication);

                                //////////                               
                                        // System.out.println("Authorities: " +
                                        //         SecurityContextHolder.getContext()
                                        //                 .getAuthentication()
                                        //                 .getAuthorities());

                                        // System.out.println("Username: " +
                                        //         SecurityContextHolder.getContext()
                                        //                 .getAuthentication()
                                        //                 .getName());
                            }
                    }

                // Continue processing the request
                filterChain.doFilter(request, response);
                
            }
}