package com.tus2026.backend.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tus2026.backend.Models.Task;
import com.tus2026.backend.agents.TaskBreakdownAgent;
import com.tus2026.backend.dto.EpicRequestDto;

@RestController
@RequestMapping("/agents/tasks")
public class TaskGenerationController {

    private final TaskBreakdownAgent taskBreakdownAgent;

    public TaskGenerationController(TaskBreakdownAgent taskBreakdownAgent) {
        this.taskBreakdownAgent = taskBreakdownAgent;
    }

    /**
     * POST /api/agents/tasks/generate
     *
     * Request body:
     * {
     * "EpicDescription": "Add Google OAuth login to the application"
     * }
     *
     * Response: List of generated and saved Task objects
     */
    @PostMapping("/generate")
    public ResponseEntity<List<Task>> generateTasksForEpic(
            @Valid @RequestBody EpicRequestDto request) {

        List<Task> generatedTasks = taskBreakdownAgent
                .generateTasksForEpic(request.getEpicDescription());

        return ResponseEntity.ok(generatedTasks);
    }
}
