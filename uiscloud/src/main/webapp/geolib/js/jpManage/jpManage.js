var jpManage = {
	// 엔터키 코드
	KEY_ENTER: 13
	
	, init : function(){
		var that = this;
		
		that.initUI();
	}	
	, initUI : function(){
		var that = this;
		

		// DataGrid  초기화
		$('#jpManage .gridJpManage').datagrid({
		    columns:[[
					   {field : 'rownum', title : '순번'}
					   , {field : 'boxSno', title : '함체번호'}
					   , {field : 'boxNm', title : '함체명'}
					   , {field : 'boxCapa', title : '함체용량'}
					   , {field : 'boxType', title : '함체종류'}
		               , {field : 'mnftCom', title : '제조회사코드', hidden:true}
		               , {field : 'mnftComNm', title : '제조회사'}
					  , {field : 'boxStsCd', title : '함체구분코드', hidden:true}
					  , {field : 'boxStsCdNm', title : '함체구분'}
					  , {field : 'boxShapeInd', title : '함체상태코드', hidden:true}
					  , {field : 'boxShapeIndNm', title : '함체상태'}
					  , {field : 'boxBadStsCd', title : '불량상태코드', hidden:true}
					  , {field : 'boxBadStsCdNm', title : '불량상태'}
					  , {field : 'compDt', title : '시설연도(date)', hidden:true}
					  , {field : 'compDtS', title : '시설연도'}
					  , {field : 'gboxYn', title : '그린함체'}
					  , {field : 'gboxOprNm', title : '현장작업자'}
					  , {field : 'gboxDt', title : '현장작업 완료일(date)', hidden:true}
					  , {field : 'gboxDtS', title : '현장작업 완료일'}
	        ]]
			, singleSelect : true
			, fitColumns : true
			, pagination : true
			, onDblClickRow : function(rowIndex, rowData){
				
	        }
		});
		// 페이징 설정
		$('#jpManage .gridJpManage').datagrid("getPager").pagination({
		  pageSize: gridInit.pagingOptions.pageSize,
	      pageList : gridInit.pagingOptions.pageSizes,
	      displayMsg : "{from}-{to} / {total}",
	      onSelectPage : function(page, rows) {
	    	  that.searchJpList(page, rows);
	      }
	   });
		
		that.searchJpList();
	}	
	
	, searchJpList : function(cPage,pSize){
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
	        	"/titan/jpManage/selectJpManageList"
				, searchFilters
	        	,function(response) {
	        		if(response && response.result) {
	        			var resObj = {};
	    				resObj.rows = response.result;
	    				resObj.total = response.totalCnt;
	    				
	    				if(response.totalCnt > 0){
	    					$("#jpManage .gridJpManage").datagrid("loadData", resObj);
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



