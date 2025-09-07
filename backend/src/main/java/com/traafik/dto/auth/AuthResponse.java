package com.traafik.dto.auth;

import com.traafik.entity.User;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserInfo user;

    @Data
    public static class UserInfo {
        private UUID id;
        private String email;
        private User.Role role;
        private String firstName;
        private String lastName;
        private String phone;
        private String kycStatus;
        private Instant createdAt;
    }
}