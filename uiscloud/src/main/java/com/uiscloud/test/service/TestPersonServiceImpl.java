package com.uiscloud.test.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.uiscloud.test.domain.Person;
import com.uiscloud.test.repository.PersonRepository;

@Service("testPersonService")
public class TestPersonServiceImpl implements TestPersonService {
	@Resource
    PersonRepository repository;

	/* (non-Javadoc)
	 * @see com.uiscloud.test.service.TestPersonService#getAll()
	 */
	@Override
	public List<Person> getAll() {
		List<Person> persons = (List<Person>) repository.findAll();
		
		return persons;
	}

	/* (non-Javadoc)
	 * @see com.uiscloud.test.service.TestPersonService#get(java.lang.Integer)
	 */
	@Override
	public Person get(Integer id) {
		Person person = repository.findOne(id);
		
		return person;
	}

	/* (non-Javadoc)
	 * @see com.uiscloud.test.service.TestPersonService#add(java.lang.String, java.lang.String, java.lang.Double)
	 */
	@Override
	public Person add(String firstName, String lastName, Double money) {
		Person person = new Person();
		person.setFirstName(firstName);
		person.setLastName(lastName);
		person.setMoney(money);

		repository.save(person);

		return person;
	}

	/* (non-Javadoc)
	 * @see com.uiscloud.test.service.TestPersonService#edit(java.lang.Integer, java.lang.String, java.lang.String, java.lang.Double)
	 */
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

	/* (non-Javadoc)
	 * @see com.uiscloud.test.service.TestPersonService#delete(java.lang.Integer)
	 */
	@Override
	public void delete(Integer id) {		
		repository.delete(id);
	}
}
