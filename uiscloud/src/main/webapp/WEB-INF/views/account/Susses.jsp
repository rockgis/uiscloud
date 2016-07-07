<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Welcome to SK BIES</title>
<!-- ValidationBox ToolTip 을 위해 필요 -->
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/bootstrap/easyui.css">
<link rel="stylesheet" type="text/css" href="/gis/css/login.css">
</head>
<body>
	<div id="container">
		<img src="/gis/images/login/login_logo.png">
		<img src="/gis/images/login/login_img.png">
	    <div id="divID"><c:out value='${mesage}'/><br>
	      
	    </div>

		
	</div>
	
	<!-- jquery & easy ui -->
	<script type="text/javascript" src="/gis/lib/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="/gis/lib/jquery/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="/gis/js/com/util.js"></script>
	<script>
	

		
		
	$(document).ready(function() {
		
		alert("요청하신 작업이 완료 되었습니다. ");		
		self.close();
	});
			
			
	</script>
</body>
</html>