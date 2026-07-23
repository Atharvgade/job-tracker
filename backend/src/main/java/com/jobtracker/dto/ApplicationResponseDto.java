package com.jobtracker.dto;

import com.jobtracker.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDto {
    private Long id;
    private String companyName;
    private String roleTitle;
    private ApplicationStatus status;
    private LocalDate appliedDate;
    private LocalDate deadline;
    private String notes;
    private String jobPostingUrl;
    private String attachmentPath;
    private List<InterviewRoundDto> interviewRounds;
    private Instant createdAt;
    private Instant updatedAt;
}
