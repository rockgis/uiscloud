package com.uiscloud.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uiscloud.service.domain.Member;

public interface JoinRepository extends JpaRepository<Member, String> {
	
}