package org.uiscloud.gis.member.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class UserLoginSuccessHandler implements AuthenticationSuccessHandler{
	
	
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log logger = LogFactory.getLog(this.getClass());
	 
	 //private static final Logger logger = LoggerFactory.getLogger(UserLoginSuccessHandler.class);
	 
	 @Override
	 public void onAuthenticationSuccess(HttpServletRequest req,
	   HttpServletResponse res, Authentication auth) throws IOException,
	   ServletException {
	  // TODO Auto-generated method stub
	  logger.info(auth.getName());
	  logger.info(auth.getAuthorities().toString());
	  logger.info(auth.getDetails().toString());
	  logger.info(auth.getPrincipal().toString());
	  for(GrantedAuthority a : auth.getAuthorities()){
	   logger.info(a.getAuthority());
	  }
	  
	  UserDetails u = (UserDetails) auth.getPrincipal();
	  
	  logger.info(String.valueOf(u.isAccountNonExpired()));
	  logger.info(String.valueOf(u.isAccountNonLocked()));
	  logger.info(String.valueOf(u.isCredentialsNonExpired()));
	  logger.info(String.valueOf(u.isEnabled()));
	  
	  res.sendRedirect(req.getContextPath()+"/");
	 }
	 
} 

