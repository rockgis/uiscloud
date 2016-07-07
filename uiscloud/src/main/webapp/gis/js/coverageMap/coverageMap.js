"use strict";

var coverageMap = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	layer : null,
	
	sidoListData: null,

	// 검색조건 종류 구분 - addt : 행정구역, bbox : 영역
	coverageType : $("#frmCoverageMap input:radio[name='coverageType']"),
	// 시도 ComboBox
	sidoComboBox: $("#frmCoverageMap .sidoComboBox"),
	// 시군구 ComboBox
	sggComboBox: $("#frmCoverageMap .sggComboBox"),
	// 읍면동 ComboBox
	emdComboBox: $("#frmCoverageMap .emdComboBox"),
	// 리 ComboBox
	//liComboBox: $("#frmCoverageMap .liComboBox"),		

	radius25: $("#frmCoverageMap input:radio[name='radius'][value='25']"),

	bboxSearchButton : $("#frmCoverageMap .bbox"),
	bboxClearButton : $("#frmCoverageMap .bboxClear"),
	
	// 본부
	headOffice: $("#frmCoverageMap .headOffice"),
	// 제목
	title: $("#frmCoverageMap .title"),
	// 작성자명 
	creator: $("#frmCoverageMap .creator"),
	// 건물유형
	bdGroups: $("#frmCoverageMap input:checkbox[name='bdGroup']"),
	// 건물용도
	bdTypes: $("#frmCoverageMap input:checkbox[name='bdType']"),
	// 층수
	floorMax: $("#frmCoverageMap .floorMax"),
	
	searchButton: $("#frmCoverageMap .search"),
	
	searchStatisticsButton: $("#frmCoverageMap .searchStatistics"),
	
	downloadStatisticsExcelButton: $("#frmCoverageMap .downloadStatisticsExcel"),
	
	resetButton: $("#frmCoverageMap .reset"),
		
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
		
		// 본부 combobox 초기화
		that.initheadOfficeComboBoxes();
		
		// 시도 & 시군구 & 읍면동 combobox 들 초기화
		that.initAddressComboBoxes();
	},
	
	/**********************************************************************
	설명 : 시도 & 시군구 & 읍면동 combobox 들 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initAddressComboBoxes: function() {
		var that = this;
		
		setAddressComboBoxes(that.sidoComboBox, that.sggComboBox, that.emdComboBox);
	},
	
	initGis : function() {
		var that = this;
		
		that.layer = new BiesVector("coverageMap");
		map.addLayer(that.layer);
		
		var control = new OpenLayers.Control.DrawFeature(that.layer, OpenLayers.Handler.Polygon, { 
			id : "coverageMap"
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
	설명 : 본부 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initheadOfficeComboBoxes: function() {
		var that = this;
		
		// 32: 링생성경로
		// Bitwise And Filter: 32	
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
					}
				});
			} else {
				$.messager.alert("알림", "error code");
			}
		}, "json");
	},
			
	/**********************************************************************
	설명 : 관리본부 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initManagementHeadquartersComboBox: function() {
		var that = this;
		
		$.get("/gis/common/selectCommonCodeMasterByCodeType?codeType=DEPT", function(response) {
			if (response && response.result) {
				that.managementHeadquarters.combobox({
					data : response.result,
					valueField : 'code',
					textField : 'name',
					editable : false,
    				onLoadSuccess : function() {
    					// 관리팀 combobox 초기화
    					that.setUpManagementTeamComboBox();
    				},
    				onSelect : function(record){
    					// 관리팀 combobox 셋팅
    					that.setUpManagementTeamComboBox(record.code);
    				}
				});
			} else {
				$.messager.alert("알림", "error code");
			}
		}, "json");
	}, 
		
	/**********************************************************************
	설명 : 관리팀 combobox 셋팅
	파라메터 : managementHeadquartersPk // 관리본부 PK
	리턴값 :
	***********************************************************************/
	setUpManagementTeamComboBox: function(managementHeadquartersPK) {
		var that = this;

		if(managementHeadquartersPK) {
			var url = "/gis/common/selectCommonCodeMasterByCodeTypeAndSuperCode?codeType=DESU&superCode=" + managementHeadquartersPK;
			
			$.get(url, function(response) {
				if (response && response.result) {
					that.managementTeam.combobox({
						data : response.result,
						valueField : 'code',
						textField : 'name',
						editable : false
					});
				} else {
					$.messager.alert("알림", "error code");
				}
			}, "json");
		} else {
			that.managementTeam.combobox();
		}
	},
		
	/**********************************************************************
	설명 : Eng 발행일자 DateBox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initCalendarDateBox: function() {
		var that = this;
		
		var nowDate = new Date();
		
		var yyyy = nowDate.getFullYear();
		var mm = nowDate.getMonth() + 1;
		var dd = nowDate.getDate();
		
		var now = yyyy + "-" + mm + "-" + dd;
		
		var threeMonthAgoDate = new Date(yyyy, mm - 3, dd);
		
		yyyy = threeMonthAgoDate.getFullYear();
		mm = threeMonthAgoDate.getMonth() + 1;
		dd = threeMonthAgoDate.getDate();
		
		var threeMonthAgo = yyyy + "-" + mm + "-" + dd;
		
		var startDate = that.startDate.datebox("setValue", threeMonthAgo);
		var finishDate = that.finishDate.datebox("setValue", now);
		
		var calendar;
		
		calendar = startDate.datebox("calendar");
		
		calendar.calendar({
			weeks: ['일','월','화','수','목','금','토'],
			months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
		});	
		
		calendar = finishDate.datebox("calendar");
		
		calendar.calendar({
			weeks: ['일','월','화','수','목','금','토'],
			months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
		});
	},
	
	/**********************************************************************
	설명 : 사업구분 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initDivisionOfBusiness: function() {
		var that = this;
		
		$.get("/gis/common/selectCommonCodeMasterByCodeType?codeType=BSNS", function(response) {
			if (response && response.result) {
				that.divisionOfBusiness.combobox({
					data : response.result,
					valueField : 'code',
					textField : 'name',
					editable : false
				});
			} else {
				$.messager.alert("알림", "error code");
			}
		}, "json");
	},
	
	/**********************************************************************
	설명 : 수요분석대상 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initDemandAnalysisTarget: function() {
		var that = this;
		
		$.get("/gis/coverageMap/selectAllDemandAnalysisTarget", function(response) {
			if (response && response.result) {
				that.demandAnalysisTarget.combobox({
					data : response.result,
					valueField : 'pk',
					textField : 'name',
					editable : false
				});
			} else {
				$.messager.alert("알림", "error code");
			}
		}, "json");
	},
	
	/**********************************************************************
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
		that.coverageType.change(function() {
			var coverageType = $("#frmCoverageMap input:radio[name='coverageType']:checked").val();
			if(coverageType == "addt") {
				$("#frmCoverageMap .li_bbox").hide();
				$("#frmCoverageMap .li_addt").show();
			}
			else {
				$("#frmCoverageMap .li_addt").hide();
				$("#frmCoverageMap .li_bbox").show();
			}
		});
		
		//다각형 선택
		that.bboxSearchButton.click(function() {
			gfnActiveControl(["coverageMap"]);
		});
		
		//다각형 지우기
		that.bboxClearButton.click(function() {
			
			$("#a_serGridToolbarTabsCloseAll").trigger('click');
		});
		
		// 검색
		that.searchButton.click(function() {
			var params = that.parseData();
			if(that.validation(params)) {
				that.search(params);
			}
		});
		
		// 통계
		that.searchStatisticsButton.click(function() {
			var params = that.parseData();
			if(that.validation(params)) {
				that.searchStatistics(params);
			}
		});
		
		// 통계 엑셀 다운로드
		that.downloadStatisticsExcelButton.click(function() {
			var params = that.parseData();
			if(that.validation(params)) {
				that.downloadStatisticsExcel(params);
			}
		});
		
		// 초기화 
		that.resetButton.click(function() {
			that.reset();
		});
	},
	
	/**********************************************************************
	설명 : 검색창 리셋
	파라메터 :
	리턴값 :
	***********************************************************************/
	reset: function() {
		var that = this;
		
		// easyui 콤보 박스 초기화 처리
		that.sidoComboBox.combobox("clear");
		that.sggComboBox.combobox("clear");
		that.emdComboBox.combobox("clear");
		
		that.radius25.attr("checked", true);
		
		// 반경조건 초기화
		that.layer.removeAllFeatures();		
		
		// 본부 id
		that.headOffice.combobox("clear");
		// 제목
		that.title.val("");
		// 작성자명
		that.creator.val("");
		// 건물유형
		gfnClearCheckBoxGroup(that.bdGroups);
		// 건물용도
		gfnClearCheckBoxGroup(that.bdTypes);
		// 층수
		that.floorMax.val("")		
	},
	
	/**********************************************************************
	설명 : 검색 조건 추출
	파라메터 : 
	리턴값 : parmas - 검색 조건 객체
	***********************************************************************/
	parseData : function() {
		var that = this;
		var params = {};
		var coverageType = $("#frmCoverageMap input:radio[name='coverageType']:checked").val();
		
		// 행정구역 검색		
		if(coverageType == "addt") {      		 
    		var sidoLglCd = that.sidoComboBox.combobox('getValue') || 0;
    		var sggLglCd = that.sggComboBox.combobox('getValue') || 0;
    		var emdlLglCd = that.emdComboBox.combobox('getValue') || 0;
    		var lglCd = '';
    		
    		if(emdlLglCd !== 0) {
    			lglCd = emdlLglCd
    		} else if(sggLglCd !== 0) {
    			lglCd = sggLglCd
    		} else if(sidoLglCd !== 0){
    			lglCd = sidoLglCd
    		}
    		
			params = {
				  'lglCd' : lglCd
	        };
		}		
		// 반경 검색
		else {
			var features = that.layer.features;
			if(features.length == 1) {
				var format = new OpenLayers.Format.WKT();
				var polygonWKT = format.write(features[0]);
				params = {
					searchType : "bbox"
					, polygonWKT : polygonWKT
				};
			}
		}
						
		// 추가 정보 설정
		$.extend(params, {
			'radius': $("#frmCoverageMap input:radio[name='radius']:checked").val()
			// 본부 id
			, 'headOffice' : that.headOffice.combobox('getText')
			// 제목
			, 'title' : that.title.val()
			// 작성자명
			, 'creator' : that.creator.val()
			// 건물유형
			, 'bdGroups' : gfnCheckBoxCheckedToArray(that.bdGroups).join()
			// 건물용도
			, 'bdTypes' : gfnCheckBoxCheckedToArray(that.bdTypes).join()
			// 층수
			, 'floorMax' : that.floorMax.val()? that.floorMax.val(): 0
			// 층수 이상/이하 선택
			, 'floorMaxOverUnder' : $("#frmCoverageMap :radio[name='floorMaxOverUnder']:checked").val()
			, 'totalCount': 0
        	, 'page': 1
        	, 'rows': 10
		});
		
		if(testMode) {
			console.log(JSON.stringify(params, null, 2));
		}
		
		return params;
	},
	
	/**********************************************************************
	설명 : 검색 조건 검증
	파라메터 : params - 조건값
	리턴값 : true		- 성공
	       false	- 실패
	***********************************************************************/
	validation : function(params) {
		var that = this;
		
		var coverageType = $("#frmCoverageMap input:radio[name='coverageType']:checked").val();
		if(coverageType == "addt") {
			if(params.lglCd == 0){
//				$.messager.alert("알림", "시도/시군구를 선택해 주세요.");
				$.messager.alert("알림", "시도를 선택해 주세요.");
				that.sidoComboBox.focus();
				return false;
			}
//			if(params.lglCd.length < 5){
//				$.messager.alert("알림", "시군구를 선택해 주세요.");
//				that.sggComboBox.focus();
//				return false;
//			}
		}
		else {
			if(!params.polygonWKT)  {
				$.messager.alert("알림", "영역을 지정해 주세요.");
				return false;
			}
		}
		return true;
	},
	
	/**********************************************************************
	설명 : 검색
	파라메터 :
	리턴값 :
	***********************************************************************/
	search: function(params) {
		var that = this;

		var targetUrl = "/gis/coverageMap/search";
    	var id = "coverageMap";
		var title = "Coverage Map 검색";
		var gridId = "";
		
		if(testMode) {
			return true;
		}
		
		$.ajax({
	        type: "GET",
	        url: targetUrl,
	        data: params,
	        dataType: "json",
	        contentType: "charset=UTF-8",
	        success: function(jsonData){
	    		if(jsonData.total == 0){
	    			$.messager.alert("알림", "검색결과가 없습니다.");
	    			return false;
	    		}
	    		
	        	gridId = that.addDatagridTab(id, title, true, jsonData, params.radius);
	        	
        		if(params.searchType == "bbox"){
	        		var polygon = new OpenLayers.Format.WKT().read(params.polygonWKT);
	        		console.log(polygon)
	        		if(tabObj[gridId]){					
						tabObj[gridId].push([polygon]);					
					}
					else{						
						tabObj[gridId] = [polygon];
					}
	        	}

	    	    $("#" + gridId).datagrid("getPager").pagination({
	    	    	buttons: [{
						iconCls: 'icon-excel',
						handler: function() {
							var coverageType =  $("#frmCoverageMap input:radio[name='coverageType']:checked").val();
							var url = targetUrl + "DownloadExcel";
							if(coverageType == "addt") {
								url += '?lglCd=' + params.lglCd;	
							}
							else {
								url += '?polygonWKT=' + encodeURIComponent(params.polygonWKT);
								
							}

							url += '&radius=' + params.radius;	
							url += '&headOffice=' + params.headOffice;	
							url += '&title=' + params.title;	
							url += '&creator=' + params.creator;	
							url += '&bdGroups=' + params.bdGroups;	
							url += '&bdTypes=' + params.bdTypes;	
							url += '&floorMax=' + params.floorMax;		
							url += '&floorMaxOverUnder=' + params.floorMaxOverUnder;	
							
							$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
							$("#frm_file_download").attr("action", url);
							$("#frm_file_download").submit();						
						}
	    	    	}],
	    	    	onSelectPage : function(page, rows){
	    	    		var coverageType = $("#frmCoverageMap input:radio[name='coverageType']:checked").val();
	    	    		var pageParams = {};
	    	    		if(coverageType == "addt") {
	    	    			pageParams = {
	  	    	  	        	  'lglCd': params.lglCd
	  	    	  	        };
	    	    		}
	    	    		else {
	    	    			pageParams = {
	  	    	  	        	  'polygonWKT': params.polygonWKT
	  	    	  	        };
	    	    		}
	    	    		
	    	    		$.extend(pageParams, {
  	    	  	        	'radius': params.radius
  	    	  	        	, 'headOffice': params.headOffice
  	    	  	        	, 'title': params.title
  	    	  	        	, 'creator': params.creator
  	    	  	        	, 'bdGroups': params.bdGroups
  	    	  	        	, 'bdTypes': params.bdTypes
  	    	  	        	, 'floorMax': params.floorMax
  	    	  	        	, 'floorMaxOverUnder': params.floorMaxOverUnder
	    	    			, 'totalCount': jsonData.total
  	    	  	        	, 'page': page
  	    	  	        	, 'rows': rows
	    	    		});
	    	    		
	    	    		$.post(
	    	    			  targetUrl
	    	    			, pageParams
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
	설명: 그리드에 Tab 추가하기
		id는 새로 부여되어 리턴되고, 타이틀도 순번이 뒤에 붙어서 나오게 된다.
	파라미터:
		id 부여할 아이디. 중복을 피하기 위해 뒤에 일련번호가 붙여져서 처리됨.
		title 탭에 표시할 타이틀. 이것도 중복을 피하기 위해 뒤에 일련번호가 붙여져서 처리됨.
		singleSelect 그리드 내에 row 다중클릭/단건클릭여부 체크
	리터값: 새로 부여된 아이디
	***********************************************************************/	
	addDatagridTab: function (id, title, singleSelect, datas, radius) {
		var that = this;
		
//		if(datas.rows.length == 0){
		if(datas.total == 0){
			$.messager.alert("알림", "검색결과가 없습니다.");
			return false;
		}
		
		$("#div_layout").layout("expand", "south");

//	    var rowCnt = datas.rows.length;
	    var rowCnt = datas.total;
//	    var num = $("#div_bottom_tab").tabs("tabs").length;
	    ++gridIdex;
	    var ids = id + gridIdex;
	    var newTitle = gridIdex + "." + title + "(" + gfnFormatNumber(rowCnt) + "건)";
	    
	    //검색된 데이터가 없으면 검색결과가 없는 html 코드를 넣는다.
//	    var resultContents = 
//	            "<table name=\""+ids+"\"\ class=\"easyui-datagrid\"\" style=\"height:"+commonGridHeight+"px\" pagination='true'>" +
//	            "<thead data-options=\"frozen:true\"><tr>" +
//	            "<th></th>" +
//	            "</tr></thead>" +
//	            "</table>";
	    var resultContents =  "<div id='" + ids + "' ></div>";
	    $("#div_bottom_tab").tabs('add',{
	    	id :ids,
	    	title : newTitle,
	    	content : resultContents,
	    	height : commonGridHeight,
	    	closable : true
	    });    		
//	    $('#div_bottom_tab').tabs({
//	    	onBeforeClose: function(title,index){
//	    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//	    		var features = tabObj[id];
//
//	    		if(features) {	
//	    			
//	    		   gfnGetLayer("searchLayer").removeFeatures(features);	
//	    		   that.layer.removeAllFeatures();
//	    		   gfnGetLayer("spatial_layer").removeFeatures(features);    		   
//    			   
//	    		   delete tabObj[id];
//	    		}
//	    	  },
//	    	onClose : function(title,index){
//	    		if($("#div_east").css("display") != "none"){ 
//		    		$('#div_layout').layout("collapse", "east");
//		    		
//	    		}
//				$("#table_info").propertygrid("loadData", []);
//	    	},
//	    	onSelect : function(title,index){
//		    		
//		    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//		    		if($("#"+id).datagrid()){
//		    		 $("#"+id).datagrid("reload");
//		    		}
//		    }
//	    });
//		$("#div_bottom_tab").tabs("select",newTitle);
//	    //that.tabOption(newTitle, ids);
//	    $("#div_bottom_tab").tabs("resize");
	        
	    $("#" + ids).datagrid({
	        data : datas,
	        columns : that.gridColumns,
	        singleSelect : singleSelect,
	        selectOnCheck : false,
	        checkOnSelect : false,
	        remoteSort:false,
	        autoRowHeight: false,
	        pagination : true,
	        onSelect : function(rowIndex, rowData) {
	        	gfnGetFeatureById(prefix+"tcp_inbd_info", [rowData.gid], false, false, false, function(res) {
	        		var layer = gfnGetLayer("searchLayer");
	        		
	        		layer.removeAllFeatures();
	        		
	        		if(res.features.length > 0) {
	        			var feature = res.features[0];
	        			var pointFeature = new OpenLayers.Feature.Vector(feature.geometry.clone());
	        			pointFeature.attributes = {
	        				strokeWidth : 6,
        					strokeColor : "#ffff00",
        					fillColor : "#ffff00",
        					fillOpacity : 1
	        			};
	        	
	        			gfnHighlightFeature([pointFeature]);
	        			if(tabObj[ids]){	        			
	        				//tabObj[ids].push(pointFeature);	
	        				tabObj[ids] = pointFeature;
	        			}
	        			else{		
	        				tabObj[ids] = pointFeature;
	        			}
	        			var geom = gfnBufferGeometry(pointFeature.geometry, radius);
	        			var circle = new OpenLayers.Feature.Vector(geom);
	        			layer.addFeatures(circle);

	        			if(tabObj[ids]){	        			
	        				//tabObj[ids].push(circle);	
	        				tabObj[ids] = circle;
	        			}
	        			else{		
	        				tabObj[ids] = circle;
	        			}
	        			map.zoomToExtent(layer.getDataExtent());
	        			
	        			var tableArrs = [];
	        			gfnGetFeatureByDWithin(prefix+"gotc_jp", feature.geometry, radius, true, false, false, function(jpResponse) {
	        				var jps =  jpResponse.features;
	        				
	        				//커버리지와 설비 연결 라인 Point
	        				var start_point = new OpenLayers.Geometry.Point(feature.geometry.x, feature.geometry.y);
	        				
	        				if(jps.length > 0) {
	        					var jpGids = [];
		        				for(var i in jps) {
		        					
		        					/*********************************************************************************************/
		        					//커버리지와 설비 연결 라인 생성
		        					var end_point = new OpenLayers.Geometry.Point(jps[i].geometry.x, jps[i].geometry.y);
		        					//연결선 생성
		        					var jpLineString = new OpenLayers.Geometry.LineString([start_point, end_point]);
		        					var jpLineFeature = new OpenLayers.Feature.Vector(jpLineString);
		        					//연결선의 중심점 추출
		        					var jpLineLabel = new OpenLayers.Feature.Vector(jpLineString.getCentroid(true));
		        					//연결선의 거리재기
		        					var length = Math.round(jpLineString.getLength());
		        					
		        					layer.addFeatures([jpLineFeature, jpLineLabel]);
		        					
		        					jpLineLabel.style = {
		        							fontFamily: "arial",
		        							fontWeight: "bold",
		        							fontColor: "#000000",
		        							fontSize: "12",
		        							label : '',
		        							labelAlign: "cm"
		        					};
		        					
		        					jpLineFeature.style = {
		        							strokeWidth : 1,
		                					strokeColor : "#AA1212",
		                					fillColor : "#AA1212",
		                					fillOpacity : 1
		        					};
		        					
		        					jpLineLabel.style.label = length.toFixed(2) + "m";
		        					/***********************************************************************************************/
		        					
		        					jpGids.push(jps[i].fid.substr(jps[i].fid.indexOf(".")+1));
		        					if(tabObj[ids]){	        			
				        				//tabObj[ids].push(jps[i]);	   
		        						tabObj[ids] = jps[i];
				        			}
				        			else{		
				        				tabObj[ids] = jps[i];
				        			}
		        				}
		        				var jpObj = {
		        					tableName : "GOTC_JP",
		        					gids : jpGids
		        				};
		  
		        				tableArrs.push(jpObj);		
		        				
	        				}
	        				
	        				gfnGetFeatureByDWithin(prefix+"kfct_ep", feature.geometry, radius, false, false, false, function(tpoResponse) {
		        				var eps = tpoResponse.features;
		        				if(eps.length > 0) {
		        					for(var i=0, len=eps.length; i < len; i++) {
			        					var ep = eps[i];
			        					ep.attributes = {
			        						strokeWidth : 6,
		                					strokeColor : "#00ffff",
		                					fillColor : "#00ffff",
		                					fillOpacity : 1
		        	        			};	
			        					
			        					gfnHighlightFeature(ep);
			        					//gfnGetLayer("searchLayer").redraw();
			        				}
		        					var epGids = [];
		        					for(var i in eps) {
		        						
		        						/*********************************************************************************************/
			        					//커버리지와 설비 연결 라인 생성
		        						var end_point = new OpenLayers.Geometry.Point(eps[i].geometry.components[0].x, eps[i].geometry.components[0].y);
		        						//연결선 생성
			        					var kfctEpLineString = new OpenLayers.Geometry.LineString([start_point, end_point]);
			        					var kfctEpLineFeature = new OpenLayers.Feature.Vector(kfctEpLineString);
			        					//연결선의 중심점 추출
			        					var kfctEpLineLabel = new OpenLayers.Feature.Vector(kfctEpLineString.getCentroid(true));
			        					//연결선의 거리재기
			        					var length = Math.round(kfctEpLineString.getLength());
			        					
			        					layer.addFeatures([kfctEpLineFeature, kfctEpLineLabel]);
			        					
			        					kfctEpLineLabel.style = {
			        							fontFamily: "arial",
			        							fontWeight: "bold",
			        							fontColor: "#000000",
			        							fontSize: "12",
			        							label : '',
			        							labelAlign: "cm"
			        					};
			        					
			        					kfctEpLineFeature.style = {
			        							strokeWidth : 1,
			                					strokeColor : "#AA1212",
			                					fillColor : "#AA1212",
			                					fillOpacity : 1
			        					};
			        					//연결선 거리 소수점 2자리까지 제한
			        					kfctEpLineLabel.style.label = length.toFixed(2) + "m";
			        					/***********************************************************************************************/
			        					
//			        					gfnGetLayer("searchLayer").redraw();
		        						epGids.push(eps[i].fid.substr(eps[i].fid.indexOf(".")+1));
		        					}
		        					var epObj = {
		        						tableName : "KFCT_EP",
			        					gids : epGids
			        				};
		        					if(epObj[eps]){	        			
				        				//tabObj[ids].push(ep);	   
		        						//epObj[eps] = ep;
				        			}
				        			else{		
				        				//epObj[eps] = ep;
				        			}
		        					
		        					tableArrs.push(epObj);
		        					
		        					if(tableArrs.length > 0) {
			        					spatialInfo.selectDetailInfo(tableArrs);
			        					gfnGetLayer("searchLayer").redraw();
			        				}
			        				else {
		        					   $("#table_info").propertygrid("loadData", []);
		        					}
		        					
		        				}
		        			});
	        				
	        				gfnGetFeatureByDWithin(prefix+"gotc_tpo", feature.geometry, radius, false, false, false, function(tpoResponse) {
		        				var tpos = tpoResponse.features;

		        				if(tpos.length > 0) {
		        					for(var i=0, len=tpos.length; i < len; i++) {
			        					var tpo = tpos[i];
			        					tpo.attributes = {
			        						strokeWidth : 6,
		                					strokeColor : "#0000ff",
		                					fillColor : "#0000ff",
		                					fillOpacity : 1
		        	        			};
			        	
			        					gfnHighlightFeature(tpo);
			        				}
			        				var tpoGids = [];
			        				for(var i in tpos) {
			        					
			        					
			        					/*********************************************************************************************/
			        					//커버리지와 설비 연결 라인 생성
			        					var end_point = new OpenLayers.Geometry.Point(tpos[i].geometry.x, tpos[i].geometry.y);
			        					//연결선 생성
			        					var tpoLineString = new OpenLayers.Geometry.LineString([start_point, end_point]);
			        					var tpoLineFeature = new OpenLayers.Feature.Vector(tpoLineString);
			        					//연결선의 중심점 추출
			        					var tpoLineLabel = new OpenLayers.Feature.Vector(tpoLineString.getCentroid(true));
			        					//연결선의 거리재기 
			        					var length = Math.round(tpoLineString.getLength());
			        					
			        					layer.addFeatures([tpoLineFeature, tpoLineLabel]);
			        					
			        					tpoLineLabel.style = {
			        							fontFamily: "arial",
			        							fontWeight: "bold",
			        							fontColor: "#000000",
			        							fontSize: "12",
			        							label : '',
			        							labelAlign: "cm"
			        					};
			        					
			        					tpoLineFeature.style = {
			        							strokeWidth : 1,
			                					strokeColor : "#AA1212",
			                					fillColor : "#AA1212",
			                					fillOpacity : 1
			        					};
			        					//연결선 거리 소수점 2자리까지 제한
			        					tpoLineLabel.style.label = length.toFixed(2) + "m";
			        					/***********************************************************************************************/
			        					
			        					tpoGids.push(tpos[i].fid.substr(tpos[i].fid.indexOf(".")+1));
			        				}
			        				var tpoObj = {
		        						tableName : "GOTC_TPO",
			        					gids : tpoGids
			        				};
			        				if(tabObj[tpos]){	        			
				        				//tabObj[ids].push(tpo);
			        					tabObj[tpos] = tpo;
				        			}
				        			else{		
				        				tabObj[tpos] = tpo;
				        			}
		        				}
		        				tableArrs.push(tpoObj);
//		        				if(tableArrs.length > 0) {
//		        					spatialInfo.selectDetailInfo(tableArrs);	
//		        				}
//		        				else {
//		        					   $("#table_info").propertygrid("loadData", []);
//		        					}
		        				
		        			});	
	        				
	        				map.addLayers([layer]);
	        			});
	        		}
	        	});
	        }
	    });
	    return ids;		
	},
	tabOption : function(title,tabId) {
		var that = this;
		$('#div_bottom_tab').tabs({
	    	onBeforeClose: function(title,index){
	    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
	    		var features = tabObj[id];

	    		if(features) {	
	    			
	    		   gfnGetLayer("searchLayer").removeFeatures(features);	
	    		   that.layer.removeAllFeatures();
	    		   gfnGetLayer("spatial_layer").removeFeatures(features);    		   
    			   
	    		   delete tabObj[id];
	    		}
	    	  },
	    	onClose : function(title,index){
	    		if($("#div_east").css("display") != "none"){ 
		    		$('#div_layout').layout("collapse", "east");
		    		
	    		}
				$("#table_info").propertygrid("loadData", []);
	    	}
	    });
		$("#div_bottom_tab").tabs("select",title);
	},
	// 검색 부분 그리드 컬럼 정의
	gridColumns: [
	    [
	     	//{field:"no",title:"no", width:100, halign:"center", align:"left", sortable: false, hidden: true, rowspan: 2}
			//, {field:"distance",title:"거리", width:100, halign:"center", align:"left", sortable: false, rowspan: 2}
	       	{field:"gid",title:"gid", width:100, halign:"center", align:"left", sortable: false, hidden: true, rowspan: 2}
	     	, {field:"sidoName",title:"시도", width:100, halign:"center", align:"left", sortable: false, rowspan: 2}
	     	, {field:"sggName", title:"시군구", width:100, halign:"center", align:"left", sortable: false, rowspan: 2}
	      	, {field:"emdName",title:"읍면동(리)", width:100, halign:"center", align:"left", sortable: false, rowspan: 2}
	    	, {field:"address",title:"주소", width:300, halign:"center", align:"left", sortable: false, rowspan: 2}
	      	, {title:"반경내 접속함체수", colspan: 2}
		    , {title:"반경내 국소수", colspan: 2}
		    , {field:"kfctEpCount",title:"반경내 전주수", width:100, halign:"center", align:"right", sortable:false, rowspan:2}
	    	, {field:"the_geom",title: "the_geom", width:200, halign:"center", align:"right", sortable: false, hidden: true, rowspan: 2}
    	], [	    	
	    	  {field:"jpSktCount",title:"T", width:100, halign:"center", align:"right", sortable: false, hidden: false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
	    	, {field:"jpSkbCount",title:"B", width:100, halign:"center", align:"right", sortable: false, hidden: false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
	    	, {field:"tpoSktCount",title:"T", width:100, halign:"center", align:"right", sortable: false, hidden: false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
	    	, {field:"tpoSkbCount",title:"B", width:100, halign:"center", align:"right", sortable: false, hidden: false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}    	    
    	]
    ],

	/**********************************************************************
	설명 : 통계
	파라메터 :
	리턴값 :
	***********************************************************************/
    searchStatistics: function(params) {
    	var that = this;
    	
		var targetUrl = "/gis/coverageMap/searchStatistics";
    	var id = "coverageMap";
		var title = "Coverage Map 통계";
				
		$.ajax({
	        type: "GET",
	        url: targetUrl,
	        data: params,
	        dataType: "json",
	        contentType: "charset=UTF-8",
	        success: function(jsonData){
	    		if(jsonData.total == 0){
	    			$.messager.alert("알림", "통계결과가 없습니다.");
	    			return false;
	    		}
	    		that.addStatisticsDatagridTab(id, title, true, jsonData, params.radius);
	        }
	    });	
	},
	
	/**********************************************************************
	설명: 그리드에 통계 Tab 추가하기
		id는 새로 부여되어 리턴되고, 타이틀도 순번이 뒤에 붙어서 나오게 된다.
	파라미터:
		id 부여할 아이디. 중복을 피하기 위해 뒤에 일련번호가 붙여져서 처리됨.
		title 탭에 표시할 타이틀. 이것도 중복을 피하기 위해 뒤에 일련번호가 붙여져서 처리됨.
		singleSelect 그리드 내에 row 다중클릭/단건클릭여부 체크
	리터값: 새로 부여된 아이디
	***********************************************************************/	
	addStatisticsDatagridTab: function (id, title, singleSelect, datas, radius) {
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
	    
	    //검색된 데이터가 없으면 검색결과가 없는 html 코드를 넣는다.
	    var resultContents = 
	            "<table id=\""+ids+"\"\ class=\"easyui-datagrid\"\" style=\"height:"+commonGridHeight+"px\">" +
	            "<thead data-options=\"frozen:true\"><tr>" +
	            "<th></th>" +
	            "</tr></thead>" +
	            "</table>";
	    
	    $("#div_bottom_tab").tabs('add',{
	    	title : newTitle,
	    	content : resultContents,
	    	height : commonGridHeight,
	    	closable : true
	    });    		
	    
	    $("#div_bottom_tab").tabs("resize");
	        
	    $("#" + ids).datagrid({
	        data : datas,
	        columns : that.gridStatisticsColumns,
	        singleSelect : singleSelect,
	        selectOnCheck : false,
	        checkOnSelect : false,
	        remoteSort:false,
	        autoRowHeight: false
	    });
	    
	    return ids;		
	},
	
	// 통계 부분 그리드 컬럼 정의
	gridStatisticsColumns: [
	    [
   	       	  {field:"sidoName",title:"시도", width:100, halign:"center", align:"left", sortable: false, rowspan: 2}
   	     	, {field:"sggName", title:"시군구", width:100, halign:"center", align:"left", sortable: false, rowspan: 2}
   	      	, {field:"emdName",title:"읍면동(리)", width:100, halign:"center", align:"left", sortable: false, rowspan: 2}
   	    	, {title:"반경내 접속함체수", colspan: 2}
   		    , {title:"반경내 국소수", colspan: 2}
   		    , {field:"kfctEpCount",title:"반경내 전주수", width:100, halign:"center", align:"right", sortable:false, rowspan:2}
       	], [	    	
   	    	  {field:"jpSktCount",title:"T", width:100, halign:"center", align:"right", sortable: false, hidden: false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
   	    	, {field:"jpSkbCount",title:"B", width:100, halign:"center", align:"right", sortable: false, hidden: false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
   	    	, {field:"tpoSktCount",title:"T", width:100, halign:"center", align:"right", sortable: false, hidden: false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
   	    	, {field:"tpoSkbCount",title:"B", width:100, halign:"center", align:"right", sortable: false, hidden: false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}    	    
       	]
    ], 
	
	/**********************************************************************
	설명 : 통계 엑셀 출력
	파라메터 :
	리턴값 :
	***********************************************************************/
	downloadStatisticsExcel: function(params) {
		var that = this;
		
		var url = "/gis/coverageMap/searchStatisticsExcel?";
				
		url += decodeURIComponent($.param(params));
		
		$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
		$("#frm_file_download").attr("action", url);
		$("#frm_file_download").submit();
	}
};