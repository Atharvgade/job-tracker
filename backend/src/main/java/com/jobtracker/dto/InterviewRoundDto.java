package com.jobtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRoundDto {
    private Long id;
    private String roundName;
    private LocalDateTime scheduledAt;
    private String feedback;
    private boolean completed;
}
