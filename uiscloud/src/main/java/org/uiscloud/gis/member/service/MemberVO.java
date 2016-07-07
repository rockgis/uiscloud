package org.uiscloud.gis.member.service;

/**
 * @Class Name : MemberVO.java
 * @Description : Member VO class
 * @Modification Information
 *
 * @author 김종민
 * @since 2014.08.08
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */



public class MemberVO {
	
   private static final long serialVersionUID = 1L;
    
   private int cntId;
   
   private String userId ;
   
   private String  pwd ;
   
   private int userRole;
   
   private int userRegion ; 
   
   private String suserRole ;
   
   private String suserRegion ; 
   
   private String userName ;
   
   private String email ;
   
   private int status ;
   
   private String createDatetime;
   
   private String roleName;
   
   public MemberVO() {  	
   }
   
   public MemberVO(int cnt_id,String user_id,String pwd,int user_role,int user_region,String user_name,String email,int status,String create_datetime,String role_name,String suser_role,String suser_region) {
		
	   super();
		
		this.cntId = cnt_id;
		this.userId =user_id;
		this.pwd  = pwd;
		this.userRole = user_role;
		this.userRegion = user_region ; 
		this.userName = user_name;
		this.email = email;
		this.status = status;
		this.createDatetime=create_datetime;
		this.roleName=role_name;
		this.suserRole = suser_role;
		this.suserRegion = suser_region ; 
		
	}

public int getCntId() {
	return cntId;
}

public void setCntId(int cntId) {
	this.cntId = cntId;
}

public String getUserId() {
	return userId;
}

public void setUserId(String userId) {
	this.userId = userId;
}

public String getPwd() {
	return pwd;
}

public void setPwd(String pwd) {
	this.pwd = pwd;
}

public int getUserRole() {
	return userRole;
}

public void setUserRole(int userRole) {
	this.userRole = userRole;
}

public int getUserRegion() {
	return userRegion;
}

public void setUserRegion(int userRegion) {
	this.userRegion = userRegion;
}

public String getSuserRole() {
	return suserRole;
}

public void setSuserRole(String suserRole) {
	this.suserRole = suserRole;
}

public String getSuserRegion() {
	return suserRegion;
}

public void setSuserRegion(String suserRegion) {
	this.suserRegion = suserRegion;
}

public String getUserName() {
	return userName;
}

public void setUserName(String userName) {
	this.userName = userName;
}

public String getemail() {
	return email;
}

public void setemail(String email) {
	this.email = email;
}

public int getStatus() {
	return status;
}

public void setStatus(int status) {
	this.status = status;
}

public String getCreateDatetime() {
	return createDatetime;
}

public void setCreateDatetime(String createDatetime) {
	this.createDatetime = createDatetime;
}

public String getRoleName() {
	return roleName;
}

public void setRoleName(String roleName) {
	this.roleName = roleName;
}
   
   
}