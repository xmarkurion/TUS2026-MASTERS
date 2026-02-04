package com.tus2026.backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    private String taskName;
    private Integer difficulty;
    private String taskDesc;
    private String assigneeId; // reference to Employee id
    private int effort;

    public Task(String taskName, Integer difficulty, String taskDesc,
                String assigneeId, int effort) {
        this.taskName = taskName;
        this.difficulty = difficulty;
        this.taskDesc = taskDesc;
        this.assigneeId = assigneeId;
        this.effort = effort;
    }

    //For logs and debugging
    @Override
    public String toString(){
        return String.format(
            "Task[task_name=%s, difficulty:'%s', task_desc:'%s', assignee_id:'%s, effort:%s]",
            id, taskName, difficulty, taskDesc, assigneeId, effort);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public Integer getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Integer difficulty) {
        this.difficulty = difficulty;
    }

    public String getTaskDesc() {
        return taskDesc;
    }

    public void setTaskDesc(String taskDesc) {
        this.taskDesc = taskDesc;
    }

    public String getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(String assigneeId) {
        this.assigneeId = assigneeId;
    }

    public int getEffort() {
        return effort;
    }

    public void setEffort(int effort) {
        this.effort = effort;
    }
}
