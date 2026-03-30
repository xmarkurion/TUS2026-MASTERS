package com.tus2026.backend.controller;

import com.tus2026.backend.Models.Member;
import com.tus2026.backend.Models.Status;
import com.tus2026.backend.Repository.MemberRepository;
import com.tus2026.backend.Repository.TaskRepository;
import com.tus2026.backend.dto.MemberResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/members")
@CrossOrigin(origins = "http://localhost:8080")
public class MemberController {

    @Autowired
    private MemberRepository repo;

    @Autowired
    private TaskRepository taskRepo;

    /** Computes available = totalCapacity - sum of active (non-DONE) task efforts. */
    private MemberResponseDto toDto(Member member) {
        int used = taskRepo.findByAssigneeId(member.getId())
                .stream()
                .filter(t -> t.getStatus() != Status.DONE)
                .mapToInt(t -> t.getEffort())
                .sum();
        int available = member.getTotalCapacity() - used;
        return new MemberResponseDto(
                member.getId(),
                member.getName(),
                member.getPosition(),
                member.getPersonalBackground(),
                member.getSkills(),
                member.getTotalCapacity(),
                available
        );
    }

    @PostMapping("/addMember")
    public ResponseEntity<?> saveTask(@RequestBody Member member) {
        try {
            member.setTotalCapacity(10);
            Member savedMember = repo.save(member);
            return ResponseEntity.status(201).body(toDto(savedMember));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving member: " + e.getMessage());
        }
    }

    @GetMapping("/findAllMembers")
    public ResponseEntity<?> getMembers() {
        try {
            List<MemberResponseDto> dtos = repo.findAll().stream().map(this::toDto).toList();
            return ResponseEntity.status(200).body(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(List.of("error", "Failed to fetch members"));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateMember(@PathVariable String id, @RequestBody Member member) {
        try {
            Optional<Member> optionalMember = repo.findById(id);
            if (optionalMember.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Member not found"));
            }
            Member existing = optionalMember.get();
            existing.setName(member.getName());
            existing.setPosition(member.getPosition());
            existing.setPersonalBackground(member.getPersonalBackground());
            existing.setSkills(member.getSkills());
            Member updated = repo.save(existing);
            return ResponseEntity.status(200).body(toDto(updated));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update member"));
        }
    }

    @PutMapping("/updatecapacity/{id}")
    public ResponseEntity<?> updateMemberCapacity(@PathVariable String id, @RequestBody Map<String, Integer> body) {
        try {
            Optional<Member> optionalMember = repo.findById(id);
            if (optionalMember.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Member not found"));
            }
            Member existing = optionalMember.get();
            Integer newTotal = body.get("totalCapacity");
            if (newTotal != null && newTotal > 0) {
                existing.setTotalCapacity(newTotal);
            }
            Member updated = repo.save(existing);
            return ResponseEntity.status(200).body(toDto(updated));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update member capacity"));
        }
    }

    @GetMapping("/findByName")
    public ResponseEntity<?> getMemberByName(@RequestParam String name) {
        try {
            List<MemberResponseDto> dtos = repo.findByNameContainingIgnoreCase(name)
                    .stream().map(this::toDto).toList();
            return ResponseEntity.status(200).body(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch members by name"));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMember(@PathVariable String id) {
        try {
            if (!repo.existsById(id)) {
                return ResponseEntity.status(404).body("Member not found");
            }
            repo.deleteById(id);
            return ResponseEntity.status(200).body("Deleted Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting member: " + e.getMessage());
        }
    }
}
