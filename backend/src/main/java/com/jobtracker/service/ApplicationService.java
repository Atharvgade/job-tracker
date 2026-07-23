package com.jobtracker.service;

import com.jobtracker.dto.ApplicationRequestDto;
import com.jobtracker.dto.ApplicationResponseDto;
import com.jobtracker.dto.InterviewRoundDto;
import com.jobtracker.entity.ApplicationStatus;
import com.jobtracker.entity.JobApplication;
import com.jobtracker.entity.User;
import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationResponseDto create(User user, ApplicationRequestDto dto) {
        JobApplication application = JobApplication.builder()
                .user(user)
                .companyName(dto.getCompanyName())
                .roleTitle(dto.getRoleTitle())
                .status(dto.getStatus() != null ? dto.getStatus() : ApplicationStatus.APPLIED)
                .appliedDate(dto.getAppliedDate() != null ? dto.getAppliedDate() : LocalDate.now())
                .deadline(dto.getDeadline())
                .notes(dto.getNotes())
                .jobPostingUrl(dto.getJobPostingUrl())
                .build();

        return toDto(applicationRepository.save(application));
    }

    public Page<ApplicationResponseDto> findAll(User user, Pageable pageable) {
        return applicationRepository.findByUser(user, pageable).map(this::toDto);
    }

    public List<ApplicationResponseDto> findAllUnpaged(User user) {
        return applicationRepository.findByUser(user).stream().map(this::toDto).toList();
    }

    public ApplicationResponseDto findById(User user, Long id) {
        return toDto(getOwnedOrThrow(user, id));
    }

    public ApplicationResponseDto update(User user, Long id, ApplicationRequestDto dto) {
        JobApplication application = getOwnedOrThrow(user, id);

        application.setCompanyName(dto.getCompanyName());
        application.setRoleTitle(dto.getRoleTitle());
        if (dto.getStatus() != null) application.setStatus(dto.getStatus());
        application.setAppliedDate(dto.getAppliedDate());
        application.setDeadline(dto.getDeadline());
        application.setNotes(dto.getNotes());
        application.setJobPostingUrl(dto.getJobPostingUrl());

        return toDto(applicationRepository.save(application));
    }

    public ApplicationResponseDto updateStatus(User user, Long id, ApplicationStatus status) {
        JobApplication application = getOwnedOrThrow(user, id);
        application.setStatus(status);
        return toDto(applicationRepository.save(application));
    }

    public void delete(User user, Long id) {
        JobApplication application = getOwnedOrThrow(user, id);
        applicationRepository.delete(application);
    }

    public ApplicationResponseDto attachFile(User user, Long id, String storedPath) {
        JobApplication application = getOwnedOrThrow(user, id);
        application.setAttachmentPath(storedPath);
        return toDto(applicationRepository.save(application));
    }

    private JobApplication getOwnedOrThrow(User user, Long id) {
        return applicationRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }

    private ApplicationResponseDto toDto(JobApplication a) {
        List<InterviewRoundDto> rounds = a.getInterviewRounds().stream()
                .map(r -> InterviewRoundDto.builder()
                        .id(r.getId())
                        .roundName(r.getRoundName())
                        .scheduledAt(r.getScheduledAt())
                        .feedback(r.getFeedback())
                        .completed(r.isCompleted())
                        .build())
                .toList();

        return ApplicationResponseDto.builder()
                .id(a.getId())
                .companyName(a.getCompanyName())
                .roleTitle(a.getRoleTitle())
                .status(a.getStatus())
                .appliedDate(a.getAppliedDate())
                .deadline(a.getDeadline())
                .notes(a.getNotes())
                .jobPostingUrl(a.getJobPostingUrl())
                .attachmentPath(a.getAttachmentPath())
                .interviewRounds(rounds)
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}
