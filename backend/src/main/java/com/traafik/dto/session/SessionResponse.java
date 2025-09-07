package com.traafik.dto.session;

import com.traafik.entity.Session;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class SessionResponse {
    private UUID id;
    private Session.Status status;
    private String address;
    private String reason;
    private String notes;
    private String driverName;
    private String officerName;
    private Instant createdAt;
    private Instant startedAt;
    private Instant completedAt;
}