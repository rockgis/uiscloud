package com.uiscloud.test.service;

import java.util.List;

import com.uiscloud.test.domain.Person;

public interface TestPersonService {

	public abstract List<Person> getAll();

	public abstract Person get(Integer id);

	public abstract Person add(String firstName, String lastName, Double money);

	public abstract Person edit(Integer id, String firstName, String lastName,
			Double money);

	public abstract void delete(Integer id);

}