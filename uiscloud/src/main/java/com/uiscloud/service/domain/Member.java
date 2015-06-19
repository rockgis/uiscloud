package com.uiscloud.service.domain;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name="Members")
public class Member {
	@Id
	@NotNull
	@Email
	@Length(min=8, max=30)
	private String userId; // userId 는 email
	
	@NotNull
	@Length(min=8, max=20)
	@Pattern(regexp="((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$]).{8,16})")
	//http://www.mkyong.com/regular-expressions/how-to-validate-password-with-regular-expression/
	//숫자, 영문자, 특수문자(@#$) 조합으로6자 이상 20자 이하
	private String password;
	
	@NotNull
	private String userName;
	
	@NotNull
	private String cellPhone; // 주연이가 P는 대문자라고 했심
	
	@NotNull
	private int birthYear;
	
	@NotNull
	private LocalDateTime creatDateTime;
	
	public Member() {
				
	}
	
	// 사용자 이메일 인증 전
	public Member(String userId, String password) {
		this(userId, password, "", "", 0);
	}
	
	public Member(String userId, String password, String userName,
			String cellPhone, int birthYear) {
		super();
		this.userId = userId;
		this.password = password;
		this.userName = userName;
		this.cellPhone = cellPhone;
		this.birthYear = birthYear;
		this.creatDateTime = LocalDateTime.now();
	}
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getCellPhone() {
		return cellPhone;
	}
	public void setCellPhone(String cellPhone) {
		this.cellPhone = cellPhone;
	}
	public int getBirthYear() {
		return birthYear;
	}
	public void setBirthYear(int birthYear) {
		this.birthYear = birthYear;
	}
	public LocalDateTime getCreatDateTime() {
		return creatDateTime;
	}
	public void setCreatDateTime(LocalDateTime creatDateTime) {
		this.creatDateTime = creatDateTime;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + birthYear;
		result = prime * result
				+ ((cellPhone == null) ? 0 : cellPhone.hashCode());
		result = prime * result
				+ ((creatDateTime == null) ? 0 : creatDateTime.hashCode());
		result = prime * result
				+ ((password == null) ? 0 : password.hashCode());
		result = prime * result + ((userId == null) ? 0 : userId.hashCode());
		result = prime * result
				+ ((userName == null) ? 0 : userName.hashCode());
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
		if (!(obj instanceof Member)) {
			return false;
		}
		Member other = (Member) obj;
		if (birthYear != other.birthYear) {
			return false;
		}
		if (cellPhone == null) {
			if (other.cellPhone != null) {
				return false;
			}
		} else if (!cellPhone.equals(other.cellPhone)) {
			return false;
		}
		if (creatDateTime == null) {
			if (other.creatDateTime != null) {
				return false;
			}
		} else if (!creatDateTime.equals(other.creatDateTime)) {
			return false;
		}
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
		if (userName == null) {
			if (other.userName != null) {
				return false;
			}
		} else if (!userName.equals(other.userName)) {
			return false;
		}
		return true;
	}
}
