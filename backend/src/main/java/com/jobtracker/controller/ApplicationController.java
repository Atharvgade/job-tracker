package com.jobtracker.controller;

import com.jobtracker.dto.ApplicationRequestDto;
import com.jobtracker.dto.ApplicationResponseDto;
import com.jobtracker.dto.InterviewRoundDto;
import com.jobtracker.dto.StatusUpdateRequest;
import com.jobtracker.entity.User;
import com.jobtracker.service.ApplicationService;
import com.jobtracker.service.InterviewRoundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final InterviewRoundService interviewRoundService;

    @PostMapping
    public ResponseEntity<ApplicationResponseDto> create(@AuthenticationPrincipal User user,
                                                           @Valid @RequestBody ApplicationRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.create(user, dto));
    }

    @GetMapping
    public ResponseEntity<Page<ApplicationResponseDto>> findAll(@AuthenticationPrincipal User user,
                                                                  @PageableDefault(size = 50) Pageable pageable) {
        return ResponseEntity.ok(applicationService.findAll(user, pageable));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ApplicationResponseDto>> findAllUnpaged(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.findAllUnpaged(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponseDto> findById(@AuthenticationPrincipal User user,
                                                            @PathVariable Long id) {
        return ResponseEntity.ok(applicationService.findById(user, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponseDto> update(@AuthenticationPrincipal User user,
                                                          @PathVariable Long id,
                                                          @Valid @RequestBody ApplicationRequestDto dto) {
        return ResponseEntity.ok(applicationService.update(user, id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponseDto> updateStatus(@AuthenticationPrincipal User user,
                                                                @PathVariable Long id,
                                                                @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateStatus(user, id, request.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user, @PathVariable Long id) {
        applicationService.delete(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/interview-rounds")
    public ResponseEntity<InterviewRoundDto> addRound(@AuthenticationPrincipal User user,
                                                       @PathVariable Long id,
                                                       @RequestBody InterviewRoundDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(interviewRoundService.addRound(user, id, dto));
    }

    @PutMapping("/{id}/interview-rounds/{roundId}")
    public ResponseEntity<InterviewRoundDto> updateRound(@AuthenticationPrincipal User user,
                                                          @PathVariable Long id,
                                                          @PathVariable Long roundId,
                                                          @RequestBody InterviewRoundDto dto) {
        return ResponseEntity.ok(interviewRoundService.updateRound(user, id, roundId, dto));
    }
}
