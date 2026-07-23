package com.jobtracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_rounds")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @JsonIgnore
    private JobApplication application;

    /** e.g. "Phone Screen", "Technical Round 1", "System Design", "HR" */
    private String roundName;

    private LocalDateTime scheduledAt;

    @Column(length = 1000)
    private String feedback;

    @Builder.Default
    private boolean completed = false;
}
