package com.traafik.repository;

import com.traafik.entity.Session;
import com.traafik.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {

    Page<Session> findByDriverOrderByCreatedAtDesc(User driver, Pageable pageable);

    Page<Session> findByOfficerOrderByCreatedAtDesc(User officer, Pageable pageable);

    Page<Session> findByStatusInOrderByCreatedAtDesc(List<Session.Status> statuses, Pageable pageable);

    @Query("SELECT s FROM Session s WHERE s.status = :status AND s.officer IS NULL ORDER BY s.createdAt ASC")
    Page<Session> findUnassignedSessionsByStatus(Session.Status status, Pageable pageable);

    List<Session> findByDriverAndStatusIn(User driver, List<Session.Status> statuses);
}