package com.traafik.controller;

import com.traafik.dto.auth.AuthResponse;
import com.traafik.dto.auth.LoginRequest;
import com.traafik.dto.auth.RefreshTokenRequest;
import com.traafik.dto.auth.RegisterRequest;
import com.traafik.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management endpoints")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request, response);
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "Authenticate user and return JWT token")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.authenticate(request, response);
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "Refresh JWT token using refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.refreshToken(request.getRefreshToken(), response);
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "Logout user and invalidate tokens")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get current user information")
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        AuthResponse currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(currentUser);
    }
}