
//***********************************************
//상단-함체접속정보
//***********************************************
var jpAccessList = {
	// 엔터키 코드
	KEY_ENTER: 13
	
	, init : function(){
		var that = this;
		
		that.initUI();
	}	
	, initUI : function(){
		var that = this;
		

		// DataGrid  초기화
		$('#jpAccessList .gridJpAccessList').datagrid({
		    columns:[[
					   {field : 'rownum', title : '번호'}
					   , {field : 'ltLineMgno', title : '접속케이블▶'}
					   , {field : 'ltBoxNm', title : '접속함체 및 연결 정보'}
					   , {field : 'rtLineMgno', title : '◀접속케이블'}
	        ]]
			, singleSelect : true
			, fitColumns : true
			, pagination : true
			, onDblClickRow : function(rowIndex, rowData){
	        }
		});
		
		// 페이징 설정
		$('#jpAccessList .gridJpAccessList').datagrid("getPager").pagination({
		  pageSize: gridInit.pagingOptions.pageSize,
	      pageList : gridInit.pagingOptions.pageSizes,
	      displayMsg : "{from}-{to} / {total}",
	      onSelectPage : function(page, rows) {
	    	  that.searchjpAccessList(page, rows);
	      }
	   });
		that.searchjpAccessList();
	}
	, searchjpAccessList : function(cPage,pSize){
		var that = this;

		var searchFilters = {
				searchKeyword : $("#jpMgno").val()
				, pageSize : null
				, currentPage : null 
		};
		
		if(cPage && pSize){
			searchFilters.currentPage = cPage;
			searchFilters.pageSize = pSize;
		}else{
			searchFilters.pageSize = gridInit.pagingOptions.pageSize;
			searchFilters.currentPage = gridInit.pagingOptions.currentPage;
		}
		
		 $.get(
	        	"/titan/jpManage/selectJpAccessList"
				, searchFilters
	        	,function(response) {
	        		if(response && response.result) {
	        			var resObj = {};
	    				resObj.rows = response.result;
	    				resObj.total = response.totalCnt;
	    				
	    				if(response.totalCnt > 0){
	    					$("#jpAccessList .gridJpAccessList").datagrid("loadData", resObj);
	    				}else{
	    					alert("검색된 결과가 없습니다.");
	    					return;
	    				}
	        		}
	        		else {
	        			alert("searchJpList error code");
	        		}
	        	},
	        	"json"
	    );
	}
	//staticJpMgno
};



