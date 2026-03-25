package com.tus2026.backend.controller;

import com.tus2026.backend.agents.TaskAssignmentAgent;
import com.tus2026.backend.dto.AssignmentResult;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/agents/tasks")
public class TaskAssignmentController {

    private final TaskAssignmentAgent taskAssignmentAgent;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    public TaskAssignmentController(TaskAssignmentAgent taskAssignmentAgent) {
        this.taskAssignmentAgent = taskAssignmentAgent;
    }

    /**
     * POST /agents/tasks/assign/stream
     *
     * Streams assignment results as Server-Sent Events, one batch at a time.
     * SSE event types:
     *   batch   → JSON array of AssignmentResult for that turn
     *   warning → string (no assignments made, or no capacity left)
     *   done    → "All tasks assigned."
     */
    @PostMapping(value = "/assign/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamAssignments() {
        SseEmitter emitter = new SseEmitter(0L);
        executor.submit(() -> taskAssignmentAgent.streamAssignments(emitter));
        return emitter;
    }

    /**
     * POST /agents/tasks/assign/{taskId}
     *
     * Assigns a single task. Returns 409 if no member has sufficient capacity.
     */
    @PostMapping("/assign/{taskId}")
    public ResponseEntity<?> assignSingleTask(@PathVariable String taskId) {
        try {
            AssignmentResult result = taskAssignmentAgent.assignSingleTask(taskId);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        }
    }
}
