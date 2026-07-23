package com.jobtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponseDto {
    private long totalApplications;
    private Map<String, Long> countByStatus;
    private double interviewConversionRate;   // % of applications that reached INTERVIEW or beyond
    private double offerConversionRate;       // % of applications that reached OFFER
    private Double averageDaysToFirstInterview;
    private Map<String, Long> applicationsPerWeek; // key = ISO week start date
}
