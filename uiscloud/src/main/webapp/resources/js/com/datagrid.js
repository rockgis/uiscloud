/**
파일명 : datagrid.js
설명 : 하단 그리드 
*/
var datagrid = {		
	// 아이디 - 중복제거를 위해서 인덱스와 결합해서 사용
	id : "datagrid",
	
	// 기본 컬럼 정보 목록
	columns : [[
	    {field:"itemNo",checkbox:true},
	    {field:"gisNm",title:"시설물분류", width:150, halign:"center", align:"left", sortable: true},
	    {field:"unqMgno",title:"고유관리번호", width:150, halign:"center", align:"left", sortable: true},
	    {field:"fctsNm",title:"시설명", width:300, halign:"center", align:"left", sortable: true},
	    {field:"cnstMgno",title:"공사번호", width:200, halign:"center", align:"left", sortable: true},
	    {field:"lglNm",title:"법정동명", width:200, halign:"center", align:"left", sortable: true}
	]],
		
	/**********************************************************************
	설명 : 검색 결과 표시
	파라메터 : title 		- 탭에 표시할 제목
	 		tableName	- 테이블명
	 		datas		- 데이터 목록
	리턴값 :
	***********************************************************************/
	showResult : function(title, tableName, datas, newColumns, isPagination, onClickRow, onDblClickRow) {
		var that = this;
		
		if($("#div_south").css("display") == "none") 
			$("#div_layout").layout("expand", "south");
		

		var rowCnt = datas.total;
	    ++gridIdex;
		var divId = that.id + gridIdex;
		
		var newTitle = gridIdex + "." + title + "(" + gfnFormatNumber(rowCnt) + "건)";
		var content = that.createDiv(divId);
		that.createTab(newTitle, content);

		// 전달받은 컬럼목록이 있으면 사용하고 없으면 기본 컬럼 사용
		var columns = null;
		if(newColumns) {
			//columns = JSON.parse(JSON.stringify(newColumns));
			// 위에 내용으로 진행하면 datagrid 각 columns 에 적용한 formatter 와 sorter 이 먹지 않음
			columns = newColumns;
		}
		else {
			columns = that.createColumns(tableName);
		}
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
	createTab : function(title, content) {
		$("#div_bottom_tab").tabs("add",{
			title : title,
			content : content,
			closable : true
		});
		$("#div_bottom_tab").tabs("resize");
	},
	
	/**********************************************************************
	설명 : 기본 컬럼 정보 생성
	파라메터 : tableName	- 테이블명
	리턴값 :
	***********************************************************************/
	createColumns : function(tableName) {
		var that = this;
		var newColumns = JSON.parse(JSON.stringify(that.columns));
		
		if(tableName.toLowerCase() == "gotc_ca") {
			newColumns[0].push({field:"useCoreGrade",title:"코아수용율", width:100, halign:"center", align:"right", sortable: true, sorter: gfnNumberSorter});
		}
		
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
	createDatagrid : function(divId, columns, tableName, datas, isPagination, onClickRow, onDblClickRow, onRowContextMenu) {
		var height = $("#div_south").panel().height() - $("#div_bottom_tab").height();
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
	            	onClickRow(rowIndex, rowData, tableName);
	            }
	        },
	    	onDblClickRow : function(rowIndex, rowData){
	            if(onDblClickRow) {
	            	onDblClickRow(rowIndex, rowData);
	            }
	        },
	        onRowContextMenu : function(e, rowIndex, rowData) {
//	        	if(onRowContextMenu) {
//	        		onRowContextMenu(rowIndex, rowData);
//	        	} else 
	        	if (onDblClickRow) {
	        		onDblClickRow(rowIndex, rowData);
	        	}
	        	
	        	e.preventDefault();
			}
		};
		
		if(!onClickRow) {
			options.onClickRow = function(rowIndex, rowData){
				gfnGetFeatureById(prefix+tableName.toLowerCase(), [rowData.gid], true, true, true);
				var tableArrs = [{
					tableName : tableName.toUpperCase(),
					gids : [rowData.gid]
				}];
				spatialInfo.selectDetailInfo(tableArrs);
	        };
	        options.onCheck = function(rowIndex, rowData){
	        	gfnGetFeatureById(prefix+tableName.toLowerCase(), [rowData.gid], true);
	        };
	        options.onUncheck = function(rowIndex, rowData){
	        	var layer = gfnGetLayer("searchLayer");
	        	var features = layer.features;
	        	for(var i=features.length-1; i >= 0; i--) {
	        		if(features[i] && features[i].fid && features[i].fid.substr(features[i].fid.indexOf(".")+1) == rowData.gid) {
	        			layer.removeFeatures(features[i]);
	        		}
	        	}
	        };
	        options.onCheckAll = function(rows){
	        	var gids = [];
	        	for(var i in rows) {
	        		gids.push(rows[i].gid);
	        	}      	
	        	gfnGetFeatureById(prefix+tableName.toLowerCase(), gids, true);
	        };
	        options.onUncheckAll = function(rows){
	        	gfnGetLayer("searchLayer").removeAllFeatures();
	        };
		}
		
		$("#"+divId).datagrid(options);
	}
};