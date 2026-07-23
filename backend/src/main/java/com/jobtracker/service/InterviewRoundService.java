package com.jobtracker.service;

import com.jobtracker.dto.InterviewRoundDto;
import com.jobtracker.entity.InterviewRound;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.User;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.repository.ApplicationRepository;
import com.jobtracker.repository.InterviewRoundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class InterviewRoundService {

    private final InterviewRoundRepository interviewRoundRepository;
    private final ApplicationRepository applicationRepository;

    public InterviewRoundDto addRound(User user, Long applicationId, InterviewRoundDto dto) {
        JobApplication application = applicationRepository.findByIdAndUser(applicationId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        InterviewRound round = InterviewRound.builder()
                .application(application)
                .roundName(dto.getRoundName())
                .scheduledAt(dto.getScheduledAt())
                .feedback(dto.getFeedback())
                .completed(dto.isCompleted())
                .build();

        InterviewRound saved = interviewRoundRepository.save(round);
        return toDto(saved);
    }

    public InterviewRoundDto updateRound(User user, Long applicationId, Long roundId, InterviewRoundDto dto) {
        JobApplication application = applicationRepository.findByIdAndUser(applicationId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        InterviewRound round = interviewRoundRepository.findById(roundId)
                .filter(r -> r.getApplication().getId().equals(application.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Interview round not found with id: " + roundId));

        round.setRoundName(dto.getRoundName());
        round.setScheduledAt(dto.getScheduledAt());
        round.setFeedback(dto.getFeedback());
        round.setCompleted(dto.isCompleted());

        return toDto(interviewRoundRepository.save(round));
    }

    private InterviewRoundDto toDto(InterviewRound r) {
        return InterviewRoundDto.builder()
                .id(r.getId())
                .roundName(r.getRoundName())
                .scheduledAt(r.getScheduledAt())
                .feedback(r.getFeedback())
                .completed(r.isCompleted())
                .build();
    }
}
