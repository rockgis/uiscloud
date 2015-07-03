package com.uiscloud.test.service;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.uiscloud.test.domain.Person;
import com.uiscloud.test.service.IPersonService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:/spring-context.xml")
@Transactional
public class PersonServiceTest {

	@Resource	
	private IPersonService personService;
	
	@Test
	public void addPersons() {
		for(Integer i = 0 ; i < 10 ; i++) {
			String firstName = "FIRST_NAME " + i.toString();
			String lastName = "LAST_NAME " + i.toString();
			Double money = i.doubleValue();
			
			Person addedPerson = personService.add(firstName, lastName, money);
			assertThat(addedPerson.getId(), not(0));
		}
	}
	
	@Test
	public void getPerson() {		
		addPersons();
		Person person = personService.getAll().get(0);
		Integer id = person.getId();
		
		assertThat(id, not(0));
		
		Person newPerson = personService.get(id);
		assertThat(person.getId(), is(newPerson.getId()));
	}
	
	@Test
	public void editPerson() {
		addPersons();
		
		Person person = personService.getAll().get(0);
		Integer id = person.getId();
		
		assertThat(id, not(0));
		
		String editedFirstName = person.getFirstName() + "__edited";
		personService.edit(id, editedFirstName, person.getLastName(), person.getMoney());
		Person editedPerson = personService.get(id);
		assertThat(editedPerson.getFirstName(), is(editedFirstName));
	}
	
	@Test
	public void deletePerson() {
		addPersons();
		Person person = personService.getAll().get(0);
		Integer id = person.getId();
		
		assertThat(id, not(0));
		
		personService.delete(id);
		assertNull(personService.get(id));
	}
}
