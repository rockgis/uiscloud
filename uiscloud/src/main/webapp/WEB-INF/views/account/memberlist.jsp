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
   <link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/color.css">
    <link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/demo/demo.css">

</head>
<body>
		
		<table id="dg" title=" T-BIES Users 관리" style="width:750px;height:400px"
            toolbar="#toolbar" pagination="true" idField="cntId"
            rownumbers="true" fitColumns="true" sortOrder="asc" singleSelect="true">
        <thead>
            <tr>
                <th field="cntId" hidden="true" >cntId</th>     
                <th field="userId" width="50">User ID</th>
                <th field="pwd" width="50">pwd</th>
                <th field="userName">이름</th>
                <th field="suserRegion" sortable="true" width="50">지역</th>       
                <th field="suserRole" sortable="true" width="50">권한</th>
                <th field="email" width="60">e-mail</th> 
                <th field="roleName" sortable="true" width="50" hidden="true">roleName</th>
                <th field="status" width="30" sortable="true" editor="{type:'validatebox',options:{required:true}}">상태</th>
            </tr>
        </thead>
    </table>
    
    <div id="toolbar">
        <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-remove" plain="true" onclick="javascript:$('#dg').edatagrid('destroyRow')">Destroy</a>
        <!-- a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-save" plain="true" onclick="javascript:$('#dg').edatagrid('saveRow')">Save</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" iconCls="icon-undo" plain="true" onclick="javascript:$('#dg').edatagrid('cancelRow')">Cancel</a> -->
    </div>
    
    <table id="dg_tuser"  style="width:750px;height:400px">
       
    </table>
	
	<!-- jquery & easy ui -->
	<script type="text/javascript" src="/gis/lib/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="/gis/lib/jquery/easyui/jquery.easyui.min.js"></script>	
	<script type="text/javascript" src="/gis/lib/jquery/edatagrid/jquery.edatagrid.js"></script>
	<script type="text/javascript" src="/gis/js/com/util.js"></script>
	<script type="text/javascript" src="/gis/js/login/login.js"></script>
	<script type="text/javascript" src="/gis/js/login/memberlist.js"></script>
	
	<script type="text/javascript">
    
    $(document).ready(function() {
    	memberlist.initUi();
	});
    </script>

</body>
</html>