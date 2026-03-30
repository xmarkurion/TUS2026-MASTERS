package com.tus2026.backend.agents;

import com.tus2026.backend.Models.Member;
import com.tus2026.backend.Models.Status;
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
     */
    private final ThreadLocal<Map<String, String>> reasonLog =
            ThreadLocal.withInitial(HashMap::new);

    /**
     * Captures taskId → overCapacity flag for each assignment in a turn.
     */
    private final ThreadLocal<Map<String, Boolean>> overCapacityLog =
            ThreadLocal.withInitial(HashMap::new);

    public TaskAssignmentTools(TaskRepository taskRepository, MemberRepository memberRepository) {
        this.taskRepository = taskRepository;
        this.memberRepository = memberRepository;
    }

    /** Computes available capacity = totalCapacity - sum of active (non-DONE) task efforts. */
    private int computeAvailableCapacity(Member member) {
        int used = taskRepository.findByAssigneeId(member.getId())
                .stream()
                .filter(t -> t.getStatus() != Status.DONE)
                .mapToInt(Task::getEffort)
                .sum();
        return member.getTotalCapacity() - used;
    }

    @Tool(description = """
            Returns all team members with their skills, total capacity, computed available capacity, and current task count.
            availableCapacity = totalCapacity minus the sum of active (non-DONE) task efforts.
            Call this once at the start of each turn to understand the team before making assignments.
            Prefer members where availableCapacity >= task effort, but you MAY assign to over-capacity members
            if no better skill match exists — it will be flagged for human review.
            """)
    public String getAvailableMembers() {
        List<Member> members = memberRepository.findAll();
        if (members.isEmpty()) {
            return "No team members found.";
        }
        return members.stream()
                .map(m -> {
                    int available = computeAvailableCapacity(m);
                    int assigned = taskRepository.findByAssigneeId(m.getId()).size();
                    return String.format(
                            "id=%s | name=%s | position=%s | totalCapacity=%dh | availableCapacity=%dh | assignedTasks=%d | skills=[%s]",
                            m.getId(), m.getName(), m.getPosition(),
                            m.getTotalCapacity(), available, assigned,
                            String.join(", ", m.getSkills()));
                })
                .collect(Collectors.joining("\n"));
    }

    @Tool(description = """
            Assigns a task to a team member and saves the decision to the database.
            Capacity is computed dynamically — this tool does NOT deduct from a stored field.
            Over-capacity assignments are allowed but will be flagged for human review.
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

        int availableBefore = computeAvailableCapacity(member);
        boolean overCapacity = availableBefore < task.getEffort();

        task.setAssigneeId(memberId);
        taskRepository.save(task);

        String actualReason = String.format(
                "Assigned to %s (%s) based on skills: [%s]. Task effort: %dh, available capacity was: %dh.%s",
                member.getName(), member.getPosition(),
                String.join(", ", member.getSkills()),
                task.getEffort(), availableBefore,
                overCapacity ? " Note: This assignment exceeds available capacity — flagged for review." : "");

        reasonLog.get().put(taskId, actualReason);
        overCapacityLog.get().put(taskId, overCapacity);

        return String.format("OK: '%s' → %s | effort=%dh | available was %dh%s",
                task.getTaskName(), member.getName(), task.getEffort(), availableBefore,
                overCapacity ? " [OVER CAPACITY — flagged for review]" : "");
    }

    /** Called by the agent after each batch to retrieve captured reasons, then clears the log. */
    public Map<String, String> getAndClearReasonLog() {
        Map<String, String> snapshot = new HashMap<>(reasonLog.get());
        reasonLog.get().clear();
        return snapshot;
    }

    /** Called by the agent after each batch to retrieve over-capacity flags, then clears the log. */
    public Map<String, Boolean> getAndClearOverCapacityLog() {
        Map<String, Boolean> snapshot = new HashMap<>(overCapacityLog.get());
        overCapacityLog.get().clear();
        return snapshot;
    }
}
