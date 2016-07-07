package org.uiscloud.gis.member.service;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

public class UserLoginFailureHandler implements AuthenticationFailureHandler{
	
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log logger = LogFactory.getLog(this.getClass());

	 //private static final Logger logger = LoggerFactory.getLogger(UserLoginFailureHandler.class);
	 
	 @Override
	 public void onAuthenticationFailure(HttpServletRequest req,
	   HttpServletResponse res, AuthenticationException auth)
	   throws IOException, ServletException {
	  // TODO Auto-generated method stub
	  logger.info(auth.getLocalizedMessage());
	  logger.info(auth.getMessage());
	  for(StackTraceElement s : auth.getStackTrace()){
	   logger.info(s.getClassName());
	   logger.info(s.getFileName());
	   logger.info(s.getMethodName());
	   logger.info(s.getLineNumber()+"");
	   logger.info(s.isNativeMethod()+"");
	  }
	  
	 // req.setAttribute("errMsg",auth.getMessage());
	  //req.getRequestDispatcher("/WEB-INF/views/user/loginPage.jsp").forward(req, res);
	  
	  res.sendRedirect(req.getContextPath()+"/gis/denied");
	 }
	 
}