package com.jobtracker.service;

import com.jobtracker.dto.AnalyticsResponseDto;
import com.jobtracker.entity.ApplicationStatus;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.User;
import com.jobtracker.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final ApplicationRepository applicationRepository;

    public AnalyticsResponseDto getAnalytics(User user) {
        List<JobApplication> applications = applicationRepository.findByUserWithInterviewRounds(user);
        long total = applications.size();

        Map<String, Long> countByStatus = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            countByStatus.put(status.name(), applications.stream()
                    .filter(a -> a.getStatus() == status)
                    .count());
        }

        long reachedInterview = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.INTERVIEW || a.getStatus() == ApplicationStatus.OFFER)
                .count();
        long reachedOffer = countByStatus.getOrDefault(ApplicationStatus.OFFER.name(), 0L);

        double interviewConversionRate = total == 0 ? 0.0 : round((reachedInterview * 100.0) / total);
        double offerConversionRate = total == 0 ? 0.0 : round((reachedOffer * 100.0) / total);

        Double avgDaysToInterview = applications.stream()
                .filter(a -> !a.getInterviewRounds().isEmpty() && a.getAppliedDate() != null)
                .map(a -> {
                    LocalDate firstRound = a.getInterviewRounds().stream()
                            .filter(r -> r.getScheduledAt() != null)
                            .map(r -> r.getScheduledAt().toLocalDate())
                            .min(Comparator.naturalOrder())
                            .orElse(null);
                    if (firstRound == null) return null;
                    return (double) java.time.temporal.ChronoUnit.DAYS.between(a.getAppliedDate(), firstRound);
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.averagingDouble(Double::doubleValue));

        if (avgDaysToInterview.isNaN()) avgDaysToInterview = null;

        Map<String, Long> perWeek = applications.stream()
                .filter(a -> a.getAppliedDate() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getAppliedDate()
                                .with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY))
                                .toString(),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        return AnalyticsResponseDto.builder()
                .totalApplications(total)
                .countByStatus(countByStatus)
                .interviewConversionRate(interviewConversionRate)
                .offerConversionRate(offerConversionRate)
                .averageDaysToFirstInterview(avgDaysToInterview)
                .applicationsPerWeek(perWeek)
                .build();
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}