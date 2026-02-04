package com.tus2026.backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "members")
public class Member {

    @Id
    private String id; // EMP-003

    private String name;
    private String position;
    private String personalBackground;
    private List<String> skills;
    private int availableCapacity;

    public Member(String id, String name, String position,
                    String personalBackground, List<String> skills,
                    int availableCapacity) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.personalBackground = personalBackground;
        this.skills = skills;
        this.availableCapacity = availableCapacity;
    }


    //For logs and debugging
    @Override
    public String toString(){
        return String.format(
            "Member[id=%s, name:'%s', position:'%s', personal_background:'%s, skills:%s, available_capacity:%s]",
            id, name, position, personalBackground, String.join(",",skills), availableCapacity);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getPersonalBackground() {
        return personalBackground;
    }

    public void setPersonalBackground(String personalBackground) {
        this.personalBackground = personalBackground;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public int getAvailableCapacity() {
        return availableCapacity;
    }

    public void setAvailableCapacity(int availableCapacity) {
        this.availableCapacity = availableCapacity;
    }
}
