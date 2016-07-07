"use strict";

var ring = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 검색 구분
	searchType: $("#frmMapInfoRing input:radio[name='searchType']"),
	// 링 종류
	ringKind: $("#frmMapInfoRing .ringKind"),		
	// 링 종류
	ringName: $("#frmMapInfoRing .ringName"),	
	// 시도 ComboBox
	sidoComboBox: $("#frmMapInfoRing .sidoComboBox"),
	// 시군구 ComboBox
	sggComboBox: $("#frmMapInfoRing .sggComboBox"),
	// 읍면동 ComboBox
	emdComboBox: $("#frmMapInfoRing .emdComboBox"),
	// 리 ComboBox
	liComboBox: $("#frmMapInfoRing .liComboBox"),	
	
	ringHwKind: $("#frmMapInfoRing .ringHwKind"),		
	
	headOffice: $("#frmMapInfoRing .headOffice"),		
	
	searchButton: $("#frmMapInfoRing .search"),
	
	resetButton: $("#frmMapInfoRing .reset"),
	
	// 검색결과 도형 목록
	features : {},
	netNos : [],
	
	/**********************************************************************
	설명 : 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 	
	init: function() {
		var that = this;
		
		that.initUi();
		that.bindEvents();
	},
	
	/**********************************************************************
	설명 : 화면 Ui 작업 jeasyui (validatebox, datagrid)
	파라메터 :
	리턴값 :
	***********************************************************************/
	initUi: function() {
		var that = this;
		
		// 시설명 10글자 제한
		that.ringName.validatebox({
			validType : ["maxLength[20]"],
			tipPosition : "right"
		});
		
		// 링 종류 combobox 초기화
		that.initRingKindComboBox();
		
		// 시도 & 시군구 & 읍면동 combobox 들 초기화
		that.initAddressComboBoxes();
		
		//본부 combobox초기화
		that.initheadOfficeComboBoxes();
		
		//링장비종류 combobox초기화
		that.initRingHwKindComboBox();
	},
	
	/**********************************************************************
	설명 : 시도 & 시군구 & 읍면동 combobox 들 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initAddressComboBoxes: function() {
		var that = this;
		
		setAddressComboBoxes(that.sidoComboBox, that.sggComboBox, that.emdComboBox, that.liComboBox);
	},
		
	/**********************************************************************
	설명 : 링 종류 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initRingKindComboBox: function() {
		var that = this;
		
		// 32: 링생성경로
		// Bitwise And Filter: 32	
		$.get("/gis/mapInfo/selectFacilityKindBySearchRequiredFieldsTypes?searchRequiredFieldsTypes=32", function(response) {
			if (response && response.result) {
				that.ringKind.combobox({
					data : response.result,
					valueField : 'layerTreePkAndSearchRequiredFieldsType',
					textField : 'korName',
//					groupField : 'groupName',
					editable : false,
//					groupFormatter: function(group){
//						return '<span style="color:red">' + group + '</span>';
//					}, 
//					formatter: function(row){
//						var opts = $(this).combobox('options');
//						return '<span style="margin-left: 15px;">' + row[opts.textField] + '</span>';
//						
////						var imageFile = '/gis/images/geoserver/' + row.symbolizer + '.png';
////						return '<span style="margin-left: 15px;"><img src="' + imageFile + '" />' + row[opts.textField] + '</span>';
//					}
				});
			} else {
				$.messager.alert("알림", "error code");
			}
		}, "json");
	},
	
	/**********************************************************************
	설명 : 링 장비 종류 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initRingHwKindComboBox: function() {
		var that = this;
		
		// 32: 링생성경로
		// Bitwise And Filter: 32	
		$.get("/gis/ring/selectRingHwKind", function(response) {
			if (response && response.result) {
				that.ringHwKind.combobox({
					data : response.result,
					valueField : 'netHwType',
					textField : 'netHwTypeName',

					editable : false,

				});
			} else {
				$.messager.alert("알림", "error code");
			}
		}, "json");
	},
	
	/**********************************************************************
	설명 : 본부 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initheadOfficeComboBoxes: function() {
		var that = this;
		//본부
		$.get("/gis/bookmark/regionList", function(response) {
			if (response && response.result) {
				that.headOffice.combobox({
					data : response.result,
					valueField : 'regionCode',
					textField : 'regionName',
					editable : false,
					formatter: function(row){
						var opts = $(this).combobox('options');
						return '<span style="margin-left: 15px;">' + row[opts.textField] + '</span>';
						
//						var imageFile = '/gis/images/geoserver/' + row.symbolizer + '.png';
//						return '<span style="margin-left: 15px;"><img src="' + imageFile + '" />' + row[opts.textField] + '</span>';
					}
				});
			} else {
				$.messager.alert("알림", "error code");
			}
		}, "json");
	},
	
	/**********************************************************************
	설명 : 왼쪽메뉴 - 레이어 기능 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
		that.searchType.change(function() {
			var searchType = $("#frmMapInfoRing input:radio[name='searchType']:checked").val();
			
			if(searchType == "area") {
				$("#frmMapInfoRing .li_name").hide();
				$("#frmMapInfoRing .li_area").show();
			}
			else {
				$("#frmMapInfoRing .li_name").show();
				$("#frmMapInfoRing .li_area").hide();
			}
		});
		
		// 검색
		that.searchButton.click(function() {
			that.search();
		});
		
		// 초기화 
		that.resetButton.click(function() {
			that.reset();
		});
	},
	
	/**********************************************************************
	설명 : 검색
	파라메터 :
	리턴값 :
	***********************************************************************/
	search: function() {
		var that = this;
		
		var searchType = $("#frmMapInfoRing input:radio[name='searchType']:checked").val();
		
		var data = null;
		
		if(data == false) {
			return;
		}
		
		var layerTreePkAndSearchRequiredFieldsType = [0, 0];
		
		if(that.ringKind.combobox('getValue')) {
			layerTreePkAndSearchRequiredFieldsType = that.ringKind.combobox('getValue').split(",");
		}
		
		var layerTreePk = layerTreePkAndSearchRequiredFieldsType[0];
		var searchRequiredFieldsType = layerTreePkAndSearchRequiredFieldsType[1];	
		
		//링장비 종류
		var ringHwType = that.ringHwKind.combobox('getValue');
		//본부
		var office = that.headOffice.combobox('getValue');
		
		
		if(layerTreePk === 0){
			$.messager.alert("알림", "링 종류를 선택해 주세요.");
			return false;
		}

		if(searchType == "area") {
			var lglCd = that.getSearchPnu();
			
			if(lglCd == false) {
				return;
			}

			data = {
		      	  'layerTreePk': layerTreePk
		      	, 'lglCd' : lglCd
		      	, 'ringHwType' : ringHwType
		      	, 'headOffice' : office
				, 'totalCount': 0
				, 'page': 1
				, 'rows': 10 
	        };
		}
		else {
			var ringName = that.getRingName(searchRequiredFieldsType);
			
			if(ringName == false) {
				return;
			}
						
			data = {
		      	  'layerTreePk': layerTreePk
		      	, 'ringName': ringName
		      	, 'ringHwType' : ringHwType
		      	, 'headOffice' : office
		      	, 'totalCount': 0
	        	, 'page': 1
	        	, 'rows': 10
	      };
		}	
		
		var targetUrl = "/gis/ring/search";
    	var id = "ringSearch";
//		var title = "지도정보 검색";
    	var title = that.ringKind.combobox('getText');
		var gridId = "";
				
		$.ajax({
	        type: "GET",
	        url: targetUrl,
	        data: data,
	        dataType: "json",
	        contentType: "charset=UTF-8",
	        success: function(jsonData){
	    		if(jsonData.total == 0){
	    			$.messager.alert("알림", "검색결과가 없습니다.");
	    			return false;
	    		}
	    		
	    		var tableName = "";
	    		var facDatas = that.ringKind.combobox('getData');
	    		for(var i in facDatas) {
	    			if(facDatas[i].layerTreePk == layerTreePk) {
	    				tableName = facDatas[i].layerName;
	    				tableName = tableName.substr(tableName.indexOf(":") + 1);
	    				break;
	    			}
	    		}
	    		
	    		gridId = that.addDatagridTab(id, "검색-"+title, true, jsonData);	    		
	    		tabId  = gridId;
//	    		$("#" + gridId).datagrid("getPager").pagination({
//
//	    	    	buttons: [{
//						iconCls: 'icon-excel',
//						handler: function() {
//							var message = "";
//							
//							message += "링 종류(레이어 트리 PK): " + layerTreePk;
//							message += "\n링명: " + ringName;
//							
//							//alert(message);
//							
//							var url = targetUrl + "DownloadExcel?";
//							url += 'layerTreePk=' + layerTreePk;
//
//							if(searchType == "area") {
//								url += '&lglCd=' + lglCd;
//							} else {
//								url += '&ringName=' + ringName;
//							}
//							
//							$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
//							$("#frm_file_download").attr("action", url);
//							$("#frm_file_download").submit();	
//						}
//	    	    	}],
//	    	    	onSelectPage : function(page, rows){
//	    	    		var params = null;
//	    	    		if(searchType == "area") {
//	    	    			var lglCd = that.getSearchPnu();
//		    	    		params = {
//		    	  	        	  'layerTreePk': layerTreePk
//		    	  	        	, 'ringName': ringName
//		    	  	        	, 'lglCd' : lglCd
//		    			      	, 'ringHwType' : ringHwType
//		    			      	, 'headOffice' : office
//		    	  	        	, 'totalCount': jsonData.total
//		    	  	        	, 'page': page
//		    	  	        	, 'rows': rows
//		    	  	        };
//	    	    		}
//	    	    		else{
//	    	    			params = {
//	  	    	  	        	  'layerTreePk': layerTreePk
//	  	    	  	        	, 'ringName': ringName
//	  	    	  	            , 'ringHwType' : ringHwType
//	    			      	    , 'headOffice' : office
//	  	    	  	        	, 'totalCount': jsonData.total
//	  	    	  	        	, 'page': page
//	  	    	  	        	, 'rows': rows
//	  	    	  	        };
//	    	    		}
//	    	    		$.post(
//	    	    			  targetUrl
//	    	    			, params
//	    	    			, function(response) {
//	    	    				if(response && response.rows) {
//	    	    					that.getFeatures(tableName, response);
//	    	    					
//	    	    					// 메타데이타 목록 표시
//	    	    					var data = {
//	    	    						count : response.rows.length,
//	    	    						rows : response.rows,
//	    								total : response.total,
//	    								pageSize : rows
//	    	    					};
//	    	    					this.gridData = data;
//	    	    					// 데이터 저장
//	    	    					$("#" + gridId).datagrid('loadData', data);
//	    	    					// 내용을 다시 읽는다.
//	    	    					$("#" + gridId).datagrid('reload');	
//	    	    				} else {
//	    	    					$.messager.alert("알림", "요청에 실패했습니다.");
//	    	    				}
//	    	    			}
//	    	    			, "json"
//	    	    		);
//	            	}
//	    	    });
            	
	        }
	    });		
	},
	
	getSearchPnu: function() {		
		var that = this;
		
		var sidoLglCd = that.sidoComboBox.combobox('getValue') || 0;
		var sggLglCd = that.sggComboBox.combobox('getValue') || 0;
		var emdlLglCd = that.emdComboBox.combobox('getValue') || 0;
		var lglCd = "";
		
		if(emdlLglCd !== 0) {
			lglCd = emdlLglCd;
		} else if(sggLglCd !== 0) {
			lglCd = sggLglCd;
		} else if(sidoLglCd !== 0){
			lglCd = sidoLglCd;
		}
		
		if(lglCd === "") {				
			$.messager.alert("알림", "시도를 선택해 주세요.");
			return false;
		}
//		} else if(lglCd.length === 2) {
//			$.messager.alert("알림", "시군구를 선택해 주세요.");
//			return false;
//		} else if(lglCd.length === 5 || lglCd.length === 8 || lglCd.length === 10) {
//			// 통과, PASS, GOOD JOB
//		} else {
//			$.messager.alert("알림", "시도, 시군구를 선택해 주세요.");
//			return false;
//		} 
		
		return lglCd;
	},
	
	getRingName: function(searchRequiredFieldsType) {
		var that = this;
		
		// 링명
		var ringName = that.ringName.val();
		
		if((searchRequiredFieldsType & 32) > 0) {
		// 32: 링생성경로
			if(ringName.trim().length < 2 || ringName.trim().length === 0) {
				$.messager.alert("알림", "링명을 2자 이상 입력해 주세요.");
				return false;
			}
		}
		
		return ringName;
	},
	
