"use strict";

var memberlist = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	dg: $("#dg"),
	
	id : "datagrid",
	
	dg_tuser : $("#dg_tuser"),
	
	roleList : [{userRole:'915',roleName:'총괄관리자'},{userRole:'916',roleName:'지역관리자'},{userRole:'917',roleName:'지역사용자'},{userRole:'920',roleName:'BP 사용자'}],
		
	
	/**********************************************************************
	설명 : 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 	
	init: function() {
		var that = this;
		
		that.initUi();
	},
	
	/**********************************************************************
	설명 : 화면 Ui 작업 jeasyui (validatebox, datagrid)
	파라메터 :
	리턴값 :
	***********************************************************************/
	initUi: function() {
		var that = this;
		
		 that.dg.edatagrid({
             url: '/gis/memberListJson',
             updateUrl: '/gis/memberUpdate',
             destroyUrl: '/gis/memberDel'
         });
		 
		// that.searchGrid();
	
	},
	
	// 기본 컬럼 정보 목록
	gridColumns: [[
	     	      {field:"userId", title:"사용자", width:100, halign:"center", align:"left", sortable: false}
	         	, {field:"pwd",title:"패스워드", width:80, halign:"center", align:"left", sortable: false}
	         	, {field:"userName",title:"이름", width:100, halign:"center", align:"right", sortable: false}
	         	, {field:"suserRegion",title:"지역", width:100, halign:"center", align:"left", sortable: false}
	         	, {field:"suserRole",title:"권한", width:100, halign:"center", align:"left", sortable: false}
	         	, {field:"tel",title:"전화번호", width:100, halign:"center", align:"left", sortable: false}
	         	, {field:"status",title:"허가여부", width:100, halign:"center", align:"left", sortable: false}
	         	, {field:"cntId",title:"cntId", width:80, halign:"center", align:"left", sortable: false, hidden: true}
	         	, {field:"roleName",title:"roleName", width:100, halign:"center", align:"right", sortable: false, hidden: true}
	         ]],
    
	searchGrid: function() {
		var that = this;
			
		var targetUrl = "/gis/memberListJson";
				
		$.ajax({
	        type: "POST",
	        url: targetUrl,
	        data: {
	        	'totalCount': null
  	        	, 'page': 1
  	        	, 'rows': 10
	        },
	        dataType: "json",
	        contentType: "charset=UTF-8",
	        success: function(jsonData){
	    		if(jsonData.total == 0){
	    			$.messager.alert("알림", "검색결과가 없습니다.");
	    			return false;
	    		}
	    		
	    		var title = "T-BIES User 관리";
	    		
	    		var rowCnt = jsonData.total;
	    		
	    		that.showResult(title, jsonData, that.gridColumns, true);
	    		
	    	    $(dg_tuser).datagrid("getPager").pagination({
	    	    	onSelectPage : function(page, rows){
	    	    		var params = {  
	    	  	        	  'totalCount': jsonData.total
	    	  	        	, 'page': page
	    	  	        	, 'rows': rows
	    	  	        };
	    	    		
	    	    		$.post(
	    	    			  targetUrl
	    	    			, params
	    	    			, function(response) {
	    	    				if(response && response.rows) {
	    	    					// 메타데이타 목록 표시
	    	    					var data = {
	    	    						count : response.rows.length,
	    	    						rows : response.rows,
	    								total : response.total,
	    								pageSize : rows
	    	    					};
	    	    					this.gridData = data;
	    	    					// 데이터 저장
	    	    					$("#" + gridId).datagrid('loadData', data);
	    	    					// 내용을 다시 읽는다.
	    	    					$("#" + gridId).datagrid('reload');	
	    	    				    	    	    					
//	    	    					$("#" + gridId).pagination({
//	    								total : response.total,
//	    								pageSize : rows
//	    							});	
	    	    				} else {
	    	    					alert("요청에 실패했습니다.");
	    	    				}
	    	    			}
	    	    			, "json"
	    	    		);
//	    	    	
	            	}
	    	    });
	        }
	    });
	},
		
	/**********************************************************************
	설명 : 검색 결과 표시
	파라메터 : title 		- 탭에 표시할 제목
	 		tableName	- 테이블명
	 		datas		- 데이터 목록
	리턴값 :
	***********************************************************************/
	showResult : function(title, datas, newColumns, isPagination, onClickRow, onDblClickRow) {
		var that = this;
		
		var rowCnt = datas.total;		

		// 전달받은 컬럼목록이 있으면 사용하고 없으면 기본 컬럼 사용
		var columns = null;
		if(newColumns) {
			//columns = JSON.parse(JSON.stringify(newColumns));
			// 위에 내용으로 진행하면 datagrid 각 columns 에 적용한 formatter 와 sorter 이 먹지 않음
			columns = newColumns;
		}
	
		that.createDatagrid(dg_tuser, columns, datas, isPagination, onClickRow, onDblClickRow);
		
	},
	

	/**********************************************************************
	설명 : 기본 컬럼 정보 생성
	파라메터 : tableName	- 테이블명
	리턴값 :
	***********************************************************************/
	createColumns : function(tableName) {
		var that = this;
		var newColumns = JSON.parse(JSON.stringify(that.columns));
		
		return newColumns;
	},
	
	
	/**********************************************************************
	설명 : 데이터그리드 생성
	파라메터 : divId 		- div 아이디
			columns		- 컬럼 정보 목록
			tableName	- 테이블명
			datas		- 데이터 목록
	리턴값 :
	***********************************************************************/
	createDatagrid : function(divId, columns, datas, isPagination, height, onClickRow, onDblClickRow) {
		
		var options = {
			columns : columns,
			data : datas,
	        fitColumns: true,
			height : height,
			singleSelect : true,
			selectOnCheck : false,
			checkOnSelect : false,
			remoteSort : false,
			autoRowHeight : false,			
	        //pagination: false,	        
			pagination : isPagination,
			onClickRow : function(rowIndex, rowData){
	            if(onClickRow) {
	            	onClickRow(rowIndex, rowData);
	            }
	        },
	    	onDblClickRow : function(rowIndex, rowData){
	            if(onDblClickRow) {
	            	onDblClickRow(rowIndex, rowData);
	            }
	        },
	        onRowContextMenu : function(e, rowIndex, rowData) {
	        	if(onDblClickRow) {
	        		onDblClickRow(rowIndex, rowData);
	        	}
			}
		};
		
		
		
		$(divId).datagrid(options);
	}
	
	
	
};