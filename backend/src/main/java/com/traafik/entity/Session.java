package com.traafik.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.locationtech.jts.geom.Point;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "sessions")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class Session {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officer_id")
    private User officer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.CREATED;

    @Column(columnDefinition = "geometry(Point,4326)", nullable = false)
    private Point location;

    private String address;

    private String reason;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "assigned_at")
    private Instant assignedAt;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Citation> citations = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SessionStateTransition> stateTransitions = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    public enum Status {
        CREATED, ASSIGNED, VERIFIED, REASONS_SELECTED, COMPLETED, CANCELLED
    }

    public void changeStatus(Status newStatus, User triggeredBy, String reason) {
        Status oldStatus = this.status;
        this.status = newStatus;
        
        SessionStateTransition transition = new SessionStateTransition();
        transition.setSession(this);
        transition.setFromState(oldStatus);
        transition.setToState(newStatus);
        transition.setTriggeredBy(triggeredBy);
        transition.setReason(reason);
        
        this.stateTransitions.add(transition);
        
        // Update timestamps based on status
        Instant now = Instant.now();
        switch (newStatus) {
            case ASSIGNED -> this.assignedAt = now;
            case VERIFIED -> this.verifiedAt = now;
            case COMPLETED, CANCELLED -> this.completedAt = now;
        }
    }
}