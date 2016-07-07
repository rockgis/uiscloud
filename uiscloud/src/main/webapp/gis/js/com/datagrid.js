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
		tabId  = divId;

		that.createTab(newTitle, content,tabId);
		//that.tabOption(newTitle, tabId);
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
	createTab : function(title, content,tabId) {
		$("#div_bottom_tab").tabs("add",{
			title : title,
			content : content,
			closable : true
//			id : tabId,
//			tools:[{
//				iconCls:'icon-close',
//				handler:function(){
//					var target = this;
////					onBeforeClose : function(title,index){
//			    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//			    		var tab = $('#div_bottom_tab').tabs('getSelected');
//			    		var index = $('#div_bottom_tab').tabs('getTabIndex',tab);
//
//			    		var markers = map.getLayer("Markers");
//			    		var features = tabObj[id];
//			    		var marker = aRoutingSearch.arrMarkers;
//			    		if(features) {	    			
//				    		   gfnGetLayer("searchLayer").removeFeatures(features);
//				    		   dynamicSld.layer.removeFeatures(features);
//				    		   if(gfnGetLayer("demand_layer") != null){
//				    			   gfnGetLayer("demand_layer").removeFeatures(features);
//				    		   }
//				    		   if(marker){
//				    			   for(var z=0; z < marker.length; z++){
//					    				markers.removeMarker(marker[z]);			    				
//					    			}
//				    			   aRoutingSearch.arrMarkers = [];
//					    	  }
//				    		   delete tabObj[id];
//				    	}
//			    		
//			    		if($("#div_east").css("display") != "none"){ 
//				    		$('#div_layout').layout("collapse", "east");
//				    		
//			    		}
//						$("#table_info").propertygrid("loadData", []);
//						$('#div_bottom_tab').tabs('close',index);
//			    	}
//			
//			}]
			
		});
		
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
	
	/********************************************************************
	 설명 : 데이터그리드 접속함체, 광케이블 우클릭 메뉴 이벤트(팝업 링크)
	 파라메터 : mgno     - 고유번호
	 *********************************************************************/
	createPopupLink : function (tableName, mgno) {
		
		if(tableName == "GOTC_CA") {
			//window.location.href = "http://skgis.skbroadband.com/jsp/attribute/ca/CableIdentity2.jsp?MGNO="+mgno;
			window.open("http://skgis.skbroadband.com/jsp/attribute/ca/CableIdentity2.jsp?MGNO="+mgno, "", "width=940, height=600, left=100, top=100");
		} else {
			//window.location.href = "http://skgis.skbroadband.com/jsp/link/JpBoxDetail2.jsp?FLinkJpMgno="+mgno;
			window.open("http://skgis.skbroadband.com/jsp/link/JpBoxDetail2.jsp?FLinkJpMgno="+mgno, "", "width=940, height=880, left=100, top=100");
		}
		
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
		
		var mgno; 	//접속함체, 광케이블 고유번호
		var cmenu;	// 마우스 우클릭 시 메뉴 생성 DIV
		
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

	        	e.preventDefault();
	        	if (onDblClickRow) {
	        		onDblClickRow(rowIndex, rowData);
	        	}
	        	
	        	//설명 : 데이터그리드 마우스 우클릭 메뉴 생성////////////////
	        	if(tableName == 'GOTC_CA' || tableName == 'GOTC_JP') {
	        		cmenu = $('<div/>').appendTo('body');
		        	
		        	if(tableName == 'GOTC_CA') {
		        		$('<div/>').html('GIS코아사용내역').appendTo(cmenu);
		        		mgno = rowData.caMgno;
		        	} else if(tableName == 'GOTC_JP') {
		        		$('<div/>').html('GIS접속함체선번장').appendTo(cmenu);
		        		mgno = rowData.jpMgno;
		        	}
		    		
		    		cmenu.menu({
		    			onClick: function (item) {
		    				that.createPopupLink(tableName, mgno);
		    			}
		    		});
		        	
		        	cmenu.menu('show', {
		        		left: e.pageX,
		        		top: e.pageY
		        	});
	        	}
	        	//////////////////////////////////////////////////////////////
			}
		};
		
		if(!onClickRow) {
			options.onClickRow = function(rowIndex, rowData){
//				var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//	    		console.log(id)
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
	        			console.log(features[i])
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