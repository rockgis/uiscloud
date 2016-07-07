<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
    <%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta charset="utf-8">
	<title>UISCLOUD  Map</title>
	<link rel="stylesheet" type="text/css" href="/webjars/bootstrap/3.3.6/css/bootstrap.min.css">
</head>
<body>
	   <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">UISCLOUD Map Project</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
        
        <a class="navbar-brand" href=/admin#">Admin</a>

        </div><!--/.navbar-collapse -->
      </div>
    </nav>

    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron">
      <div class="container">
        <h1>UISCLOUD Map Framework</h1>
        <p>Open Layer 기반의 Map viewer & editer
        </p>
         <p><a class="btn btn-primary btn-lg" href="/gis/main_n" role="button">Start &raquo;</a></p>
      </div>
    </div>

    <div class="container">
      <!-- Example row of columns -->
      <div class="row">
      <div class="col-md-4">
          <h2>Openalyer 3.X Example</h2>
          <p>Openlyers 3.X 기반의 예제 </p>
          <p><a class="btn btn-default" href="/geo_examples" role="button">View Example &raquo;</a></p>
        </div>
      <div class="col-md-4">
          <h2>KARIOS 기반의 라우팅 </h2>
          <p> Openlyers + KARIOS  </p>
          <p><a class="btn btn-default" href="/gis/gisMainK" role="button">View Start &raquo;</a></p>
       </div>
        <div class="col-md-4">
          <h2>PostGIS 기반의 라우팅</h2>
          <p>Openlyers + POSTGIS + PGROUTING </p>
          <p><a class="btn btn-default" href="/gis/gisMain" role="button">View Start &raquo;</a></p>
        </div>
        
      </div>

      <hr>

      <footer>
        <p>&copy; Company 2016 UISCLOUD Co., Ltd</p>
      </footer>
    </div> 
    <!-- /container -->
	
	
    <script type="text/javascript" src="/webjars/jquery/2.2.3/jquery.min.js"></script>
	<script type="text/javascript" src="/webjars/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<!-- jquery & easy ui -->
	<script type="text/javascript" src="/gis/lib/jquery-easyui-1.4.5/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="/gis/js/com/util.js"></script>
	<script type="text/javascript" src="/gis/js/login/login.js"></script>

	<script>
	
	/**********************************************************************
	설명 : 회원 가입 이벤트 연결 
	파라메터 :
	리턴값 :
	***********************************************************************/
	function gfnJoinEvent() {	
		
		//회원 가입 이벤트 
		$("#joinmember").click(function(){
			window.open("/gis/join", "회원 가입 ", "top=50px, left=50px, width=540px, height=570px, menubar=no, resizable=no, status=no, titlebar=no, toolbar=no, scrollbars=yes").focus();
			return false;
	    });
	}
	
function gfnPasswdEvent() {	
		
		//회원 가입 이벤트 
		$("#passreset").click(function(){
			window.open("/gis/passwdcheck", "패스워트 재설정", "top=50px, left=50px, width=540px, height=400px, menubar=no, resizable=no, status=no, titlebar=no, toolbar=no, scrollbars=yes").focus();
			return false;
	    });
	}
		
		
		
		$(document).ready(function() {
			login.init();
			gfnJoinEvent();
			gfnPasswdEvent();
		});		
	</script>
	
</body>
</html>
