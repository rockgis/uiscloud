"use strict";

var building = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 검색조건 종류 구분 - addt : 행정구역, bbox : 영역
	coverageType : $("#frmMapInfoBuilding input:radio[name='coverageType']"),
	// 시도 콤보
	sidoComboBox: $("#frmMapInfoBuilding .sidoComboBox"),		
	// 시군구 콤보
	sggComboBox: $("#frmMapInfoBuilding .sggComboBox"),	
	// 읍면동(리) 콤보
	emdComboBox: $("#frmMapInfoBuilding .emdComboBox"),
	// 대번지
	jibunbon: $("#frmMapInfoBuilding .jibunBon"),
	// 소번지
	jibunbu: $("#frmMapInfoBuilding .jibunBu"),
	// 건물명
	bdName: $("#frmMapInfoBuilding .bdName"),
	// 층수
	floorMax: $("#frmMapInfoBuilding .floorMax"),

	searchButton: $("#frmMapInfoBuilding .search"),
	
	resetButton: $("#frmMapInfoBuilding .reset"),
	
	bboxSearchButton : $("#frmMapInfoBuilding .bbox"),
	bboxClearButton : $("#frmMapInfoBuilding .bboxClear"),
	
	// 시도 리스트 테이터는 일회만 받는다.
	buildingSidoListData: undefined,	

	/**********************************************************************
	설명 : 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 	
	init: function() {
		var that = this;
		
		that.initUi();	
		that.initGis();
		that.bindEvents();
	},
	
	/**********************************************************************
	설명 : 화면 Ui 작업 jeasyui (validatebox, datagrid)
	파라메터 :
	리턴값 :
	***********************************************************************/
	initUi: function() {
		var that = this;
		
		that.setAddressComboBoxes(that.sidoComboBox, that.sggComboBox, that.emdComboBox);
		
		// 대번지 양수 제한
		that.jibunbon.validatebox({
			validType : ["positive"],
			tipPosition : "right"
		});	
		
		// 층수 양수 제한
		that.floorMax.validatebox({
			validType : ["positive"],
			tipPosition : "right"
		});
	},
	initGis : function() {
		var that = this;
		
		that.layer = new BiesVector("building");
		map.addLayer(that.layer);
		
		var control = new OpenLayers.Control.DrawFeature(that.layer, OpenLayers.Handler.Polygon, { 
			id : "building"
		});
		map.addControl(control);
		
		that.layer.events.on({
			"beforefeaturesadded" : function() {
				$("#btn_pan img").trigger("click");
				that.layer.removeAllFeatures();
				$("#div_west").focus();
			}
		});
	},
	/**********************************************************************
	설명 : 시도, 시군구, 읍면동리 콤보 초기 셋팅
	파라메터 : 
		시도 textbox id,  
		시군구 textbox id,  // 옵션
		읍면동리 textbox id,  // 옵션
	리턴값 : 
	 ***********************************************************************/
	setAddressComboBoxes: function (sidoComboBox, sggComboBox, emdComboBox) {
		var that = this;
			
		// 최초 호출이 아니면 다단계 콤보를 초기화 하지 않는다.
		// if(sidoComboBox.combobox('getValue')) return;
		
		sidoComboBox.combobox({
			editable: false
		});
		
		if(sggComboBox != null) {
			sggComboBox.combobox({
				editable: false
			});
		}
		
		if(emdComboBox != null) {
			emdComboBox.combobox({
				editable: false
			});
		}
		
		// 시도 리스트 테이터는 일회만 받는다.
		if(that.buildingSidoListData) {
			sidoComboBox.combobox({
				data: that.buildingSidoListData,
				valueField : 'pnu',
				textField : 'name',
				onSelect : function(record){
					if(sggComboBox != null) {
						that.setSggComboBox(record.pnu, sggComboBox, emdComboBox);
					}
					
					if(emdComboBox != null) {
						that.setEmdComboBox("999999999", emdComboBox);
					}
				}
			});
			
			return;
		}
		
		$.get(
			"/gis/building/selectSido",
			function(response) {
				if(response && response.result) {
					that.buildingSidoListData = response.result;

					sidoComboBox.combobox({
						data: response.result,
						valueField : 'pnu',
						textField : 'name',
						onSelect : function(record){
							if(sggComboBox != null) {
								that.setSggComboBox(record.pnu, sggComboBox, emdComboBox);
							}
							
							if(emdComboBox != null) {
								that.setEmdComboBox("999999999", emdComboBox);
							}
						}
					});
				}
				else {
					$.messager.alert("알림", "setAddressComboBoxes error code");
				}
			},
			"json"
		);
	},

	/**********************************************************************
	설명 : 시군구 콤보 조회
	파라메터 : 
		시군구코드,  
		시군구 textbox id,  
		읍면동리 textbox id,  // 옵션
		targetOption  	// 초기 선택 시군구 pnu 5 자리 옵션
	리턴값 : 
	 ***********************************************************************/
	setSggComboBox: function(pnu, sggComboBox, emdComboBox) {
		var that = this;
			
		$.get(
			"/gis/building/selectSggBySidoPnu?pnu="+pnu,
			function(response) {
				if(response && response.result) {
					sggComboBox.combobox({
						data: response.result,
						valueField : 'pnu',
						textField : 'name',
						onSelect : function(record){		
							if(emdComboBox != null) that.setEmdComboBox(record.pnu, emdComboBox);
						}
					});
				}
				else {
					$.messager.alert("알림", "error code");
				}
			},
			"json"
		);	
	},

	/**********************************************************************
	설명 : 읍면동리 콤보 조회
	파라메터 : 
		읍면동리 코드,  
		읍면동리 textbox id,
		리 textbox id,  	// 옵션
	리턴값 : 
	 ***********************************************************************/
	setEmdComboBox: function (pnu, emdComboBox) {
		var that = this;
			
		$.get(
			"/gis/building/selectEmdlBySggPnu?pnu="+pnu,
			function(response) {
				if(response && response.result) {
					emdComboBox.combobox({
						data: response.result,
						valueField : 'pnu',
						textField : 'name'
					});
				}
				else {
					$.messager.alert("알림", "error code");
				}
			},
			"json"
		);	
	},
	
	/**********************************************************************
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
		that.coverageType.change(function() {
			var coverageType = $("#frmMapInfoBuilding input:radio[name='coverageType']:checked").val();
			if(coverageType == "addt") {
				$("#frmMapInfoBuilding .li_bbox").hide();
				$("#frmMapInfoBuilding .li_addt").show();
			}
			else {
				$("#frmMapInfoBuilding .li_addt").hide();
				$("#frmMapInfoBuilding .li_bbox").show();
			}
		});
		//다각형 선택
		that.bboxSearchButton.click(function() {
			gfnActiveControl(["building"]);
		});
		
		//다각형 지우기
		that.bboxClearButton.click(function() {
			
			$("#a_serGridToolbarTabsCloseAll").trigger('click');
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
	
	checkSubmitData: function() {
		var that = this;
		var coverageType = $("#frmMapInfoBuilding input:radio[name='coverageType']:checked").val();
		var params = {};
		var searchCondition = {
				// 시도 pnu
				sidoPnu: null,
				// 시군구 pnu
				sggPnu: null,
				// 읍면동(리) pnu
				emdlPnu: null,
				// 검색 pnu
				pnu: "",
				// 대번지
				jibunbon: null,
				// 소번지
				jibunbu: null,
				// 건물명
				bdName: null,
				// 건물유형
				bdGroups: null,
				// 건물용도
				bdTypes: null,
				// 층수
				floorMax: null,
				// 층수 이상/이하 선택
				floorMaxOverUnder: null,
				'page': 1,
  	        	'rows': 10,
  	        	'totalCount': 0
			};

		searchCondition.sidoPnu = that.sidoComboBox.combobox('getValue') || 0;
		searchCondition.sggPnu = that.sggComboBox.combobox('getValue') || 0;
		searchCondition.emdlPnu = that.emdComboBox.combobox('getValue') || 0;
		searchCondition.jibunbon = that.jibunbon.val();
		searchCondition.jibunbu = that.jibunbu.val();
		searchCondition.bdName = that.bdName.val();
		searchCondition.floorMax = that.floorMax.val();
		
		if(searchCondition.emdlPnu !== 0) {
			searchCondition.pnu = searchCondition.emdlPnu;
		} else if(searchCondition.sggPnu !== 0) {
			searchCondition.pnu = searchCondition.sggPnu;
		} else if(searchCondition.sidoPnu !== 0){
			searchCondition.pnu = searchCondition.sidoPnu;
		};
		
		if(coverageType == "addt") {      		 
			if(searchCondition.pnu == null || searchCondition.pnu == "") {				
				//$.messager.alert("알림", "시도, 시군구, 읍면동(리)를 선택해 주세요.");
				$.messager.alert("알림", "시도를 선택해 주세요.");
				return;
			} 
		} else {
			var features = that.layer.features;
			if(features.length == 1) {
				var format = new OpenLayers.Format.WKT();
				var polygonWKT = format.write(features[0]);
				params = {
					searchType : "bbox"
					, polygonWKT : polygonWKT
				};
			}
			if(!params.polygonWKT)  {
				$.messager.alert("알림", "영역을 지정해 주세요.");
				return false;
			} 
		}
		
//		else if(searchCondition.pnu.length === 2) {
//			$.messager.alert("알림", "시군구, 읍면동(리)를 선택해 주세요.");
//			return;
//		} else if(searchCondition.pnu.length === 5) {
//			$.messager.alert("알림", "읍면동(리)를 선택해 주세요.");
//			return;
//		} else if(searchCondition.pnu.length === 8 || searchCondition.pnu.length === 10) {
//			// 통과, PASS, GOOD JOB
//		} else {
//			$.messager.alert("알림", "시도, 시군구, 읍면동(리)를 선택해 주세요.");
//			return;
//		} 		
		
		// 건물유형
		searchCondition.bdGroups = [];
		for(var i = 0; i < $("#frmMapInfoBuilding :checkbox[name='bdGroup']").length; i++) {
			if($("#frmMapInfoBuilding :checkbox[name='bdGroup']")[i].checked === true) {
				searchCondition.bdGroups.push($("#frmMapInfoBuilding :checkbox[name='bdGroup']")[i].value);
			}
		}
		
		searchCondition.bdGroups = searchCondition.bdGroups.join();
		
		// 건물용도
		searchCondition.bdTypes = [];
		for(var i = 0; i < $("#frmMapInfoBuilding :checkbox[name='bdType']").length; i++) {
			if($("#frmMapInfoBuilding :checkbox[name='bdType']")[i].checked === true) {
				searchCondition.bdTypes.push($("#frmMapInfoBuilding :checkbox[name='bdType']")[i].value);
			}
		}		
		
		searchCondition.bdTypes = searchCondition.bdTypes.join();

		// 층수 이상/이하 선택
		searchCondition.floorMaxOverUnder = $("#frmMapInfoBuilding :radio[name='floorMaxOverUnder']:checked").val();
				
		$.extend(searchCondition, {
			'searchType' : "bbox",
			'polygonWKT' : polygonWKT
		});


		// ToDo
		var message = "";
		
		message += "\n시도 pnu: " + searchCondition.sidoPnu;
		message += "\n시군구 pnu: " + searchCondition.sggPnu;
		message += "\n읍면동(리) pnu: " + searchCondition.emdlPnu;
		message += "\n검색 pnu: " + searchCondition.pnu;
		message += "\n건물명: " + searchCondition.bdName;
		message += "\n대번지: " + searchCondition.jibunbon;
		message += "\n소번지: " + searchCondition.jibunbu;
		message += "\n건물유형: " + searchCondition.bdGroups;
		message += "\n건물용도: " + searchCondition.bdTypes;
		message += "\n층수: " + searchCondition.floorMax;
		message += "\n층수 이상/이하 선택: " + searchCondition.floorMaxOverUnder;

		//$.messager.alert("알림", message);
		
		return searchCondition;
	},
		
	/**********************************************************************
	설명 : 검색
	파라메터 :
	리턴값 :
	***********************************************************************/
	search: function() {
		var that = this;
		
		var searchCondition = that.checkSubmitData();
		
		if(searchCondition == null) {
			return;
		}
		
		var targetUrl = "/gis/building/selectBuilding";
    	var id = "buildingSearch";
		var title = "수요건물 검색";
		var gridId = "";
		$.ajax({
	        type: "GET",
	        url: targetUrl,
	        data: searchCondition,
	        dataType: "json",
	        contentType: "charset=UTF-8",
	        success: function(jsonData){
	    		if(jsonData.total == 0){
	    			$.messager.alert("알림", "검색결과가 없습니다.");
	    			return false;
	    		}
	    		//dynamicSld.showResult("tcp_inbd_info", jsonData);
	    		//gridId = that.addDatagridTab(id, title, true, jsonData);	
	    	
	    		gridId = that.addDatagridTab(id, title, true, jsonData);	

	    		$.ajax({
			        type: "GET",
			        url: targetUrl + "Gids",
			        data: searchCondition,
			        dataType: "json",
			        contentType: "charset=UTF-8",
			        success: function(jdata){

			        	dynamicSld.showResult("tcp_inbd_info", jdata, gridId);
			        }
				});
	    		
	    		
	    		$("#" + gridId).datagrid("getPager").pagination({
	     	    	buttons: [{
	    					iconCls: 'icon-excel',
	    					handler: function() {
	    						var url = "/gis/building/searchDownloadExcel";
	    						var coverageType = $("#frmMapInfoBuilding input:radio[name='coverageType']:checked").val();
	    						if(coverageType == "addt") {
								url += '?pnu=' + searchCondition.pnu;
								}
								else {
									url += '?polygonWKT=' + encodeURIComponent(params.polygonWKT);
									
								}	    						
	    						url += '&jibunBon=' + searchCondition.jibunbon;
	    						url += '&jibunBu=' + searchCondition.jibunbu;
	    						url += '&bdName=' + searchCondition.bdName;
	    						url += '&bdGroups=' + searchCondition.bdGroups;
	    						url += '&bdTypes=' + searchCondition.bdTypes;
	    						url += '&floorMax=' + searchCondition.floorMax;
	    						url += '&floorMaxOverUnder=' + searchCondition.floorMaxOverUnder;
	    						
	    						$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
	    						$("#frm_file_download").attr("action", url);
	    						$("#frm_file_download").submit();							
	    					}
	     	    	}],
	     	    	onSelectPage : function(page, rows){

	     	    		searchCondition.page = page;
	     	    		searchCondition.rows = rows;
	     	    		searchCondition.totalCount = jsonData.total;
	     	    		$.post(
	     	    			  targetUrl
	     	    			, searchCondition
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
	     	    					
	     	    		    		//dynamicSld.showResult("tcp_inbd_info", data, index);

	     	    					// 내용을 다시 읽는다.
	     	    					$("#" + gridId).datagrid('reload');	
	     	    				} else {
	     	    					$.messager.alert("알림", "요청에 실패했습니다.");
	     	    				}
	     	    			}
	     	    			, "json"
	     	    		);
	             	}
	     	    });    

	        }
	    });		
	},
	
	/**********************************************************************
	설명 : 검색창 리셋
	파라메터 :
	리턴값 :
	***********************************************************************/
	reset: function() {
		var that = this;
		
		mapInfo.reset();
		
		// easyui 콤보 박스 초기화 처리
		that.sidoComboBox.combobox("clear");
		that.sggComboBox.combobox("clear");
		that.emdComboBox.combobox("clear");
		
		that.layer.removeAllFeatures();		
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
		var tableName = "tcp_inbd_info";
		
//		if(datas.rows.length == 0){
		if(datas.total == 0){
			$.messager.alert("알림", "검색결과가 없습니다.");
			return false;
		}
		
		$("#div_layout").layout("expand", "south");

	    var rowCnt = datas.total;
	    //var num = $("#div_bottom_tab").tabs("tabs").length;
	    ++gridIdex;
	    var ids = id + gridIdex;
	    var newTitle = gridIdex + "." + title + "(" + gfnFormatNumber(rowCnt) + "건)";

	    //검색된 데이터가 없으면 검색결과가 없는 html 코드를 넣는다.
//	    var onContent = 
//	    var resultContents = 
//	            "<table id=\""+ids+"\"\ class=\"easyui-datagrid\"\" style=\"height:"+commonGridHeight+"px\" pagination='true'>" +
//	            "<thead data-options=\"frozen:true\"><tr>" +
//	            "<th data-options=\"field:'itemNo',checkbox:true\"></th>" +
//	            "</tr></thead>" +
//	            "</table>";
//		var offContent = "<div id=\"gridContent\"><ul><li class=\"gridSearch\">검색결과가 없습니다.</li></ul></div>";
	//  var resultContents = (datas.rows.length > 0) ? onContent : offContent;    
	    var resultContents =  "<div id='" + ids + "' ></div>";
	    $("#div_bottom_tab").tabs('add',{
	    	title : newTitle,
	    	content : resultContents,
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
	   

	    
//		var tab = $('#div_bottom_tab').tabs('getSelected');		
//		var tabs = tab.panel('options').tab;

	    $("#" + ids).datagrid({
	    	data : datas,
	        columns : that.gridColumns,
	        pagination: true,
	        singleSelect : true,
	        selectOnCheck : false,
	        checkOnSelect : false,
	        remoteSort:false,
	        autoRowHeight: false,
			onSelect :function(rowIndex, rowData){
				gfnGetFeatureById(prefix+tableName.toLowerCase(), [rowData.gid], true, true, true, null);
	        },
	        onCheck : function(rowIndex, rowData){
	        	gfnGetFeatureById(prefix+tableName.toLowerCase(), [rowData.gid], true);
	        },
	        onUncheck : function(rowIndex, rowData){
	        	var layer = gfnGetLayer("searchLayer");
	        	var features = layer.features;
	        	for(var i=features.length-1; i >= 0; i--) {
	        		console.log(features[i])
	        		if(features[i] && features[i].fid && features[i].fid.substr(features[i].fid.indexOf(".")+1) == rowData.gid) {
	        			layer.removeFeatures(features[i]);
	        		}
	        	}
	        },
	        onCheckAll : function(rows){
	        	var gids = [];
	        	for(var i in rows) {
	        		gids.push(rows[i].gid);
	        	}      	
	        	gfnGetFeatureById(prefix+tableName.toLowerCase(), gids, true);
	        },
	        onUncheckAll : function(rows){
	        	gfnGetLayer("searchLayer").removeAllFeatures();
	        }
	        
	    });
	    
	    return ids;		
	},
	// 검색 부분 그리드 컬럼 정의
	gridColumns: [[
	      {field:"gid", hidden: true}
        , {field:"lawCode",title:"법정동코드(pnu)", width:100, halign:"center", align:"left", sortable: true, sorter: gfnNumberSorter}
        , {field:"addrSido",title:"시도", width:100, halign:"center", align:"left", sortable: true}
        , {field:"sigungu",title:"시군구", width:100, halign:"center", align:"left", sortable: true}
		, {field:"lawDong",title:"읍면동", width:100, halign:"center", align:"left", sortable: true}
		, {field:"lawLi",title:"리", width:100, halign:"center", align:"left", sortable: true}
		, {field:"jibunbon",title:"대번지", width:100, halign:"center", align:"right", sortable: true, sorter: gfnNumberSorter}
		, {field:"jibunbu",title:"소번지", width:100, halign:"center", align:"right", sortable: true, sorter: gfnNumberSorter}
		, {field:"bdName",title:"건물명", width:100, halign:"center", align:"left", sortable: true}
		, {field:"floorMax",title:"지상층수", width:100, halign:"center", align:"right", sortable: true, sorter: gfnNumberSorter}
		, {field:"bdGroup",title:"건물그룹", width:200, halign:"center", align:"left", sortable: true}
		, {field:"bdType",title:"건물유형", width:200, halign:"center", align:"left", sortable: true}
		, {field:"cellplan",title:"셀플랜", width:200, halign:"center", align:"left", sortable: true}
    ]]
};