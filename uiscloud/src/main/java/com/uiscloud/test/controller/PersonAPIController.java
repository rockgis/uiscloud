package com.uiscloud.test.controller;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.uiscloud.test.domain.Person;
import com.uiscloud.test.service.TestPersonService;

@Controller
public class PersonAPIController {

	// @Resource(name="personService")
	// private IPersonService personService;

	@Resource
	TestPersonService testPersonService;

	public TestPersonService getTestPersonService() {
		return testPersonService;
	}

	public void setTestPersonService(TestPersonService testPersonService) {
		this.testPersonService = testPersonService;
	}

	private static final Logger logger = LoggerFactory
			.getLogger(PersonAPIController.class);

	@RequestMapping(value = "rest/person/{id}")
	@ResponseBody
	public Person get(@PathVariable Integer id) {
		Person person = testPersonService.get(id);
		return person;
	}

	@RequestMapping(value = "rest/person/list")
	@ResponseBody
	public List<Person> list() {
		return testPersonService.getAll();
	}

	@RequestMapping(value = "rest/person/add", produces = "application/json", method = RequestMethod.PUT)
	@ResponseBody
	public Person add(
			@RequestParam(value = "firstName", required = true) String firstName,
			@RequestParam(value = "lastName", required = true) String lastName,
			@RequestParam(value = "money", required = true) Double money) {

		return testPersonService.add(firstName, lastName, money);
	}

	@RequestMapping(value = "rest/person/edit", produces = "application/json", method = RequestMethod.POST)
	@ResponseBody
	public Person edit(
			@RequestParam(value = "id", required = true) Integer id,
			@RequestParam(value = "firstName", required = true) String firstName,
			@RequestParam(value = "lastName", required = true) String lastName,
			@RequestParam(value = "money", required = true) Double money) {
		return testPersonService.edit(id, firstName, lastName, money);
	}

	@RequestMapping(value = "rest/person/delete/{id}", produces = "application/json", method = RequestMethod.DELETE)
	@ResponseBody
	public Person delete(@PathVariable Integer id) {
		Person person = testPersonService.get(id);
		if (person != null) {
			testPersonService.delete(id);
		}

		return person;
	}
}