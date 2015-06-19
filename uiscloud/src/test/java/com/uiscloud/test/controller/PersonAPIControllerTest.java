package com.uiscloud.test.controller;

import static org.mockito.Mockito.atMost;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.uiscloud.test.controller.PersonAPIController;
import com.uiscloud.test.domain.Person;
import com.uiscloud.test.service.TestPersonService;

public class PersonAPIControllerTest {

	// @Autowired
	// private IPersonService personService;
	// @Autowired
	// private RequestMappingHandlerAdapter handlerAdapter;
	//
	// @Autowired
	// private RequestMappingHandlerMapping handlerMapping;
	// private Person person;

	private TestPersonService service;
	private PersonAPIController controller;
	private Person person;

	@Before
	public void setup() {
		// person = personService.add("ykyoon", "lastName", 100.00);
		controller = new PersonAPIController();
		service = org.mockito.Mockito.mock(TestPersonService.class);

		controller.setTestPersonService(service);
		
		person = new Person();
		person.setId(9);
		person.setFirstName("et24t");
		person.setLastName("ETD");
		person.setMoney(25693.15);
	}

	@After
	public void tearDown() {
		reset(service); // Mockito Mock �ʱ�ȭ
	}

	@Test
	public void getId() throws Exception {
		// MockHttpServletRequest request = new
		// MockHttpServletRequest("GET","/rest/person/" +
		// person.getId().toString());
		// MockHttpServletResponse response = new MockHttpServletResponse();
		//
		// Object handler = handlerMapping.getHandler(request).getHandler();
		// ModelAndView modelAndView = handlerAdapter.handle(request, response,
		// handler);
		// System.out.println(response.getContentAsString());
		// assertNull(modelAndView);
		when(service.get(9)).thenReturn(person);
		
		MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
		mockMvc.perform(get("/rest/person/" + person.getId().toString()))
				.andExpect(status().isOk());

	}

	@Test
	public void edit() throws Exception {
		// MockHttpServletRequest request = new MockHttpServletRequest("POST",
		// "/rest/person/edit");
		// request.addParameter("id", person.getId().toString());
		// String editedFirstName = "EDITED_FIRSTNAME";
		// request.addParameter("firstName", editedFirstName);
		// request.addParameter("lastName", person.getLastName());
		// request.addParameter("money", person.getMoney().toString());
		//
		// MockHttpServletResponse response = new MockHttpServletResponse();
		//
		// Object handler = handlerMapping.getHandler(request).getHandler();
		// ModelAndView modelAndView = handlerAdapter.handle(request, response,
		// handler);
		// System.out.println(response.getContentAsString());
		// assertNull(modelAndView);
		//
		// Person editedPerson = personService.get(person.getId());
		// assertThat(editedPerson.getFirstName(), is(editedFirstName));

		MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

		mockMvc.perform(
				post("/rest/person/edit")
						.param("id", person.getId().toString())
						.param("firstName", "EDITED_FIRSTNAME")
						.param("lastName", person.getLastName())
						.param("money", person.getMoney().toString()))
				.andExpect(status().isOk());

	}

	@Test
	public void deleteId() throws Exception {
		// MockHttpServletRequest request = new MockHttpServletRequest("DELETE",
		// "/rest/person/delete/" + person.getId().toString());
		// MockHttpServletResponse response = new MockHttpServletResponse();
		//
		// Object handler = handlerMapping.getHandler(request).getHandler();
		// ModelAndView modelAndView = handlerAdapter.handle(request, response,
		// handler);
		// System.out.println(response.getContentAsString());
		// assertThat(response.getStatus(), is(200));
		// assertNull(modelAndView);
		//
		// Person deletedPerson = personService.get(person.getId());
		// assertNull(deletedPerson);
		//org.mockito.Mockito.doNothing().when(service).delete(1);
		
		MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
		
		mockMvc.perform(delete("/rest/person/delete/{id}", person.getId()))
	    		.andExpect(status().isOk());

		verify(service, times(1)).get(person.getId());
		verify(service, atMost(1)).delete(person.getId());

	}
}
