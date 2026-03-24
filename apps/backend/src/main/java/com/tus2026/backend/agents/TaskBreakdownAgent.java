package com.tus2026.backend.agents;

import com.tus2026.backend.Models.Status;
import com.tus2026.backend.Models.Task;
import com.tus2026.backend.Models.TaskDifficulty;
import com.tus2026.backend.Repository.TaskRepository;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskBreakdownAgent {

    private final ChatClient chatClient;
    private final TaskBreakdownTools taskBreakdownTools;
    private final TaskRepository taskRepository;

    /**
     * Minimal DTO the LLM populates — avoids MongoDB annotations on Task
     * interfering with Spring AI's structured output deserialization.
     */
    private record TaskDto(
            String taskName,
            String taskDesc,
            String difficulty,
            int effort
    ) {}

    private static final String SYSTEM_PROMPT = """
            You are a senior software engineering tech lead and project manager.
            Your job is to break down a feature description into a list of concrete,
            actionable development tasks.

            You have access to the following tools:
            - getProjectContext: call this to understand the project stack and conventions
            - getImplementedFeatures: call this to see what has already been built
            - getExistingTasks: call this to see current tasks and avoid duplication

            REASONING PROCESS — follow these steps every time:
            1. Call getProjectContext to understand the project
            2. Call getImplementedFeatures to know what is already done
            3. Call getExistingTasks to avoid creating duplicates
            4. Reason through which layers the feature touches (backend, frontend, DB, tests, config)
            5. Break the feature into tasks, one per concern
            6. Estimate effort (hours) and difficulty for each task

            RULES:
            - Each task should represent 1–8 hours of work
            - Do not duplicate existing tasks
            - Generate between 3 and 10 tasks depending on feature complexity
            - difficulty must be exactly one of: easy, medium, hard
            - effort must be an integer (hours)
            """;

    public TaskBreakdownAgent(ChatClient.Builder chatClientBuilder,
            TaskBreakdownTools taskBreakdownTools,
            TaskRepository taskRepository) {
        // Build with system prompt only — tools attached per prompt call to avoid duplication
        this.chatClient = chatClientBuilder
                .defaultSystem(SYSTEM_PROMPT)
                .build();
        this.taskBreakdownTools = taskBreakdownTools;
        this.taskRepository = taskRepository;
    }

    /**
     * Runs the agent, deserializes structured output directly into TaskDto records,
     * maps to Task entities, saves and returns them.
     */
    public List<Task> generateTasksForEpic(String featureDescription) {
        List<TaskDto> dtos = chatClient
                .prompt()
                .tools(taskBreakdownTools)
                .user(featureDescription)
                .call()
                .entity(new ParameterizedTypeReference<List<TaskDto>>() {});

        List<Task> tasks = dtos.stream().map(dto -> {
            Task task = new Task();
            task.setTaskName(dto.taskName());
            task.setTaskDesc(dto.taskDesc());
            task.setEffort(dto.effort());
            task.setStatus(Status.TODO);
            task.setDifficulty(parseDifficulty(dto.difficulty()));
            return task;
        }).toList();

        return taskRepository.saveAll(tasks);
    }

    private TaskDifficulty parseDifficulty(String value) {
        try {
            return TaskDifficulty.valueOf(value.toUpperCase());
        } catch (Exception e) {
            return TaskDifficulty.medium;
        }
    }
}