//	getFeatures : function(tableName, jsonData) {
//		var that = this;
//		
//		var netNos = [];
//		for(var i=0, len=jsonData.length; i < len; i++) {
//			netNos.push(jsonData[i]["netNo"]);
//		} 
//		//dynamicSld.showResult(prefix+tableName.toLowerCase(), netNos);
//		var attr = dynamicSld.getSldLine();	
//		var attrUngr = dynamicSld.getSldLineUngr();	
//
//		gfnGetFeatureByEquals(prefix+tableName.toLowerCase(), "net_no", netNos,  false, false, false, function(response) {
//			var features = {};
//			for(var i in response.features) {
//				var attrs = response.features[i].attributes;				
//				var netNo = attrs["net_no"];
//				if(!features[netNo]) {
//					features[netNo] = [];
//				}				
//				var ungrLoc = attrs["ungr_loc"];
//
//				if(ungrLoc == "D") {
//
//					attrs.strokeColor = attrUngr.strokeColor;
//					attrs.strokeDashstyle = attrUngr.strokeDashstyle;
//					attrs.strokeWidth = attrUngr.strokeWidth;
//					attrs.strokeOpacity = attrUngr.strokeOpacity;
//				}
//				else{
//					attrs.strokeColor = attr.strokeColor;
//					attrs.strokeDashstyle = attr.strokeDashstyle;
//					attrs.strokeWidth = attr.strokeWidth;
//					attrs.strokeOpacity = attr.strokeOpacity;
//				}
//				features[netNo].push(response.features[i].clone());
//			}
//			
//			for(var netNo in features) {
//				if(!that.features[netNo]) {
//					that.features[netNo] = features[netNo];
//				}
//			}
//		});
//	},
	getFeatures : function(tableName, jsonData) {
		var that = this;
		
		//var netNos = [];
		for(var i=0, len=jsonData.length; i < len; i++) {
			that.netNos.push(jsonData[i]["netNo"]);
		}
		
		//dynamicSld.showResult(prefix+tableName.toLowerCase(), netNos);
		var attr = dynamicSld.getSldLine();
		

		gfnGetFeatureByEquals(prefix+tableName.toLowerCase(), "net_no", that.netNos,  false, false, false, function(response) {
			for(var i in response.features) {
				var attrs = response.features[i].attributes;				
				var ungrLoc = attrs["ungr_loc"];
				if(ungrLoc == "D") {
					attrs.isUngr = true;
				}
			}

			dynamicSld.showFeatures(response.features);
		});
	},
	onClickRowForDatagrid: function(rowIndex, rowData, tableName, ids) {
		var that = ring;		
		var layer = gfnGetLayer("searchLayer");  
		//var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
		var features =[];
		layer.removeAllFeatures();
		var checked = $("#" + ids).datagrid('getChecked');	 

		gfnGetFeatureByEquals(prefix+tableName.toLowerCase(), "net_no", [rowData.netNo],  false, false, false, function(response) {			
			
			for(var i in response.features) {	
				
				if(response.features[i].data.net_no == rowData.netNo){
					
					var attrs = response.features[i].attributes;	
					attrs.strokeColor =  "#ffff00",
					attrs.strokeWidth = 6,
					attrs.strokeDashstyle = "solid",
					attrs.strokeOpacity = 1							
	
					features.push(response.features[i].clone());
					
				}
			}

			layer.addFeatures(features);
			layer.redraw();
			map.zoomToExtent(layer.getDataExtent());
		});

		
	},
	onCheckRowForDatagrid: function(rowIndex, rowData, tableName, ids) {
		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
		
		gfnGetFeatureByEquals(prefix+tableName.toLowerCase(), "net_no", [rowData.netNo],  false, false, false, function(response) {
			var features =[];
			for(var i in response.features) {
				var feature = response.features[i].clone();
				var attrs = feature.attributes;				
				var ungrLoc = attrs["ungr_loc"];
				if(ungrLoc == "D") {
					
					attrs.isUngr = true;
									
				}	
				
				features.push(feature);
				
			}
			
			dynamicSld.showFeatures(features, id);	
	
		});

	},
	onAllCheckRowForDatagrid: function(rows, tableName) {	

		
		var attr;	
		var netNos = [];
		for(var a in rows){
			netNos.push(rows[a].netNo);
		}
		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
		
		gfnGetFeatureByEquals(prefix+tableName.toLowerCase(), "net_no", netNos,  false, false, false, function(response) {
			var features =[];
			for(var i in response.features) {
				var feature = response.features[i].clone();
				var attrs = feature.attributes;				
				var ungrLoc = attrs["ungr_loc"];
				if(ungrLoc == "D") {
					feature.attributes = {
						isUngr : true
					};				
				
				}	
				features.push(feature);
			}
			dynamicSld.showFeatures(features, id);	

			
		});

	},
	onDblClickRowForDatagrid: function(rowIndex, rowData) {
		// 팝업창으로 K-다익스트라 세부 경로 보여주기
		var winDetailPath = window.open("", "winDetailPath", "scrollbars=no,toolbar=no,resizable=no,width=1200,height=700,left=100,top=100");
		winDetailPath.focus();
		
		$("#hid_detail").val(rowData.netNo);
		$("#frm_detailPath").attr("action", "/gis/ring/detailPath");

		$("#frm_detailPath").submit();	
	},

	showHighlight : function(caMgno) {

		var that = ring;

		var layer = gfnGetLayer("searchLayer");

		var features = layer.features;
		var featuresDeatilClick = [];

		for(var i=0, len=features.length; i < len; i++) {
			var attrs = features[i].attributes;
			
			if(attrs["ca_mgno"] == caMgno) {
				attrs.strokeColor = "#ff0000";				
			}
			else{
				attrs.strokeColor = "#ffff00";
			}
		}
		layer.redraw();
	},
	
	/**********************************************************************
	설명 : 검색창 리셋
	파라메터 :
	리턴값 :
	***********************************************************************/
	reset: function() {
		var that = this;
		
		that.ringName.val("");
		
		// easyui 콤보 박스 초기화 처리
		that.ringKind.combobox("clear");
		that.sidoComboBox.combobox("clear");
		that.sggComboBox.combobox("clear");
		that.emdComboBox.combobox("clear");
	},
	/**********************************************************************
	설명: 그리드에 Tab 추가하기
		id는 새로 부여되어 리턴되고, 타이틀도 순번이 뒤에 붙어서 나오게 된다.
	파라미터:
		id 부여할 아이디. 중복을 피하기 위해 뒤에 일련번호가 붙여져서 처리됨.
		title 탭에 표시할 타이틀. 이것도 중복을 피하기 위해 뒤에 일련번호가 붙여져서 처리됨.
		singleSelect 그리드 내에 row 다중클릭/단건클릭여부 체크
		onclickRow 그리드내에 row를 클릭할때 마다 callback으로 function을 받아 처리
	리터값: 새로 부여된 아이디
	***********************************************************************/	
	addDatagridTab: function (id, title, singleSelect, datas, onclickRow) {
		var that = this;
		
//		if(datas.rows.length == 0){
		if(datas.total == 0){
			$.messager.alert("알림", "검색결과가 없습니다.");
			return false;
		}
		
		$("#div_layout").layout("expand", "south");
		
	    var rowCnt = datas.total;

	    ++gridIdex;
	    var ids = id + gridIdex;
	    var newTitle = gridIdex + "." + title + "(" + gfnFormatNumber(rowCnt) + "건)";

//	    var resultContents = 	   
//            "<table id=\""+ids+"\"\ class=\"easyui-datagrid\"\" style=\"height:"+commonGridHeight+"px\" pagination='true'>" +
//            "<thead data-options=\"frozen:true\"><tr>" +
//            //"<th data-options=\"field:'ck',checkbox:true\"></th>" +
//            "</tr></thead>" +
//            "</table>";
	    var resultContents =  "<div id='" + ids + "' ></div>";
	    
	    $("#div_bottom_tab").tabs('add',{
	    	title : newTitle,
	    	content : resultContents,
	    	height : commonGridHeight,
			closable : true
//			id : ids,
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
//	    that.tabOption(newTitle,ids);
//	    $("#div_bottom_tab").tabs("resize");

		var layerTreePkAndSearchRequiredFieldsType = [0, 0];
		
		if(that.ringKind.combobox('getValue')) {
			layerTreePkAndSearchRequiredFieldsType = that.ringKind.combobox('getValue').split(",");
		}
		
		var layerTreePk = layerTreePkAndSearchRequiredFieldsType[0];
		var searchRequiredFieldsType = layerTreePkAndSearchRequiredFieldsType[1];	
		var tableName = "";
		var facDatas = that.ringKind.combobox('getData');
		for(var i in facDatas) {
			if(facDatas[i].layerTreePk == layerTreePk) {
				tableName = facDatas[i].layerName;
				tableName = tableName.substr(tableName.indexOf(":") + 1);
				break;
			}
		}    
	    $("#" + ids).datagrid({
	        data : datas,
	        columns : that.gridColumns,
	        singleSelect : singleSelect,
	        selectOnCheck : false,
	        checkOnSelect : false,
	        remoteSort:false,
	        autoRowHeight: false,
	        pagination : true,
	        onClickRow :function(rowIndex, rowData){    		

	        	that.onClickRowForDatagrid(rowIndex, rowData, tableName, ids);

	        },
	        onDblClickRow : function(rowIndex, rowData){
	        	var winDetailPath = window.open("", "winDetailPath", "scrollbars=no,toolbar=no,resizable=no,width=1200,height=700,left=100,top=100");
	    		winDetailPath.focus();
	    		
	    		$("#hid_detail").val(rowData.netNo);
	    		$("#frm_detailPath").attr("action", "/gis/ring/detailPath");
	    		$("#frm_detailPath").submit();	
	        },
	        onRowContextMenu : function(e, rowIndex, rowData) {

	        	var winDetailPath = window.open("", "winDetailPath", "scrollbars=no,toolbar=no,resizable=no,width=1200,height=700,left=100,top=100");
	    		winDetailPath.focus();
	    		
	    		$("#hid_detail").val(rowData.netNo);
	    		$("#frm_detailPath").attr("action", "/gis/ring/detailPath");
	    		$("#frm_detailPath").submit();	
	        	
	        	e.preventDefault();
			},
	        onCheck : function(rowIndex, rowData){
 
	        	that.onCheckRowForDatagrid(rowIndex, rowData, tableName, ids);
	        },
	        onUncheck : function(rowIndex, rowData){
	        	var layer = gfnGetLayer("sldLayer");
	        	var features = layer.features;
	        	for(var i=features.length-1; i >= 0; i--) {
	        			
	
	        			if(features[i].data.net_no == rowData.netNo) {
	        				
	        				layer.removeFeatures(features[i]);
	        			}
	        	}
	        },
	        onCheckAll : function(rows){

	        	that.onAllCheckRowForDatagrid(rows, tableName);
	        },
	        onUncheckAll : function(rows){
	        	gfnGetLayer("sldLayer").removeAllFeatures();
	        }	        
	    });
	    
	    return ids;		
	},
//	tabOption : function(title,tabId) {
//	    $("#div_bottom_tab").tabs({
//
//	    	onBeforeClose: function(title,index){
//	    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//	    		console.log(id)
//	    		var layer = gfnGetLayer("searchLayer");
//	    		var features = tabObj[id];
//
//	    		if(features) {
//	    		   dynamicSld.layer.removeFeatures(features);
//	    		   layer.removeFeatures(features);
//	    		   delete tabObj[id];
//	    		}
//	    	  },
//		    onSelect : function(title,index){
//
//		    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//		    		if($("#"+id).datagrid()){
//		    		 $("#"+id).datagrid("reload");
//		    		}
//		    	}
//	    });
//		$("#div_bottom_tab").tabs("select",title);
//	},
	// 검색 부분 그리드 컬럼 정의
	gridColumns: [[
	      {field:"ck",checkbox:true}      
	    , {field:"netTypeName",title:"링종류", width:150, halign:"center", align:"left", sortable: true}
       	, {field:"netNo", title:"링번호", width:150, halign:"center", align:"left", sortable: true}
    	, {field:"netNm",title:"링명", width:150, halign:"center", align:"left", sortable: true}
    	, {field:"netHwTypeName",title:"링장비종류", width:120, halign:"center", align:"left", sortable: true}
    	, {field:"headOfficeName",title:"본부명", width:120, halign:"center", align:"left", sortable: true}
    	, {field:"countCable",title:"참여 케이블 갯수", width:100, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	, {field:"countTpo",title:"참여 국소수", width:100, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	, {field:"sumLengthSKTA",title:"SKT 가공", width:100, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	, {field:"sumLengthSKTD",title:"SKT 지중", width:100, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	, {field:"sumLengthSKBA",title:"SKB 가공", width:100, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	, {field:"sumLengthSKBD",title:"SKB 지중", width:100, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	, {field:"sumCoreringLen",title:"코어링 추정", width:100, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	, {field:"sumCopoleLen",title:"동일 전주 추정", width:100, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    ]]
};