package com.minierp.service;

import com.minierp.dto.LoginRequest;
import com.minierp.dto.LoginResponse;
import com.minierp.security.JwtService;
import com.minierp.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        UserPrincipal principal = (UserPrincipal) authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()))
                .getPrincipal();

        String role = principal.getUser().getRole().getNombre().name();
        String token = jwtService.generateToken(principal, role);
        return LoginResponse.builder()
                .token(token)
                .username(principal.getUsername())
                .role(role)
                .build();
    }
}
