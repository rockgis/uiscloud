<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<!doctype html>
<html ng-app="myHairJoin">
<head>
<meta charset="utf-8">
	<title>ȸ������</title>
	<script type="text/javascript" src="/resources/js/libs/angular/angular.min.js"></script>
	<link rel="stylesheet" type="text/css" href="/resources/css/libs/bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="/resources/css/join.css">
	<script type="text/javascript">

		var myHairJoin = angular.module('myHairJoin',[]);


		myHairJoin.controller('joinCtrl', function joinCtrl($scope){

			$scope.pwdMsg = "";
			
			$scope.checkPW = function(){
				if($scope.ngPwd == $scope.ngRePwd ){
					$scope.pwdMsg = "�н����尡 �����մϴ�.";
				}
				else{
					$scope.pwdMsg = "�н����尡 ���������ʽ��ϴ�.";
				}
			};
		});

		</script>
</head>
	<body ng-controller = "joinCtrl">
		<div id="container">
      		<form class="form-join" role="form">
			
				 ���� : <input type="email" id="txtId" ng-model="ngId" class="form-control" placeholder="Email address" required autofocus>
				��й�ȣ : <input type="password" id="txtPwd" ng-model="ngPwd" ng-change="checkPW()" class="form-control" placeholder="Password" required>
				��й�ȣ Ȯ�� : <input type="password" id="txtPwd" ng-model="ngRePwd" ng-change="checkPW()" class="form-control" placeholder="Password Confirm" required>
				 
				 <label>{{pwdMsg}}</label>
				
				
				<button class="btn btn-lg btn-primary btn-block" type="submit" id="btnJoinMember" >ȸ������ ��û</button>
				
			</form>
		</div>
	</body>
</html>
