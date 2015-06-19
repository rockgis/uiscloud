package com.uiscloud.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uiscloud.service.domain.Member;

public interface LoginRepository extends JpaRepository<Member, String> {

}
