package com.uiscloud.service.domain;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;

public class Login {
	@NotNull(message="{error.required}")
	@Email(message="{error.email}")
	@Length(min=8, max=30, message="{error.length}")
	private String userId; // userId 는 email	
	
	@NotNull(message="{error.required}")
	@Pattern(regexp="((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$]).{8,16})", message="{error.password.regexp}")
	//http://www.mkyong.com/regular-expressions/how-to-validate-password-with-regular-expression/
	//숫자, 영문자, 특수문자(@#$) 조합으로6자 이상 20자 이하
	private String password;

	public Login() {
		
	}

	public Login(String userId, String password) {
		super();
		this.userId = userId;
		this.password = password;
	}
	/**
	 * @return the userId
	 */
	public String getUserId() {
		return userId;
	}
	/**
	 * @param userId the userId to set
	 */
	public void setUserId(String userId) {
		this.userId = userId;
	}
	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}
	/**
	 * @param password the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((password == null) ? 0 : password.hashCode());
		result = prime * result + ((userId == null) ? 0 : userId.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (!(obj instanceof Login)) {
			return false;
		}
		Login other = (Login) obj;
		if (password == null) {
			if (other.password != null) {
				return false;
			}
		} else if (!password.equals(other.password)) {
			return false;
		}
		if (userId == null) {
			if (other.userId != null) {
				return false;
			}
		} else if (!userId.equals(other.userId)) {
			return false;
		}
		return true;
	}
}
