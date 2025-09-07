package com.traafik.service;

import com.traafik.dto.auth.AuthResponse;
import com.traafik.dto.auth.LoginRequest;
import com.traafik.dto.auth.RegisterRequest;
import com.traafik.entity.User;
import com.traafik.entity.UserProfile;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.cookie-name}")
    private String cookieName;

    @Value("${app.security.cookie-max-age}")
    private int cookieMaxAge;

    @Value("${app.jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        UserProfile profile = new UserProfile();
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhone(request.getPhone());
        profile.setUser(user);
        user.setProfile(profile);

        User savedUser = userService.save(user);

        String accessToken = jwtService.generateToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);

        setAuthCookie(response, accessToken);

        return buildAuthResponse(savedUser, accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse authenticate(LoginRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userService.findByEmail(request.getEmail());
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        setAuthCookie(response, accessToken);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    public AuthResponse refreshToken(String refreshToken, HttpServletResponse response) {
        String userEmail = jwtService.extractUsername(refreshToken);
        User user = userService.findByEmail(userEmail);

        if (jwtService.isTokenValid(refreshToken, user)) {
            String accessToken = jwtService.generateToken(user);
            String newRefreshToken = jwtService.generateRefreshToken(user);

            setAuthCookie(response, accessToken);

            return buildAuthResponse(user, accessToken, newRefreshToken);
        }

        throw new RuntimeException("Invalid refresh token");
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // Clear cookie
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        SecurityContextHolder.clearContext();
    }

    public AuthResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return buildAuthResponse(user, null, null);
    }

    private void setAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Set to true in production with HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(cookieMaxAge);
        response.addCookie(cookie);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setExpiresIn(accessTokenExpiration / 1000); // Convert to seconds

        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setEmail(user.getEmail());
        userInfo.setRole(user.getRole());
        userInfo.setCreatedAt(user.getCreatedAt());

        if (user.getProfile() != null) {
            userInfo.setFirstName(user.getProfile().getFirstName());
            userInfo.setLastName(user.getProfile().getLastName());
            userInfo.setPhone(user.getProfile().getPhone());
            userInfo.setKycStatus(user.getProfile().getKycStatus().toString());
        }

        response.setUser(userInfo);
        return response;
    }
}