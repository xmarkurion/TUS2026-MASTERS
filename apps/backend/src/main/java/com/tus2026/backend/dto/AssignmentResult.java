package com.tus2026.backend.dto;

public record AssignmentResult(
        String taskId,
        String taskName,
        String assigneeId,
        String assigneeName,
        String reasonForAssignment,
        boolean overCapacity
) {}
