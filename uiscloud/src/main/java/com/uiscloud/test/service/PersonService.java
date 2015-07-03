package com.uiscloud.test.service;

import java.util.List;

import javax.annotation.Resource;
import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.uiscloud.test.domain.Person;
import com.uiscloud.test.repository.PersonRepository;

@Service("personService")
@Transactional
public class PersonService implements IPersonService {
	@Resource
    PersonRepository repository;

	@Override
	public List<Person> getAll() {
		List<Person> persons = (List<Person>) repository.findAll();
		
		return persons;
	}

	@Override
	public Person get(Integer id) {
		Person person = repository.findOne(id);
		
		return person;
	}

	@Override
	public Person add(String firstName, String lastName, Double money) {
		Person person = new Person();
		person.setFirstName(firstName);
		person.setLastName(lastName);
		person.setMoney(money);

		repository.save(person);

		return person;
	}

	@Override
	public Person edit(Integer id, String firstName, String lastName,
			Double money) {
		Person person = repository.findOne(id);
		
		person.setFirstName(firstName);
		person.setLastName(lastName);
		person.setMoney(money);
		
		repository.save(person);

		return person;
	}

	@Override
	public void delete(Integer id) {		
		repository.delete(id);
	}
}