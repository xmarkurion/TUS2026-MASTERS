package com.tus2026.backend.agents;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tus2026.backend.Models.Task;
import com.tus2026.backend.Repository.MemberRepository;
import com.tus2026.backend.Repository.TaskRepository;
import com.tus2026.backend.dto.AssignmentResult;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TaskAssignmentAgent {

        private static final int BATCH_SIZE = 5;

        private final ChatClient chatClient;
        private final TaskAssignmentTools taskAssignmentTools;
        private final TaskRepository taskRepository;
        private final MemberRepository memberRepository;
        private final ObjectMapper objectMapper;

        private static final String SYSTEM_PROMPT = """
                        You are a senior engineering manager assigning development tasks to team members.

                        Tools available:
                        - getAvailableMembers: call this ONCE to see all team members, their skills, capacity, and current task count
                        - assignTaskToMember: call this ONCE per task to persist the assignment

                        PROCESS:
                        1. Call getAvailableMembers to understand the team
                        2. For each task provided in the message, choose the best member based on:
                           - Skill match with the task description
                           - Task difficulty vs member seniority/position
                           - Prefer members where availableCapacity >= task effort
                           - You MAY assign to a member whose availableCapacity < task effort if they are the best skill match and no one else qualifies — it will be flagged for human review
                           - Prefer members with fewer assigned tasks when skills are equal
                        3. Call assignTaskToMember for each task — always assign all tasks, never skip
                        """;

        public TaskAssignmentAgent(ChatClient.Builder chatClientBuilder,
                        TaskAssignmentTools taskAssignmentTools,
                        TaskRepository taskRepository,
                        MemberRepository memberRepository,
                        ObjectMapper objectMapper) {
                this.chatClient = chatClientBuilder
                                .defaultSystem(SYSTEM_PROMPT)
                                .build();
                this.taskAssignmentTools = taskAssignmentTools;
                this.taskRepository = taskRepository;
                this.memberRepository = memberRepository;
                this.objectMapper = objectMapper;
        }

        public void streamAssignments(SseEmitter emitter) {
                try {
                        List<Task> batch;
                        int turnNumber = 0;

                        // Stop if there are no members at all
                        if (memberRepository.findAll().isEmpty()) {
                                emitter.send(SseEmitter.event()
                                                .name("warning")
                                                .data("No team members found. Add team members before assigning tasks."));
                                emitter.complete();
                                return;
                        }

                        while (!(batch = taskRepository.findByAssigneeIdIsNull()
                                        .stream().limit(BATCH_SIZE).toList()).isEmpty()) {

                                turnNumber++;

                                chatClient
                                                .prompt()
                                                .tools(taskAssignmentTools)
                                                .user(buildUserMessage(batch))
                                                .call()
                                                .content();

                                Map<String, String> reasons = taskAssignmentTools.getAndClearReasonLog();
                                Map<String, Boolean> overCapacityMap = taskAssignmentTools.getAndClearOverCapacityLog();

                                if (reasons.isEmpty()) {
                                        emitter.send(SseEmitter.event()
                                                        .name("warning")
                                                        .data("Turn " + turnNumber
                                                                        + ": agent made no assignments. Stopping."));
                                        break;
                                }

                                List<AssignmentResult> batchResults = reasons.entrySet().stream()
                                                .map(entry -> {
                                                        String taskId = entry.getKey();
                                                        String reason = entry.getValue();
                                                        boolean overCapacity = overCapacityMap.getOrDefault(taskId, false);
                                                        return taskRepository.findById(taskId)
                                                                        .filter(t -> t.getAssigneeId() != null)
                                                                        .flatMap(t -> memberRepository
                                                                                        .findById(t.getAssigneeId())
                                                                                        .map(m -> new AssignmentResult(
                                                                                                        t.getId(),
                                                                                                        t.getTaskName(),
                                                                                                        m.getId(),
                                                                                                        m.getName(),
                                                                                                        reason,
                                                                                                        overCapacity)))
                                                                        .orElse(null);
                                                })
                                                .filter(Objects::nonNull)
                                                .toList();

                                emitter.send(SseEmitter.event()
                                                .name("batch")
                                                .data(objectMapper.writeValueAsString(batchResults)));
                        }

                        emitter.send(SseEmitter.event().name("done").data("All tasks assigned."));
                        emitter.complete();

                } catch (Exception e) {
                        emitter.completeWithError(e);
                }
        }

        public AssignmentResult assignSingleTask(String taskId) {
                Task task = taskRepository.findById(taskId)
                                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

                if (memberRepository.findAll().isEmpty()) {
                        throw new IllegalStateException("No team members found.");
                }

                chatClient
                                .prompt()
                                .tools(taskAssignmentTools)
                                .user(buildUserMessage(List.of(task)))
                                .call()
                                .content();

                Map<String, String> reasons = taskAssignmentTools.getAndClearReasonLog();
                Map<String, Boolean> overCapacityMap = taskAssignmentTools.getAndClearOverCapacityLog();

                Task updated = taskRepository.findById(taskId)
                                .orElseThrow(() -> new IllegalStateException("Task disappeared after assignment."));

                if (updated.getAssigneeId() == null) {
                        throw new IllegalStateException("Agent ran but did not assign task: " + taskId);
                }

                String reason = reasons.getOrDefault(taskId, "Assigned by AI agent.");
                boolean overCapacity = overCapacityMap.getOrDefault(taskId, false);
                return memberRepository.findById(updated.getAssigneeId())
                                .map(m -> new AssignmentResult(
                                                updated.getId(), updated.getTaskName(),
                                                m.getId(), m.getName(), reason, overCapacity))
                                .orElseThrow(() -> new IllegalStateException("Assigned member not found in DB."));
        }

        private String buildUserMessage(List<Task> tasks) {
                String taskList = tasks.stream()
                                .map(t -> String.format("  - id=%s | name=%s | difficulty=%s | effort=%dh | desc=%s",
                                                t.getId(), t.getTaskName(), t.getDifficulty(), t.getEffort(),
                                                t.getTaskDesc()))
                                .collect(Collectors.joining("\n"));
                return "Assign the following tasks to the most suitable team members:\n" + taskList;
        }
}
