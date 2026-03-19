package com.tus2026.backend.Repository;

import com.tus2026.backend.Models.Member;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MemberRepository extends MongoRepository<Member, String> {

    Member findByName(String name);

    List<Member> findByNameContainingIgnoreCase(String name);
}
