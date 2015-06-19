package com.uiscloud.test.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uiscloud.test.domain.Person;

public interface PersonRepository extends JpaRepository<Person, Integer> {

}