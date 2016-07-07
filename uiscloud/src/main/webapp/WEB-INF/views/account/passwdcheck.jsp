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
<div class="easyui-panel" title="패스워드 설정 " style="width:500px">
	<div id = "passwdcheck" style="padding:5px 10px 5px 10px">
	    <form name="userCheckForm" id="userCheckForm"  method="POST" action="/gis/idcheck">
	    	<table cellpadding="1" style="width:480px">
	    		<tr>
	    			<td style="width:200px">사용자 아이디:</td>
	    			<td><input id = "userId" name="userId" class="easyui-textbox" type="text"  style="ime-mode: active;" maxlength="20" placeholder="USER ID" data-options="required:true"/></td>
	    		</tr>
	    		<tr>
	    			<td>이메일 :</td>
	    			<td>
	    			<input id= "email" name="email" class="easyui-mail" />
	    			</td>
	    		</tr>
	    	</table>
	    </form>
	    <div style="text-align:center;padding:5px">
	    	<a id="userCheckformsubmit"  href="#"><img src="/gis/images/bbs/btn_enter.png" alt="확인" /></a>
	    </div>
	  </div>
	  
	  <div id = "passwdup" style="padding:5px 10px 5px 10px">
	    <form name="userSavePassForm" id="userSaveForm"  method="POST" action="/gis/passwdreset">
	    	<table cellpadding="1" style="width:480px">
	    		<tr>
	    			<td>패스워드:</td>
	    			<td><input id= "pwd" name="pwd"  class="easyui-textbox" style="ime-mode: active;" type="password"  maxlength="20" placeholder="PASSWORD" data-options="required:true"/></td>
	    		</tr>
	    		<tr>
	    			<td>패스워드 확인:</td>
	    			<td><input id= "repassword" name="repassword" class="easyui-textbox" style="ime-mode: active;" type="password"  maxlength="20" placeholder="RE-PASSWORD" data-options="required:true" /></td>
	    		</tr>
                </td>
	    		</tr>
	    	</table>
	    	<input id= "cntId" name="cntId" type="hidden"  value="<c:out value='${cntId}'/>"/>
	    </form>
	    <div style="text-align:center;padding:5px">
	    	<a id="userSavePassformsubmit"  href="#"><img src="/gis/images/bbs/btn_enter.png" alt="등록" /></a>
	    </div>
	  </div>
</div>


    
    <!-- jquery & easy ui -->
	<script type="text/javascript" src="<c:url value='/gis/js/bbs/common.js'/>"></script>
	<script type="text/javascript" src="<c:url value='/gis/lib/jquery/jquery-1.7.2.js'/>"></script>
		
	<script type="text/javascript" src="<c:url value='/gis/js/bbs/ajaxUtil.js'/>"></script>
	<script type="text/javascript" src="<c:url value='/gis/js/bbs/tools.js'/>"></script>
	<script type="text/javascript" src="/gis/lib/jquery/easyui/jquery.easyui.min.js"></script>
    
	<script type="text/javascript" src="/gis/js/com/util.js"></script>
	<script type="text/javascript" src="/gis/js/login/passwdsave.js"></script>

	
	
	
	<script>
	
	/**********************************************************************
	설명 : 회원 가입 이벤트 연결 
	파라메터 :
	리턴값 :
	***********************************************************************/
		
		$(document).ready(function() {
			passwdsave.init();
			
			var id = "<c:out value='${cntId}'/>";
			
			if(id > 0 ){
				$("#passwdup").show();
				$("#passwdcheck").hide();
				
			}else{
				$("#passwdup").hide();
			}
				
			
		});
			
			
	</script>
		
</body>
</html>