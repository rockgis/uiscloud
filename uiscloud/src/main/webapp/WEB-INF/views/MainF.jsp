<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
    <%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta charset="utf-8">
	<title>UISCLOUD  Map API</title>
	<link rel="stylesheet" type="text/css" href="/webjars/bootstrap/3.3.2-1/css/bootstrap.min.css">
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
          <a class="navbar-brand" href="#">UISCLOUD Map API Project</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <form class="navbar-form navbar-right" role="form">
            <div class="form-group">
              <input type="text" placeholder="Email" class="form-control">
            </div>
            <div class="form-group">
              <input type="password" placeholder="Password" class="form-control">
            </div>
            <button type="submit" class="btn btn-default">로그인</button>
          </form>
        </div><!--/.navbar-collapse -->
      </div>
    </nav>

    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron">
      <div class="container">
        <h1>UISCLOUD Map API</h1>
        <p>Open Layer 3.2.0 기반의 Map FrameWork
        </p>
        <p><a class="btn btn-primary btn-lg" href="/map.uis" role="button">Start &raquo;</a></p>
      </div>
    </div>

    <div class="container">
      <!-- Example row of columns -->
      <div class="row">
        <div class="col-md-4">
          <h2>Openalyer 3.2.0 Example</h2>
          <p>Openlyers 3.2.0 기반의 예제 (Openlyers.org Site) </p>
          <p><a class="btn btn-default" href="/ol3Example/exampleList" role="button">View Example &raquo;</a></p>
        </div>
        <div class="col-md-4">
          <h2>Openalyer 3.2.0 Apidoc</h2>
          <p> Openalyer 3.2.0 기반의 OpenLayers 3 API Documentation </p>
          <p><a class="btn btn-default" href="/lib/v3.2.0/apidoc/index.html" role="button">View APIDoc &raquo;</a></p>
       </div>
        <div class="col-md-4">
          <h2><spring:message code="test.test" /></h2>
          <p></p>
          <p><a class="btn btn-default" href="/openmap.uis" role="button">View details &raquo;</a></p>
        </div>
      </div>

      <hr>

      <footer>
        <p>&copy; Company 2015 UISCLOUD Co., Ltd</p>
      </footer>
    </div> <!-- /container -->
	
	
    <script type="text/javascript" src="/webjars/jquery/2.1.3/jquery.min.js"></script>
	<script type="text/javascript" src="/webjars/bootstrap/3.3.2-1/js/bootstrap.min.js"></script>
	
</body>
</html>

