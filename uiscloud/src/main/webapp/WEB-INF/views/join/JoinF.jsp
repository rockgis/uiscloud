<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<!doctype html>
<html ng-app="myHairJoin">
<head>
<meta charset="utf-8">
	<title>회원가입</title>
	<script type="text/javascript" src="/resources/js/libs/angular/angular.min.js"></script>
	<link rel="stylesheet" type="text/css" href="/resources/css/libs/bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="/resources/css/join.css">
	<script type="text/javascript">

		var myHairJoin = angular.module('myHairJoin',[]);


		myHairJoin.controller('joinCtrl', function joinCtrl($scope){

			$scope.pwdMsg = "";
			
			$scope.checkPW = function(){
				if($scope.ngPwd == $scope.ngRePwd ){
					$scope.pwdMsg = "패스워드가 동일합니다.";
				}
				else{
					$scope.pwdMsg = "패스워드가 동일하지않습니다.";
				}
			};
		});

		</script>
</head>
	<body ng-controller = "joinCtrl">
		<div id="container">
      		<form class="form-join" role="form">
			
				 메일 : <input type="email" id="txtId" ng-model="ngId" class="form-control" placeholder="Email address" required autofocus>
				비밀번호 : <input type="password" id="txtPwd" ng-model="ngPwd" ng-change="checkPW()" class="form-control" placeholder="Password" required>
				비밀번호 확인 : <input type="password" id="txtPwd" ng-model="ngRePwd" ng-change="checkPW()" class="form-control" placeholder="Password Confirm" required>
				 
				 <label>{{pwdMsg}}</label>
				
				
				<button class="btn btn-lg btn-primary btn-block" type="submit" id="btnJoinMember" >회원가입 요청</button>
				
			</form>
		</div>
	</body>
</html>
