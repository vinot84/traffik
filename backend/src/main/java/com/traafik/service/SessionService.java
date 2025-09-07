package com.traafik.service;

import com.traafik.dto.session.CreateSessionRequest;
import com.traafik.dto.session.SessionResponse;
import com.traafik.dto.session.UpdateSessionStatusRequest;
import com.traafik.entity.Session;
import com.traafik.entity.User;
import com.traafik.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserService userService;

    @Transactional
    public SessionResponse createSession(CreateSessionRequest request) {
        User currentUser = getCurrentUser();
        
        Session session = new Session();
        session.setDriver(currentUser);
        session.setStatus(Session.Status.CREATED);
        // session.setLocation(request.getLocation()); // Would need to convert from DTO
        session.setAddress(request.getAddress());
        session.setReason(request.getReason());

        Session savedSession = sessionRepository.save(session);
        return convertToResponse(savedSession);
    }

    @Transactional(readOnly = true)
    public SessionResponse getSessionById(UUID sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        return convertToResponse(session);
    }

    @Transactional(readOnly = true)
    public Page<SessionResponse> getCurrentUserSessions(Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Session> sessions = sessionRepository.findByDriverOrderByCreatedAtDesc(currentUser, pageable);
        return sessions.map(this::convertToResponse);
    }

    @Transactional(readOnly = true)
    public Page<SessionResponse> getActiveSessions(Pageable pageable) {
        Page<Session> sessions = sessionRepository.findByStatusInOrderByCreatedAtDesc(
                java.util.List.of(Session.Status.CREATED, Session.Status.ASSIGNED, Session.Status.VERIFIED),
                pageable
        );
        return sessions.map(this::convertToResponse);
    }

    @Transactional
    public SessionResponse updateSessionStatus(UUID sessionId, UpdateSessionStatusRequest request) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        User currentUser = getCurrentUser();
        session.changeStatus(request.getStatus(), currentUser, request.getReason());
        
        Session savedSession = sessionRepository.save(session);
        return convertToResponse(savedSession);
    }

    @Transactional
    public SessionResponse assignOfficerToSession(UUID sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != User.Role.OFFICER) {
            throw new RuntimeException("Only officers can assign themselves to sessions");
        }

        session.setOfficer(currentUser);
        session.changeStatus(Session.Status.ASSIGNED, currentUser, "Officer assigned to session");
        
        Session savedSession = sessionRepository.save(session);
        return convertToResponse(savedSession);
    }

    @Transactional
    public void cancelSession(UUID sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        User currentUser = getCurrentUser();
        session.changeStatus(Session.Status.CANCELLED, currentUser, "Session cancelled by user");
        
        sessionRepository.save(session);
    }

    public boolean hasAccessToSession(UUID sessionId, String userEmail) {
        User user = userService.findByEmail(userEmail);
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        return session.getDriver().equals(user) || 
               (session.getOfficer() != null && session.getOfficer().equals(user)) ||
               user.getRole() == User.Role.ADMIN;
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private SessionResponse convertToResponse(Session session) {
        SessionResponse response = new SessionResponse();
        response.setId(session.getId());
        response.setStatus(session.getStatus());
        response.setAddress(session.getAddress());
        response.setReason(session.getReason());
        response.setNotes(session.getNotes());
        response.setCreatedAt(session.getCreatedAt());
        response.setStartedAt(session.getStartedAt());
        response.setCompletedAt(session.getCompletedAt());
        
        if (session.getDriver() != null) {
            response.setDriverName(session.getDriver().getProfile().getFullName());
        }
        
        if (session.getOfficer() != null) {
            response.setOfficerName(session.getOfficer().getProfile().getFullName());
        }
        
        return response;
    }
}