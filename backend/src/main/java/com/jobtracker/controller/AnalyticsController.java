package com.jobtracker.controller;

import com.jobtracker.dto.AnalyticsResponseDto;
import com.jobtracker.entity.User;
import com.jobtracker.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public AnalyticsResponseDto getAnalytics(@AuthenticationPrincipal User user) {
        return analyticsService.getAnalytics(user);
    }
}
