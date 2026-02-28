package com.tus2026.backend.agents;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tus2026.backend.Models.Status;
import com.tus2026.backend.Models.Task;
import com.tus2026.backend.Models.TaskDifficulty;
import com.tus2026.backend.Repository.TaskRepository;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TaskBreakdownAgent {

    private final ChatClient chatClient;
    private final TaskBreakdownTools taskBreakdownTools;
    private final TaskRepository taskRepository;
    private final ObjectMapper objectMapper;

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

            OUTPUT RULES — CRITICAL:
            - Return ONLY a raw JSON array. No explanation, no markdown, no code fences.
            - Each task object must have exactly these fields:
              {
                "taskName": "short, clear task title",
                "taskDesc": "detailed description with acceptance criteria",
                "difficulty": "EASY" | "MEDIUM" | "HARD",
                "effort": <integer — estimated hours>,
                "status": "TODO"
              }
            - Each task should represent 1–8 hours of work
            - Do not duplicate existing tasks
            - Generate between 3 and 10 tasks depending on feature complexity
            """;

    public TaskBreakdownAgent(ChatClient.Builder chatClientBuilder,
            TaskBreakdownTools taskBreakdownTools,
            TaskRepository taskRepository,
            ObjectMapper objectMapper) {
        // Attach tools to the ChatClient at build time
        this.chatClient = chatClientBuilder
                .defaultSystem(SYSTEM_PROMPT)
                .defaultTools(taskBreakdownTools)
                .build();
        this.taskBreakdownTools = taskBreakdownTools;
        this.taskRepository = taskRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Main entry point — takes a plain text feature description,
     * runs the agent, parses the response, saves and returns tasks.
     */
    public List<Task> generateTasksForEpic(String featureDescription) {
        // Run the agent — it will autonomously call tools and reason before responding
        String agentResponse = chatClient
                .prompt()
                .user(featureDescription)
                .call()
                .content();

        // Parse the JSON response into Task entities
        List<Task> tasks = parseAgentResponse(agentResponse);

        // Save all generated tasks to MongoDB
        return taskRepository.saveAll(tasks);
    }

    private List<Task> parseAgentResponse(String response) {
        try {
            // Strip markdown code fences if the model added them despite instructions
            String cleaned = response
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            // Parse JSON array into raw maps first for safe field extraction
            List<java.util.Map<String, Object>> rawTasks = objectMapper.readValue(
                    cleaned,
                    new TypeReference<>() {
                    });

            List<Task> tasks = new ArrayList<>();
            for (var raw : rawTasks) {
                Task task = new Task();
                task.setTaskName((String) raw.getOrDefault("taskName", "Untitled Task"));
                task.setTaskDesc((String) raw.getOrDefault("taskDesc", ""));
                task.setEffort(raw.containsKey("effort")
                        ? Integer.parseInt(raw.get("effort").toString())
                        : 0);
                task.setStatus(Status.TODO);
                task.setDifficulty(parseDifficulty(
                        (String) raw.getOrDefault("difficulty", "MEDIUM")));
                tasks.add(task);
            }
            return tasks;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse agent response into tasks. Raw response: " + response, e);
        }
    }

    private TaskDifficulty parseDifficulty(String value) {
        try {
            return TaskDifficulty.valueOf(value.toUpperCase());
        } catch (Exception e) {
            return TaskDifficulty.medium; // safe default
        }
    }
}
