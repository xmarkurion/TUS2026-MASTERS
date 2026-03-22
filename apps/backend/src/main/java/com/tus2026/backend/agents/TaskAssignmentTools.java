package com.tus2026.backend.agents;

import com.tus2026.backend.Models.Member;
import com.tus2026.backend.Models.Task;
import com.tus2026.backend.Repository.MemberRepository;
import com.tus2026.backend.Repository.TaskRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class TaskAssignmentTools {

    private final TaskRepository taskRepository;
    private final MemberRepository memberRepository;

    /**
     * Captures taskId → reason for each assignment made during a single agent turn.
     * ThreadLocal ensures concurrent SSE requests don't interfere with each other.
     * Cleared by the agent after each batch via getAndClearReasonLog().
     */
    private final ThreadLocal<Map<String, String>> reasonLog =
            ThreadLocal.withInitial(HashMap::new);

    public TaskAssignmentTools(TaskRepository taskRepository, MemberRepository memberRepository) {
        this.taskRepository = taskRepository;
        this.memberRepository = memberRepository;
    }

    @Tool(description = """
            Returns all team members with their skills, remaining capacity (hours), and current task count.
            Call this once at the start of each turn to understand the team before making assignments.
            Only assign a task to a member whose capacity >= the task's effort in hours.
            """)
    public String getAvailableMembers() {
        List<Member> members = memberRepository.findAll();
        if (members.isEmpty()) {
            return "No team members found.";
        }
        return members.stream()
                .map(m -> {
                    int assigned = taskRepository.findByAssigneeId(m.getId()).size();
                    return String.format(
                            "id=%s | name=%s | position=%s | capacity=%dh | assignedTasks=%d | skills=[%s]",
                            m.getId(), m.getName(), m.getPosition(),
                            m.getAvailableCapacity(), assigned,
                            String.join(", ", m.getSkills()));
                })
                .collect(Collectors.joining("\n"));
    }

    @Tool(description = """
            Assigns a task to a team member and saves the decision to the database.
            Deducts the task's effort (hours) from the member's remaining capacity (floor at 0).
            Parameters:
              - taskId: id of the task to assign
              - memberId: id of the member receiving the task
            Returns a confirmation string or an error if the task/member is not found.
            """)
    public String assignTaskToMember(String taskId, String memberId) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isEmpty()) {
            return "ERROR: Task with id=" + taskId + " not found.";
        }
        Optional<Member> memberOpt = memberRepository.findById(memberId);
        if (memberOpt.isEmpty()) {
            return "ERROR: Member with id=" + memberId + " not found.";
        }

        Task task = taskOpt.get();
        Member member = memberOpt.get();

        task.setAssigneeId(memberId);
        taskRepository.save(task);

        int newCapacity = Math.max(0, member.getAvailableCapacity() - task.getEffort());
        member.setAvailableCapacity(newCapacity);
        memberRepository.save(member);

        // Build reason from actual assignment data only — LLM free-text is discarded to avoid hallucinated names
        String actualReason = String.format(
                "Assigned to %s (%s) based on skills: [%s]. Task effort: %dh, remaining capacity: %dh.",
                member.getName(), member.getPosition(),
                String.join(", ", member.getSkills()),
                task.getEffort(), newCapacity);

        reasonLog.get().put(taskId, actualReason);

        return String.format("OK: '%s' → %s | -%dh | capacity now %dh",
                task.getTaskName(), member.getName(), task.getEffort(), newCapacity);
    }

    /**
     * Called by the agent after each batch to retrieve captured reasons, then clears the log.
     */
    public Map<String, String> getAndClearReasonLog() {
        Map<String, String> snapshot = new HashMap<>(reasonLog.get());
        reasonLog.get().clear();
        return snapshot;
    }
}
