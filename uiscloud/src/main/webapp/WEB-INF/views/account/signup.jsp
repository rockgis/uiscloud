<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Welcome to SK BIES</title>

<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/cupertino/easyui.css">
	<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/icon.css">
	<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/demo/demo.css">
</head>
<body>
<div id="container">
		<img src="/gis/images/login/login_logo.png">
		<img src="/gis/images/login/login_img.png">
</div>
<div class="easyui-panel" title="회원가입" style="width:500px">
		<div style="padding:5px 10px 5px 10px">
	    <form name="userSaveForm" id="userSaveForm"  method="POST" action="/gis/addMember">
	    <input type=hidden name=mb_id_enabled    value="" id="mb_id_enabled">
	    	<table cellpadding="1" style="width:480px">
	    		<tr>
	    			<td style="width:140px">사용자 아이디:</td>
	    			<td><input id = "userId" name="userId" class="easyui-validatebox textbox" type="text"   maxlength="20" placeholder="USER ID" data-options="required:true" />
	    			<span id='msg_mb_id'>
	    			<br><font color="#66a2c8">※ 영문자, 숫자, _ 만 입력 가능.최소 3자이상을 입력하세요.</font></td>
	    		</tr>
	    		<tr>
	    			<td>패스워드:</td>
	    			<td><input id= "pwd" name="pwd"  class="easyui-validatebox textbox" type="password"  maxlength="16" placeholder="PASSWORD" data-options="required:true"/></span>
	    			<br><font color="#66a2c8">※ 최대 16자까지 입력하실 수 있습니다.</font></td>
	    		</tr>
	    		<tr>
	    			<td>패스워드 확인:</td>
	    			<td><input id= "repassword" name="repassword" class="easyui-validatebox textbox"  type="password"  maxlength="16" placeholder="RE-PASSWORD" data-options="required:true" /></td>
	    		</tr>
	    		<tr>
	    			<td>이름:</td>
	    			<td><input id="userName" name="userName" class="easyui-validatebox textbox"  maxlength="10" placeholder="이름" /></td>
	    		</tr>
	    		<tr>
	    			<td>사용자 지역:</td>
	    			<td>
	    			<select class="easyui-combobox" name="userRegion" id="userRegion">
			           <option value="1">본사</option>  
			          </select>
	    			</td>
	    		</tr>
	    		<tr>
	    			<td>사용자 권한:</td>
	    			<td>
	    			<select class="easyui-combobox" name="userRole" id="userRole">
			           <option value="2">사용자</option>
			           <option value="1">관리자</option>
			         </select>
	    			</td>
	    		</tr>
	    		<tr>
	    			<td>이메일 :</td>
	    			<td>
	    			<input id= "email" name="email" class="easyui-mail" />
	    			</td>
	    		</tr>
	    		<!-- 
	    		<tr>
	    			<td>헨드폰 번호 :</td>
	    			<td>
	    			<table style="width:300px">
	    			 <tr>
	    			  <td>	<select class="easyui-combobox" name="tel1" id="tel1"  style="width:100px">
			           		<option value="010">010</option>
			           		<option value="011">011</option>
			           		<option value="017">017</option>
			            	</select>
			           </td>
	    			  <td>-<input id= "tel2" name="tel2" class="easyui-numberbox" style="width:70px;" maxlength="4"  /></td>
	    			  <td>-<input id= "tel3" name="tel3" class="easyui-numberbox" style="width:70px;" maxlength="4"  /></td>
	    			</table>
                    
                    <input id= "tel" type="hidden" name="tel"/>
                     -->
	    			</td>
	    		</tr>
	    	</table>
	    </form>
	    <div style="text-align:center;padding:5px">
	    	<a id="formsubmit"  href="#"><img src="/gis/images/bbs/btn_enter.png" alt="등록" /></a>
	    </div>
	    </div>
	</div>


    
    <!-- jquery & easy ui -->
	<script type="text/javascript" src="<c:url value='/gis/js/bbs/common.js'/>"></script>
	<script type="text/javascript" src="<c:url value='/gis/lib/jquery/jquery-1.7.2.js'/>"></script>
		
	<script type="text/javascript" src="/gis/lib/jquery/easyui/jquery.easyui.min.js"></script>
    
	<script type="text/javascript" src="/gis/js/com/util.js"></script>
	<script type="text/javascript" src="/gis/js/login/usersave.js"></script>

	
	
	
	<script>
	
	/**********************************************************************
	설명 : 회원 가입 이벤트 연결 
	파라메터 :
	리턴값 :
	***********************************************************************/
		
		$(document).ready(function() {
			usersave.init();
			
			
		});
			
			
	</script>
		
</body>
</html>