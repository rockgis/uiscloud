<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%> 
<!doctype html>
<html ng-app="myHairLogin">
<head>
<meta charset="utf-8">
	<title>로그인</title>
	<link rel="stylesheet" type="text/css" href="/resources/css/libs/bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="/resources/css/login.css">

</head>
<body ng-controller="loginCtrl" ng-init='init(${jsonLogin})'>
	
	<div id="container">
      <h2 class="form-login-heading">MyHair Login</h2>			
      <form:form commandName="login">
			<form:input path="userId" type="email" ng-model="userId" ng-required="true" class="form-control" placeholder="Email Address"/>
			<form:input path="password" type="password" ng-model="password" ng-required="true" class="form-control" placeholder="Password" />
			
			<input type="submit" class="btn btn-lg btn-primary btn-block" id="btnLogin" value="로그인" />
			<a class="btn btn-lg btn-primary btn-block" id="aJoinMember" href="#">회원가입</a>
			
			<form:errors path="userId" cssClass="error" />
			<form:errors path="password" cssClass="error" />
		</form:form>
	</div>
	
	<div ng-hide="'${message}' == ''"> 
		<c:out value='${message}'/>
	</div>
	
	<!-- js 추가 -->
	<script type="text/javascript" src="/resources/js/libs/angular/angular.min.js"></script>
	<script type="text/javascript" src="/resources/js/login.js"></script>
	
</body>
</html>
