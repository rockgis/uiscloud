package com.uiscloud.domain;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.junit.BeforeClass;
import org.junit.Test;

import com.uiscloud.service.domain.Login;

public class LoginTest {
	private static Validator validator;

	@BeforeClass
	public static void setUp() {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();

		validator = factory.getValidator();
	}

	@Test
	public void 정상적인_로그인_정보() {
		Login login = new Login("customer@uiscloud.com", "customer1@Z");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(0));
	}

	@Test
	public void ID가_null인_경우() {
		Login login = new Login(null, "customer1@Z");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(1));

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.required}"));
	}

	@Test
	public void ID가_email_형식이_아닌_경우() {
		Login login = new Login("customer", "customer1@Z");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(1));

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.email}"));
	}

	@Test
	public void ID가_8자_미만인_경우() {
		Login login = new Login("a@b.com", "customer1@Z");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(1));

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.length}"));
	}

	@Test
	public void ID가_30자_초과인_경우() {
		Login login = new Login("1234567890@1234567890.1234567890",
				"customer1@Z");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(1));

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.length}"));
	}

	@Test
	public void 비밀번호가_null인_경우() {
		Login login = new Login("customer@uiscloud.com", null);

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(1));

		// System.out.println(constraintViolations.iterator().next().getMessage());

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.required}"));
	}

	@Test
	public void 비밀번호가_8자_미만인_경우() {
		Login login = new Login("customer@uiscloud.com", "a1b2C3#");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

//		Iterator<ConstraintViolation<Login>> it = constraintViolations.iterator();
//
//		for (ConstraintViolation<Login> str : constraintViolations) {
//			System.out.println(str.getMessage());
//		}

		assertThat(constraintViolations.size(), is(1));

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.password.regexp}"));
	}

	@Test
	public void 비밀번호가_16자_초과인_경우() {
		Login login = new Login("customer@uiscloud.com", "a1b2C3#1234567890");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(1));

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.password.regexp}"));
	}

	@Test
	public void 비밀번호가_숫자를_포함하지_않는_경우() {
		Login login = new Login("customer@uiscloud.com", "aB#aaaaa");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(1));

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.password.regexp}"));
	}

	@Test
	public void 비밀번호가_특수문자를_포함하지_않는_경우() {
		Login login = new Login("customer@uiscloud.com", "aB1aaaaa");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(1));

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.password.regexp}"));
	}

	@Test
	public void 비밀번호가_소문자를_포함하지_않는_경우() {
		Login login = new Login("customer@uiscloud.com", "AB1AAAAA");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(1));

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.password.regexp}"));
	}

	@Test
	public void 비밀번호가_대문자를_포함하지_않는_경우() {
		Login login = new Login("customer@uiscloud.com", "ab1aaaaa");

		Set<ConstraintViolation<Login>> constraintViolations = validator
				.validate(login);

		assertThat(constraintViolations.size(), is(1));

		assertThat(constraintViolations.iterator().next().getMessage(),
				is("{error.password.regexp}"));
	}
}
