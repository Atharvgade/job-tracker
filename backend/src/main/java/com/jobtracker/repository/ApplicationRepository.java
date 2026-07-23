package com.jobtracker.repository;

import com.jobtracker.entity.ApplicationStatus;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<JobApplication, Long> {

    Page<JobApplication> findByUser(User user, Pageable pageable);

    List<JobApplication> findByUser(User user);

    @Query("""
        SELECT DISTINCT a
        FROM JobApplication a
        LEFT JOIN FETCH a.interviewRounds
        WHERE a.user = :user
    """)
    List<JobApplication> findByUserWithRounds(@Param("user") User user);

    Optional<JobApplication> findByIdAndUser(Long id, User user);

    long countByUserAndStatus(User user, ApplicationStatus status);

    long countByUser(User user);

    @Query("select a from JobApplication a where a.user = :user and a.createdAt >= :since")
    List<JobApplication> findByUserSince(@Param("user") User user, @Param("since") Instant since);
}