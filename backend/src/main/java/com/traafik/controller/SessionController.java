package com.traafik.controller;

import com.traafik.dto.session.CreateSessionRequest;
import com.traafik.dto.session.SessionResponse;
import com.traafik.dto.session.UpdateSessionStatusRequest;
import com.traafik.entity.Session;
import com.traafik.service.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
@Tag(name = "Sessions", description = "Traffic stop session management")
public class SessionController {

    private final SessionService sessionService;

    @Operation(summary = "Create a new traffic stop session")
    @PostMapping
    @PreAuthorize("hasRole('DRIVER') or hasRole('OFFICER')")
    public ResponseEntity<SessionResponse> createSession(@Valid @RequestBody CreateSessionRequest request) {
        SessionResponse session = sessionService.createSession(request);
        return ResponseEntity.ok(session);
    }

    @Operation(summary = "Get session by ID")
    @GetMapping("/{sessionId}")
    @PreAuthorize("@sessionService.hasAccessToSession(#sessionId, authentication.name)")
    public ResponseEntity<SessionResponse> getSession(@PathVariable UUID sessionId) {
        SessionResponse session = sessionService.getSessionById(sessionId);
        return ResponseEntity.ok(session);
    }

    @Operation(summary = "Get current user's sessions")
    @GetMapping("/my")
    public ResponseEntity<Page<SessionResponse>> getMySessions(Pageable pageable) {
        Page<SessionResponse> sessions = sessionService.getCurrentUserSessions(pageable);
        return ResponseEntity.ok(sessions);
    }

    @Operation(summary = "Get all active sessions for officers")
    @GetMapping("/active")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Page<SessionResponse>> getActiveSessions(Pageable pageable) {
        Page<SessionResponse> sessions = sessionService.getActiveSessions(pageable);
        return ResponseEntity.ok(sessions);
    }

    @Operation(summary = "Update session status")
    @PutMapping("/{sessionId}/status")
    @PreAuthorize("hasRole('OFFICER') or @sessionService.hasAccessToSession(#sessionId, authentication.name)")
    public ResponseEntity<SessionResponse> updateSessionStatus(
            @PathVariable UUID sessionId,
            @Valid @RequestBody UpdateSessionStatusRequest request) {
        SessionResponse session = sessionService.updateSessionStatus(sessionId, request);
        return ResponseEntity.ok(session);
    }

    @Operation(summary = "Assign officer to session")
    @PutMapping("/{sessionId}/assign")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<SessionResponse> assignOfficer(@PathVariable UUID sessionId) {
        SessionResponse session = sessionService.assignOfficerToSession(sessionId);
        return ResponseEntity.ok(session);
    }

    @Operation(summary = "Cancel session")
    @DeleteMapping("/{sessionId}")
    @PreAuthorize("@sessionService.hasAccessToSession(#sessionId, authentication.name)")
    public ResponseEntity<Void> cancelSession(@PathVariable UUID sessionId) {
        sessionService.cancelSession(sessionId);
        return ResponseEntity.ok().build();
    }
}