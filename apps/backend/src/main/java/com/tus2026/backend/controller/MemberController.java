package com.tus2026.backend.controller;

import com.tus2026.backend.Models.Member;
import com.tus2026.backend.Repository.MemberRepository;
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

    @PostMapping("/addMember")
    public ResponseEntity<?> saveTask(@RequestBody Member member) {
        try {
            Member savedMember = repo.save(member);
            return ResponseEntity.status(201).body(savedMember);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving member: " + e.getMessage());
        }
    }

    @GetMapping("/findAllMembers")
    public ResponseEntity<?> getMembers() {
        try {
            List<Member> members = repo.findAll();
            return ResponseEntity.status(200).body(members);
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(List.of("error", "Failed to fetch members"));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateMember(@PathVariable String id, @RequestBody Member member) {
        try {
            Optional<Member> optionalMember = repo.findById(id);

            if (optionalMember.isEmpty()) {
                return ResponseEntity
                        .status(404)
                        .body(Map.of("error", "Member not found"));
            }

            Member existingMember = optionalMember.get();

            existingMember.setName(member.getName());
            existingMember.setPosition(member.getPosition());
            existingMember.setPersonalBackground(member.getPersonalBackground());
            existingMember.setSkills(member.getSkills());

            Member updatedMember = repo.save(existingMember);

            return ResponseEntity.status(200).body(updatedMember);

        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", "Failed to update member"));
        }
    }

    @PutMapping("/updatecapacity/{id}")
    public ResponseEntity<?> updateMemberCapacity(@PathVariable String id, @RequestBody Member member) {
        try {
            Optional<Member> optionalMember = repo.findById(id);

            if (optionalMember.isEmpty()) {
                return ResponseEntity
                        .status(404)
                        .body(Map.of("error", "Member not found"));
            }

            Member existingMember = optionalMember.get();

            existingMember.setAvailableCapacity(member.getAvailableCapacity());

            Member updatedMember = repo.save(existingMember);

            return ResponseEntity.status(200).body(updatedMember);

        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", "Failed to update member capacity"));
        }
    }

    @GetMapping("/findByName")
    public ResponseEntity<?> getMemberByName(@RequestParam String name) {
        try {
            List<Member> members = repo.findByNameContainingIgnoreCase(name);
            return ResponseEntity.status(200).body(members);
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
