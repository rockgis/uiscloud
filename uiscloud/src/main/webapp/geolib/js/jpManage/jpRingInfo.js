
//***********************************************
//하단-함체별 링정보
//***********************************************
var jpRingInfo = {
		columns : [[
		              { field : 'boxNm', title : '함체명' }
					    , { field : 'caMgno', title : '케이블번호' , hidden : true}
					    , { field : 'skMgno', title : '케이블관리번호' }
					    , { field : 'fctsNm', title : '케이블명' }
					    , { field : 'coreInfo', title : '코어번호' }
					    , { field : 'refRingNo', title : '링번호' }
					    , { field : 'ringNm', title : '링 명' }
					    , { field : 'ringRegYn', title : '링 등록여부' }
					    , { field : 'ringMgno', title : '링번호'  , hidden : true}
					    , { field : 'ringFctsNm', title : '광가입자국명' }
		        ]]

		, init : function(){
			var that = this;
			
			that.initUI();
		}	
		, initUI : function(){
			var that = this;
			

			// DataGrid  초기화
			$('#jpRingInfo .gridJpRingInfo').datagrid({
			    columns: that.columns
				, singleSelect : true
				, fitColumns : true
				, pagination : true
				, onDblClickRow : function(rowIndex, rowData){
		        }
			});
			
			// 페이징 설정
			$('#jpRingInfo .gridJpRingInfo').datagrid("getPager").pagination({
			  pageSize: gridInit.pagingOptions.pageSize,
		      pageList : gridInit.pagingOptions.pageSizes,
		      displayMsg : "{from}-{to} / {total}",
		      onSelectPage : function(page, rows) {
		    	  that.searchJpRingInfoList(page, rows);
		      }
		   });
			that.searchJpRingInfoList();
		}	
		, searchJpRingInfoList : function(cPage,pSize){
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
		        	"/titan/jpManage/selectJpRingInfoList"
					, searchFilters
		        	,function(response) {
		        		if(response && response.result) {
		        			var resObj = {};
		    				resObj.rows = response.result;
		    				resObj.total = response.totalCnt;

		    				if(response.totalCnt > 0){
		    					$('#jpRingInfo .gridJpRingInfo').datagrid("loadData", resObj);
		    				}else{
		    					alert("검색된 결과가 없습니다.");
		    					return;
		    				}
		        		}
		        		else {
		        			alert("searchJpRingInfoList error code");
		        		}
		        	},
		        	"json"
		    );
		},
		
		
		
		
		/**********************************************************************
		설명 : 검색 결과 표시
		파라메터 : title 		- 탭에 표시할 제목
		 		tableName	- 테이블명
		 		datas		- 데이터 목록
		리턴값 :
		***********************************************************************/
		showResult : function(title, tableName, datas, newColumns, isPagination, onClickRow, onDblClickRow) {
			var that = this;
			
/*			if($("#div_south").css("display") == "none") 
				$("#div_layout").layout("expand", "south");*/
			
			var divId = "박스아이디";
			
			var newTitle = "박스이름";
			var content = that.createDiv(divId);
			tabId  = divId;

			that.createTab(newTitle, content,tabId);
			
			var columns = that.columns;
			
			that.createDatagrid(divId, columns, tableName, datas, isPagination, onClickRow, onDblClickRow);
			
			return divId;
		},
		/**********************************************************************
		설명 : div 생성
		파라메터 : divId - div 아이디
		리턴값 :
		***********************************************************************/
		createDiv : function(divId) {
			return "<div id='" + divId + "' ></div>";
		},
		
		/**********************************************************************
		설명 : 탭 생성
		파라메터 : title 	- 탭 제목
				content	- 탭 내용
		리턴값 :
		***********************************************************************/
		createTab : function(title, content,tabId) {
			$('#jpRingInfo .tabJpRingInfos').tabs("add",{
				title : title,
				content : content,
				closable : true
			});
		},
		
		/**********************************************************************
		설명 : 데이터그리드 생성
		파라메터 : divId 		- div 아이디
				columns		- 컬럼 정보 목록
				tableName	- 테이블명
				datas		- 데이터 목록
		리턴값 :
		***********************************************************************/
		createDatagrid : function(divId, columns, tableName, datas, isPagination, onClickRow, onDblClickRow, onRowContextMenu) {

			var that = this;
			
			var height = 500;
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
				pagination : isPagination
			};
			$("#"+divId).datagrid(options);
		}
		
}