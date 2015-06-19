package com.uiscloud.test.domain;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import java.util.Iterator;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.junit.BeforeClass;
import org.junit.Test;

import com.uiscloud.service.domain.Login;
import com.uiscloud.test.domain.Person;

public class PersonTest {
	private static Validator validator;

	   @BeforeClass
	   public static void setUp() {
	      ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
	      validator = factory.getValidator();
	   }
	   
	   @Test
	   public void manufacturerIsNull() {
		   Person person = new Person(100, "lee","lee2", 100.25);

	      Set<ConstraintViolation<Person>> constraintViolations = validator.validate(person);

	      assertThat(constraintViolations.size(), is(0));
	      
	      Iterator<ConstraintViolation<Person>> it = constraintViolations.iterator();
	      
	      for(ConstraintViolation<Person> str : constraintViolations) {
	    	  System.out.println(str.getMessage());
	      }
	   }	   
}
