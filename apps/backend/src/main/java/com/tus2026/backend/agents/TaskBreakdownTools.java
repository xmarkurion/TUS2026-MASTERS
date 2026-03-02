package com.tus2026.backend.agents;

import com.tus2026.backend.Models.ProjectContext;
import com.tus2026.backend.Models.Task;
import com.tus2026.backend.Repository.ProjectContextRepository;
import com.tus2026.backend.Repository.TaskRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskBreakdownTools {

    private final TaskRepository taskRepository;
    private final ProjectContextRepository projectContextRepository;

    // TODO: Need to fix project Context Design as it seems unscalable
    // TODO: Deduplication agent seems to not work most of the times need something
    // more
    // robust than just checking the names of the tasks, maybe we can use embeddings
    // to check similarity between task descriptions and existing tasks

    public TaskBreakdownTools(TaskRepository taskRepository,
            ProjectContextRepository projectContextRepository) {
        this.taskRepository = taskRepository;
        this.projectContextRepository = projectContextRepository;
    }

    /**
     * Agent calls this tool to understand the project — stack, description,
     * conventions.
     */
    @Tool(description = """
            Retrieves the current project context including project name, description,
            tech stack, and coding conventions. Call this first to understand what kind
            of tasks are appropriate for this project.
            """)
    public String getProjectContext() {
        List<ProjectContext> contexts = projectContextRepository.findAll();
        if (contexts.isEmpty()) {
            return "No project context found. Assume a general full-stack web application.";
        }
        ProjectContext ctx = contexts.get(0);
        return String.format("""
                Project Name: %s
                Description: %s
                Tech Stack: %s
                Conventions: %s
                """,
                ctx.getProjectName(),
                ctx.getDescription(),
                String.join(", ", ctx.getTechStack()),
                ctx.getConventions());
    }

    /**
     * Agent calls this tool to check what's already been implemented — to avoid
     * duplicates.
     */
    @Tool(description = """
            Retrieves the list of features already implemented in the project.
            Call this to avoid generating tasks that duplicate existing work.
            """)
    public String getImplementedFeatures() {
        List<ProjectContext> contexts = projectContextRepository.findAll();
        if (contexts.isEmpty()) {
            return "No implemented features found.";
        }
        ProjectContext ctx = contexts.get(0);
        if (ctx.getFeaturesImplemented() == null || ctx.getFeaturesImplemented().isEmpty()) {
            return "No features implemented yet.";
        }
        return "Implemented features:\n" + String.join("\n- ", ctx.getFeaturesImplemented());
    }

    /**
     * Agent calls this to see existing tasks — for deduplication and context.
     */
    @Tool(description = """
            Retrieves the names and descriptions of all existing tasks in the system.
            Call this to avoid generating duplicate tasks and to understand what work
            is already planned or in progress.
            """)
    public String getExistingTasks() {
        List<Task> tasks = taskRepository.findAll();
        if (tasks.isEmpty()) {
            return "No existing tasks found.";
        }
        return tasks.stream()
                .map(t -> String.format("- [%s] %s: %s", t.getStatus(), t.getTaskName(), t.getTaskDesc()))
                .collect(Collectors.joining("\n"));
    }
}