package com.jobtracker.repository;

import com.jobtracker.entity.InterviewRound;
import com.jobtracker.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRoundRepository extends JpaRepository<InterviewRound, Long> {
    List<InterviewRound> findByApplication(JobApplication application);
}
