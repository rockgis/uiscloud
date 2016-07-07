"use strict";

var investmentInfo = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 관리본부
	managementHeadquarters: $("#frmInvestmentInfo .managementHeadquarters"),
	// Eng 발행일자 Start Date
	startDate: $("#frmInvestmentInfo .startDate"),	
	// Eng 발행일자 Finish Date
	finishDate: $("#frmInvestmentInfo .finishDate"),
	// Eng Sheet No
	engSheetNo: $("#frmInvestmentInfo .engSheetNo"),
	// 공사번호
	workCd: $("#frmInvestmentInfo .workCd"),
	// 사업연도
	businessYear: $("#frmInvestmentInfo .businessYear"),
	// 사업구분명
	businessPurpose: $("#frmInvestmentInfo .businessPurpose"),	
	// 시도 ComboBox
	sidoComboBox: $("#frmInvestmentInfo .sidoComboBox"),
	// 시군구 ComboBox
	sggComboBox: $("#frmInvestmentInfo .sggComboBox"),
	// 읍면동 ComboBox
	emdComboBox: $("#frmInvestmentInfo .emdComboBox"),
	// 리 ComboBox
	liComboBox: $("#frmInvestmentInfo .liComboBox"),	
	//검색 타입
	coverageType : $("#frmInvestmentInfo input:radio[name='coverageType']"),
	
	searchButton: $("#frmInvestmentInfo .search"),
	
	bboxSearchButton: $("#frmInvestmentInfo .bbox"),
	bboxClearButton : $("#frmInvestmentInfo .bboxClear"),
	
	searchStatisticsButton: $("#frmInvestmentInfo .searchStatistics"),
	
	downloadStatisticsExcelButton: $("#frmInvestmentInfo .downloadStatisticsExcel"),
	
	resetButton: $("#frmInvestmentInfo .reset"),
	
	layerName: "sktbigis:gotc_ca",
	
	/**********************************************************************
	설명 : 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 	
	init: function() {
		var that = this;
		
		that.initUi();
		that.bindEvents();
		that.initGis();
	},
	
	/**********************************************************************
	설명 : 화면 Ui 작업 jeasyui (validatebox, datagrid)
	파라메터 :
	리턴값 :
	***********************************************************************/
	initUi: function() {
		var that = this;
		
		// 관리본부 & 관리팀 combobox 초기화
		that.initManagementHeadquartersComboBox();
		
		// Eng 발행일자 DateBox 초기화
		that.initCalendarDateBox();
		
		// 사업연도 combobox 초기화
		that.initBusinessYearComboBox();
				
		// 시도 & 시군구 & 읍면동 combobox 들 초기화
		that.initAddressComboBoxes();
	},
	initGis : function() {
		var that = this;
		
		that.layer = new BiesVector("invest");
		map.addLayer(that.layer);
		
		var control = new OpenLayers.Control.DrawFeature(that.layer, OpenLayers.Handler.Polygon, { 
			id : "invest"
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
    					//that.setUpManagementTeamComboBox();
    				},
    				onSelect : function(record){
    					// 관리팀 combobox 셋팅
    					//that.setUpManagementTeamComboBox(record.code);
    					
    					// 사업구분명 combobox 셋팅 (사업연도도 선택 되어 있어야 함)
    					that.initBusinessPurposeComboBox();
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
			
			// 사업구분명 combobox 셋팅 (관리본부도 선택 되어 있어야 함)
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
		
		var now = yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
		
		var threeMonthAgoDate = new Date(yyyy, mm - 3, dd);
		
		yyyy = threeMonthAgoDate.getFullYear();
		mm = threeMonthAgoDate.getMonth() + 1;
		dd = threeMonthAgoDate.getDate();
		
		var threeMonthAgo = yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
		
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
	설명 : 사업연도 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initBusinessYearComboBox: function() {
		var that = this;
		var today = new Date();		
		var years = [];
		var year = today.getFullYear();
		var i = 0;
		
		for(i = 0; year > 1980; year--, i++) {
			years[i] = { "year": year };
		}
		
		that.businessYear.combobox({
			data : years,
			valueField : 'year',
			textField : 'year',
			editable : false,
			onSelect: function() { that.initBusinessPurposeComboBox(); }
		});		
	},
	
	/**********************************************************************
	설명 : 사업구분명 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initBusinessPurposeComboBox: function() {
		var that = this;		
		var managementHeadquartersPK = that.managementHeadquarters.combobox('getValue')
		var businessYear = that.businessYear.combobox('getValue');

		if(managementHeadquartersPK === "" || businessYear == "") {
			that.businessPurpose.combobox('clear');
			return
		}
		
		var targetUrl = "/gis/investmentInfo/searchBusinessPurposeByManagementHeadquartersPKAndBusinessYear";		
		targetUrl += "?managementHeadquartersPK=" + managementHeadquartersPK;
		targetUrl += "&businessYear=" + businessYear;
		
		$.get(targetUrl, function(response) {
			if (response && response.result) {
				that.businessPurpose.combobox({
					data : response.result,
					valueField : 'businessPurpose',
					textField : 'businessPurpose',
					editable : false
				});
			} else {
				$.messager.alert("알림", "error code");
			}
		}, "json");
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
	
	/**********************************************************************
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
		that.coverageType.change(function() {
			var coverageType = $("#frmInvestmentInfo input:radio[name='coverageType']:checked").val();
			if(coverageType == "addt") {
				$("#frmInvestmentInfo .li_bbox").hide();
				$("#frmInvestmentInfo .li_addt").show();
			}
			else {
				$("#frmInvestmentInfo .li_addt").hide();
				$("#frmInvestmentInfo .li_bbox").show();
			}
		});
		// 검색
		that.searchButton.click(function() {
			that.search();
		});
		//다각형 선택
		that.bboxSearchButton.click(function() {
			gfnActiveControl(["invest"]);
		});
		
		//다각형 지우기
		that.bboxClearButton.click(function() {
			
			$("#a_serGridToolbarTabsCloseAll").trigger('click');
		});
		
		// 통계
		that.searchStatisticsButton.click(function() {
			that.searchStatistics();
		});
		
		// 통계 엑셀 다운로드
		that.downloadStatisticsExcelButton.click(function() {
			that.downloadStatisticsExcel();
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
		
		var data = that.makeData();
		
		if(testMode) {
			return true;
		}
		
		if(data.managementHeadquartersPK === ""){
			$.messager.alert("알림", "관리본부를 선택해 주세요.");
			return;
		}
		
		var targetUrl = "/gis/investmentInfo/search";
    	var id = "investmentInfo";
		var title = "투자비정보 검색";
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
	    		
	        	gridId = that.addDatagridTab(id, title, true, jsonData, function(obj){
	        		var getRowValue = $(obj).datagrid("getSelected");

	        		//gfnHighlightFeatureByUnqMgnos(that.layerName, getRowValue.unqMgno, true, true, true);
	        		var managementNumbers = that.searchManagementNumbersByWorkCd(getRowValue.workCd);
	        		gfnHighlightFeatureByUnqMgnosForInvestmentInfo(that.layerName, managementNumbers, true, true, true, function() {
	        			$.post(
    	        			"/gis/investmentInfo/searchSmartDesign",
    	        			{workCd : getRowValue.workCd},
    	        			function(res) {
    	        				var format = new OpenLayers.Format.WKT();
    	        				if(res && res.result && res.result.length > 0) {
    	        					var features = [];
    	        					for(var i in res.result) {
    	        						var feature = format.read(res.result[i].geom);
    	        						
    	        						if(res.result[i].style=="기설-가공") {
    	        							feature.attributes = {
	    	                					strokeColor : "#ffbb00",
	    	                					fillColor : "#ffbb00",
	    	                					fillOpacity : 1,
	    	                					strokeWidth : 3,
	    	                					strokeDashstyle : "solid"
	    	        	        			};
    	        						}
    	        						else if(res.result[i].style=="기설-지중") {
    	        							feature.attributes = {
	    	                					strokeColor : "#ffbb00",
	    	                					fillColor : "#ffbb00",
	    	                					fillOpacity : 1,
	    	                					strokeWidth : 3,
	    	                					strokeDashstyle : "dot"
	    	        	        			};
    	        						}
    	        						else if(res.result[i].style=="신설-가공") {
    	        							feature.attributes = {
	    	                					strokeColor : "#0000ff",
	    	                					fillColor : "#0000ff",
	    	                					fillOpacity : 1,
	    	                					strokeWidth : 3,
	    	                					strokeDashstyle : "solid"
	    	        	        			};
    	        						}
    	        						else if(res.result[i].style=="신설-지중") {
    	        							feature.attributes = {
	    	                					strokeColor : "#0000ff",
	    	                					fillColor : "#0000ff",
	    	                					fillOpacity : 1,
	    	                					strokeWidth : 3,
	    	                					strokeDashstyle : "dot"
	    	        	        			};
    	        						}
    	        						else if(res.result[i].style=="기설-대개체") {
    	        							feature.attributes = {
	    	                					strokeColor : "#ff00dd",
	    	                					fillColor : "#ff00dd",
	    	                					fillOpacity : 1,
	    	                					strokeWidth : 3,
	    	                					strokeDashstyle : "solid"
	    	        	        			};
    	        						}
    	        						else if(res.result[i].style=="기설-철거") {
    	        							feature.attributes = {
	    	                					strokeColor : "#ff00dd",
	    	                					fillColor : "#ff00dd",
	    	                					fillOpacity : 1,
	    	                					strokeWidth : 3,
	    	                					strokeDashstyle : "dot"
	    	        	        			};
    	        						}
    	        						features.push(feature);
    	        					}

    	        					gfnHighlightFeature(features);    	
    	        					if(tabObj[gridId]){
    	        						tabObj[gridId].push(features);
    	        					}
    	        					else{
    	        						tabObj[gridId] = features;
    	        					}
    	        				}
    	        			},
    	        			"json"
    	        		);
	        		}, getRowValue);
	        	});
	    	    
	    	    $("#" + gridId).datagrid("getPager").pagination({
	    	    	buttons: [{
						iconCls: 'icon-excel',
						handler: function() {						
							var downloadUrl = targetUrl + "DownloadExcel?";
							downloadUrl += decodeURIComponent($.param(data));
							
							$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
							$("#frm_file_download").attr("action", downloadUrl);
							$("#frm_file_download").submit();	
						}
	    	    	}],
	    	    	onSelectPage : function(page, rows){
	    	    		data.totalCount = jsonData.total;
	    	    		data.page = page;
	    	    		data.rows = rows;
	    	    		
	    	    		$.post(
	    	    			  targetUrl
	    	    			, data
	    	    			, function(response) {
	    	    				if(response && response.rows) {
	    	    					// 메타데이타 목록 표시
	    	    					var _data = {
	    	    						count : response.rows.length,
	    	    						rows : response.rows,
	    								total : response.total,
	    								pageSize : rows
	    	    					};
	    	    					this.gridData = _data;
	    	    					// 데이터 저장
	    	    					$("#" + gridId).datagrid('loadData', _data);
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

		that.initUi();
		
		// easyui 콤보 박스 초기화 처리
		that.managementHeadquarters.combobox("clear");
		that.businessYear.combobox("clear");		
		that.businessPurpose.combobox("clear");		
		that.sidoComboBox.combobox("clear");
		that.sggComboBox.combobox("clear");
		that.emdComboBox.combobox("clear");
		that.initCalendarDateBox();		
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

		if(datas.total == 0){
			$.messager.alert("알림", "검색결과가 없습니다.");
			return false;
		}
		
		$("#div_layout").layout("expand", "south");
		// 객체를 복제시킴. 서로 데이터가 물고 있어서 칼럼 크기 변경시 오동작을 발생시키기 때문.
	    var newCols = JSON.parse(JSON.stringify(that.gridColumns));

	    var columList = [];
	    columList.push(newCols);

	    var rowCnt = datas.total;
	    ++gridIdex;
	    var ids = id + gridIdex;
	    var newTitle = gridIdex + "." + title + "(" + gfnFormatNumber(rowCnt) + "건)";
	    
	    //검색된 데이터가 없으면 검색결과가 없는 html 코드를 넣는다.
//	    var resultContents = 
//	            "<table id=\""+ids+"\"\ class=\"easyui-datagrid\"\" style=\"height:"+commonGridHeight+"px\" pagination='true'>" +
//	            "<thead data-options=\"frozen:true\"><tr>" +
//	            "<th data-options=\"field:'itemNo',checkbox:true\"></th>" +
//	            "</tr></thead>" +
//	            "</table>";
	    var resultContents =  "<div id='" + ids + "' ></div>";
	    $("#div_bottom_tab").tabs('add',{
	    	title : newTitle,
	    	content : resultContents,
	    	height : commonGridHeight,
	    	closable : true
	    });    		
	    
//	    $("#div_bottom_tab").tabs("resize");
    
	    $("#" + ids).datagrid({
	        data : datas,
	        columns : columList,
	        singleSelect : singleSelect,
	        selectOnCheck : false,
	        checkOnSelect : false,
	        remoteSort:false,
	        autoRowHeight: false,
	        pagination : true,
	        onClickRow :function(rowIndex, rowData){
	            if(onclickRow)
	                onclickRow(this);
	        },
	        onCheck : function(rowIndex, rowData){
	        	var managementNumbers = that.searchManagementNumbersByWorkCd(rowData.workCd);
	        	gfnHighlightFeatureByUnqMgnosForInvestmentInfo(that.layerName, managementNumbers,false,false,null,null,rowData);
	        	
	        	if(managementNumbers && managementNumbers.length > 0) {
	        		
	        	} else {
	        		$.messager.alert("알림", "선택한 공사에 대한 시설물정보가\n존재하지 않습니다.");
	        	}
	        },
	        onUncheck : function(rowIndex, rowData){
	        	var layer = gfnGetLayer("searchLayer");
	        	var features = layer.features;
	        	for(var i=features.length-1; i >= 0; i--) {
	        		if(features[i] && features[i].data && features[i].data.unqMgno == rowData.unqMgno) {
	        			layer.removeFeatures(features[i]);
	        		}
	        	}
	        },
	        onCheckAll : function(rows){
	        	for(var i in rows){
		        	var managementNumbers = that.searchManagementNumbersByWorkCd(rows[i].workCd);
		        	gfnHighlightFeatureByUnqMgnosForInvestmentInfo(that.layerName, managementNumbers,false,false);
	        	}
	        },
	        onUncheckAll : function(rows){
	        	gfnGetLayer("searchLayer").removeAllFeatures();
	        }	        
	    });
//	    $('#div_bottom_tab').tabs({
//	    	onBeforeClose: function(title,index){
//	    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//	    		console.log(id)
//	    		var features = tabObj[id];
//
//	    		if(features) {
//	    		   gfnGetLayer("searchLayer").removeFeatures(features);
//	    		   delete tabObj[id];
//	    		}
//	    		if($("#div_east").css("display") != "none"){ 
//		    		$('#div_layout').layout("collapse", "east");
//		    		
//	    		}
//				$("#table_info").propertygrid("loadData", []);
//	    	  },
//	    	  onSelect : function(title,index){
//		    		
//		    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//		    		if($("#"+id).datagrid()){
//		    		 $("#"+id).datagrid("reload");
//		    		}
//		    }
//	    });
//	    $("#div_bottom_tab").tabs("select",newTitle);
	    return ids;		
	},
	// 검색 부분 그리드 컬럼 정의
	gridColumns: [
	      {field:"itemNo",checkbox:true}                
       	, {field:"managementHeadquartersName", title:"관리본부명", width:120, halign:"center", align:"left", sortable: false}
      	, {field:"managementTeamName",title:"관리팀명", width:120, halign:"center", align:"left", sortable: false}
     	, {field:"engSheetNo", title:"Eng SheetNo", width:150, halign:"center", align:"left", sortable: false}
      	, {field:"workNm",title:"공사명", width:300, halign:"center", align:"left", sortable: false}
    	, {field:"workCd",title:"공사번호", width:100, halign:"center", align:"right", sortable: false}
    	, {field:"agtCd",title:"공사업체명", width:100, halign:"center", align:"left", sortable: false}
    	, {field:"businessYear",title:"사업년도", width:60, halign:"center", align:"left", sortable: false}
    	, {field:"businessPurpose",title:"사업구분명", width:300, halign:"center", align:"left", sortable: false}
    	, {field:"afeNo",title:"AFE차수", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"businessPurpNm",title:"투자구분", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"designOpr",title:"설계(BP)담당자", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"accApprDtYn",title:"정산여부", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"lineCustNm",title:"전용회선사업자", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"upStaNm",title:"상위국", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"upStaAddr",title:"상위국주소", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"downStaNm",title:"하위국", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"downStaAddr",title:"하위국주소", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"validKagongBuilding",title:"유효빌딩 - 가공", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"validGijungBuilding",title:"유효빌딩 - 지중", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"consTypeNm",title:"선로구축방법", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"leadingLen",title:"인입거리", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"newDigLen",title:"관로거리(신설)", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"sktOldDigLen",title:"광케이블 기설거리 - T", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"skbOldDigLen",title:"광케이블 기설거리 - B", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"totalCableLen",title:"광케이블 신설거리", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"closuerCnt",title:"접속함체수량", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"coreCnt",title:"접속코아수", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"digAmt",title:"관로투자비", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"cableAmt",title:"선로투자비", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"engApprDt",title:"기본설계 - ENG 발행일자", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"engSum",title:"기본설계 - ENG 발행금액", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"engApprDt1",title:"실시설계 - 실시설계일자", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"designSum",title:"실시설계 - 실시설계금액", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"accSum",title:"정산", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    ],
    
    searchManagementNumbersByWorkCd: function(workCd) {
    	var targetUrl = "/gis/investmentInfo/searchManagementNumbersByWorkCd";
    	var managementNumbers = 0;
    	
		$.ajax({
	        type: "GET",
	        url: targetUrl,
	        data: {
	        	'workCd': workCd
	        },
	        async: false, // 동기통신
	        dataType: "json",
	        contentType: "charset=UTF-8",
	        success: function(jsonData){
  				if(jsonData) {
  					managementNumbers = jsonData.managementNumbers;
  				} else {
  					$.messager.alert("요청에 실패했습니다.");
  				}
	        },
	        error: function() {
	        	$.messager.alert("요청에 실패했습니다.");
	        }
	    });
		
		return managementNumbers;
    },
	
	/**********************************************************************
	설명 : 통계
	파라메터 :
	리턴값 :
	***********************************************************************/
    searchStatistics: function() {
		var that = this;
		
		var data = that.makeData();
		
		if(testMode) {
			return true;
		}
		
		if(data.managementHeadquartersPK === ""){
			$.messager.alert("알림", "관리본부를 선택해 주세요.");
			return;
		}
		
		var targetUrl = "/gis/investmentInfo/searchStatistics";
    	var id = "investmentInfo";
		var title = "투자비정보 통계";
				
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
	    		
	    		that.addStatisticsDatagridTab(id, title, true, jsonData, function(obj){
	        		var getRowValue = $(obj).datagrid("getSelected");
	        		var managementNumbers = that.searchManagementNumbersByWorkCd(getRowValue.workCd);
	        		gfnHighlightFeatureByUnqMgnosForInvestmentInfo(that.layerName, managementNumbers, true, true, false, null, getRowValue);
	        	});
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
		onclickRow 그리드내에 row를 클릭할때 마다 callback으로 function을 받아 처리
	리터값: 새로 부여된 아이디
	***********************************************************************/	
	addStatisticsDatagridTab: function (id, title, singleSelect, datas, onclickRow) {
		var that = this;

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
//	    var resultContents = 
//	            "<table id=\""+ids+"\"\ class=\"easyui-datagrid\"\" style=\"height:"+commonGridHeight+"px\">" +
//	            "<thead data-options=\"frozen:true\"><tr>" +
//	            "<th data-options=\"field:'itemNo',checkbox:true\"></th>" +
//	            "</tr></thead>" +
//	            "</table>";
	    var resultContents =  "<div id='" + ids + "' ></div>";
	    $("#div_bottom_tab").tabs('add',{
	    	title : newTitle,
	    	content : resultContents,
	    	height : commonGridHeight,
	    	closable : true
//	    	id : ids,
//	    	onBeforeClose: function(title,index){
//	    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//	    		console.log(id)
//	    		var features = tabObj[id];
//
//	    		if(features) {
//	    		   gfnGetLayer("searchLayer").removeFeatures(features);
//	    		   delete tabObj[id];
//	    		}
//	    		if($("#div_east").css("display") != "none"){ 
//		    		$('#div_layout').layout("collapse", "east");
//		    		
//	    		}
//				$("#table_info").propertygrid("loadData", []);
//	    	  },
//	    	  onSelect : function(title,index){
//		    		
//		    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//		    		if($("#"+id).datagrid()){
//		    		 $("#"+id).datagrid("reload");
//		    		}
//		    }
	    });    		
	    
//	    $("#div_bottom_tab").tabs("resize");
//	    $("#div_bottom_tab").tabs("select",newTitle);    
	    $("#" + ids).datagrid({
	          data : datas
	        , frozenColumns: that.gridStatisticsFrozenColumns
	        , columns : that.gridStatisticsColumns
	        , singleSelect : singleSelect
	        , selectOnCheck : false
	        , checkOnSelect : false
	        , remoteSort:false
	        , autoRowHeight: false
	        , showFooter: true
	        , onClickRow :function(rowIndex, rowData){
	            if(onclickRow)
	                onclickRow(this);
	        }
        	, onCheck : function(rowIndex, rowData){
	        	var managementNumbers = that.searchManagementNumbersByWorkCd(rowData.workCd);
	        	gfnHighlightFeatureByUnqMgnosForInvestmentInfo(that.layerName, managementNumbers,false,false,null,null,rowData);
	        	
	        	if(managementNumbers && managementNumbers.length > 0) {
	        		
	        	} else {
	        		$.messager.alert("알림", "선택한 공사에 대한 시설물정보가\n존재하지 않습니다.");
	        	}
	        }
	        , onUncheck : function(rowIndex, rowData){
	        	var layer = gfnGetLayer("searchLayer");
	        	var features = layer.features;
	        	for(var i=features.length-1; i >= 0; i--) {
	        		if(features[i] && features[i].data && features[i].data.unqMgno == rowData.unqMgno) {
	        			layer.removeFeatures(features[i]);
	        		}
	        	}
	        }
	        , onCheckAll : function(rows){
	        	for(var i in rows){
		        	var managementNumbers = that.searchManagementNumbersByWorkCd(rows[i].workCd);
		        	gfnHighlightFeatureByUnqMgnosForInvestmentInfo(that.layerName, managementNumbers,false,false);
	        	}
	        }
	        , onUncheckAll : function(rows){
	        	gfnGetLayer("searchLayer").removeAllFeatures();
	        }
	    });
	    
	    // ToDo
		var total = new Array();
		var nofrozen = $("#" + ids).datagrid('getColumnFields'); 
		
		for(var i = 0; i < nofrozen.length; i++){
			total[i] = 0;
		}
		
		var rows = $("#" + ids).datagrid('getRows');
		
		for(var i = 0; i < rows.length; i++) {  
			total[0]+= rows[i].constructionCount;  // 공사건수
			total[1]+= rows[i].cableInvestmentAmountAvg; //선로투자비(평균)
			total[2]+= rows[i].ductInvestmentAmountAvg; //관로투자비(평균)
			total[3]+= rows[i].sktOldDigLengthAvg; // SKT기설케이블(평균)
			total[4]+= rows[i].skbOldDigLengthAvg; // SKB기설케이블(평균)
			total[5]+= rows[i].totalCableLengthAvg; // 신설케이블(평균)  
			total[6]+= rows[i].coreCntSumAvg; // 케이블용량(평균)
			total[7]+= rows[i].closuerCntAvg; // 접속함체(평균)  
			total[8]+= rows[i].coreCntAvg; // 접속코아(평균)  
			total[9]+= rows[i].ipNewSum; // IP주신설(합계)
			total[10]+= rows[i].validKagongBuildingSum; // 선로구축가공(건수)
			total[11]+= rows[i].leadingLenthSum; // 선로인입가공(건수)  
			total[12]+= rows[i].newDigLengthSum; // 신설관로(합계)   
		} 
		
		$("#" + ids).datagrid('reloadFooter', [{
	    	  constructionCount: total[0]
	    	, cableInvestmentAmountAvg: total[1] / rows.length
	    	, ductInvestmentAmountAvg: total[2] / rows.length
	    	, sktOldDigLengthAvg: total[3] / rows.length
	    	, skbOldDigLengthAvg: total[4] / rows.length
	    	, totalCableLengthAvg: total[5] / rows.length
	    	, coreCntSumAvg: total[6] / rows.length
	    	, closuerCntAvg: total[7] / rows.length
    		, coreCntAvg: total[8] / rows.length
    		, ipNewSum: total[9]
	    	, validKagongBuildingSum: total[10]
	    	, leadingLenthSum: total[11]
	    	, newDigLengthSum: total[12]
	    }]);
		
	    return ids;		
	},
	// 통계 부분 그리드 컬럼 정의
	gridStatisticsFrozenColumns: [
	    [
		      {field:"managementHeadquartersName", title:"관리본부명", width:100, halign:"center", align:"left", sortable: true}
	      	, {field:"businessPurpose",title:"사업구분명", width:140, halign:"center", align:"left", sortable: true}	    	
	      	, {field:"month", title:"월구분", width:60, halign:"center", align:"left", sortable: true}	      
	    ]
    ],
	// 통계 부분 그리드 컬럼 정의
	gridStatisticsColumns: [
	    [	
	    	  {field:"constructionCount",title:"공사건수", width:80, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
	    	, {field:"cableInvestmentAmountAvg",title:"선로투자비(평균)", width:110, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumberFloat2, sorter: gfnNumberSorter}
	    	, {field:"ductInvestmentAmountAvg",title:"관로투자비(평균)", width:110, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumberFloat2, sorter: gfnNumberSorter}
	    	, {field:"sktOldDigLengthAvg",title:"SKT기설케이블(평균)", width:140, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumberFloat2, sorter: gfnNumberSorter}
	    	, {field:"skbOldDigLengthAvg",title:"SKB기설케이블(평균)", width:140, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumberFloat2, sorter: gfnNumberSorter}
	    	, {field:"totalCableLengthAvg",title:"신설케이블(평균)", width:120, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumberFloat2, sorter: gfnNumberSorter}
	    	, {field:"coreCntSumAvg",title:"케이블용량(평균)", width:110, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumberFloat2, sorter: gfnNumberSorter}
	    	, {field:"closuerCntAvg",title:"접속함체(평균)", width:110, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumberFloat2, sorter: gfnNumberSorter}
	    	, {field:"coreCntAvg",title:"접속코아(평균)", width:110, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumberFloat2, sorter: gfnNumberSorter}
	    	, {field:"ipNewSum",title:"IP주신설(합계)", width:110, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter, hidden: true}
	    	, {field:"validKagongBuildingSum",title:"선로구축가공(건수)", width:120, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
	    	, {field:"leadingLenthSum",title:"선로인입가공(건수)", width:120, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
	    	, {field:"newDigLengthSum",title:"신설관로(합계)", width:100, halign:"center", align:"right", sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
	    ]
    ], 
	
	/**********************************************************************
	설명 : 통계 엑셀 출력
	파라메터 :
	리턴값 :
	***********************************************************************/
	downloadStatisticsExcel: function() {
		var that = this;
		
		var data = that.makeData();
		
		if(testMode) {
			return true;
		}
		
		if(data.managementHeadquartersPK === ""){
			$.messager.alert("알림", "관리본부를 선택해 주세요.");
			return;
		}
		
		var downloadUrl = "/gis/investmentInfo/searchStatisticsExcel";
		downloadUrl += '?' + decodeURIComponent($.param(data));	
		
		$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
		$("#frm_file_download").attr("action", downloadUrl);
		$("#frm_file_download").submit();
	},
	
	makeData: function() {
		var that = this;
		
		var coverageType = $("#frmInvestmentInfo input:radio[name='coverageType']:checked").val();
		var sidoLglCd = that.sidoComboBox.combobox('getValue') || 0;
		var sggLglCd = that.sggComboBox.combobox('getValue') || 0;
		var emdlLglCd = that.emdComboBox.combobox('getValue') || 0;
		var lglCd = '';
		var engSheetNo = that.engSheetNo.val();
		var workCd = that.workCd.val();
		var params = {};
		
		
		
		var data = {
	      	  'managementHeadquartersPK': that.managementHeadquarters.combobox('getValue')
	      	, 'startDate': that.startDate.datebox('getValue')
	      	, 'finishDate': that.finishDate.combobox('getValue')
	      	, 'businessYear': that.businessYear.combobox('getText')
	      	, 'businessPurpose': that.businessPurpose.combobox('getText')	      	
	      	, 'engSheetNo' : engSheetNo
	      	, 'workCd' : workCd
	      	, 'totalCount': null
        	, 'page': 1
        	, 'rows': 10
		};
		if(coverageType == "addt") {      		 
//			if(searchCondition.pnu == null || searchCondition.pnu == "") {				
//				//$.messager.alert("알림", "시도, 시군구, 읍면동(리)를 선택해 주세요.");
//				$.messager.alert("알림", "시도를 선택해 주세요.");
//				return;
//			} 
			if(emdlLglCd !== 0) {
				lglCd = emdlLglCd;
			} else if(sggLglCd !== 0) {
				lglCd = sggLglCd;
			} else if(sidoLglCd !== 0){
				lglCd = sidoLglCd;
			}
			$.extend(data, {				
				'lglCd' : lglCd
			});
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
		$.extend(data, {
			'searchType' : "bbox",
			'polygonWKT' : polygonWKT
		});
		}
		if(testMode) {
			var message = "";

			message += "관리본부: " + data.managementHeadquartersPK;
			message += "\nEng 발행일자 Start Date: " + data.startDate;
			message += "\nEng 발행일자 Finish Date: " + data.finishDate;
			message += "\n사업구분명: " + data.businessPurpose;
			message += "\n사업연도: " + data.businessYear;
			message += "\n시도 lglCd: " + sidoLglCd;
			message += "\n시군구 lglCd: " + sggLglCd;
			message += "\n읍면동(리) lglCd: " + emdlLglCd;
			message += "\n검색 lglCd: " + data.lglCd;
			
			console.log(message);
		}
		
		return data;
	}
};


/**********************************************************************
설명 : 투자비정보 상세속성 정보 보기
파라메터 : response - WFS GetFeature 응답 객체
리턴값 :
***********************************************************************/
function gfnShowInfoForInvestmentInfo(row) {
	if(row) {
    	// 도킹 판넬이 닫혀 있을때만 도킹 판넬을 연다.
    	if($("#div_east").css("display") == "none") 
    		$('#div_layout').layout('expand', 'east');
    	$("#div_detail_view").tabs("enableTab", "상세속성");
    	$("#div_detail_view").tabs("select", "상세속성");
    	
    	if(row) {
	    	//정보보기 
	    	
	    	var data= null;
	    	var grpNm = "공사별 투자 상세현황";
	    	
	    	data = {
				"total":10,
		        "rows":[]
		    };
	    	
	    	//data.rows.push({"name":"일련번호","value":i+1,"group":grpNm});
			data.rows.push({"name":"관리본부","value":gfnCheckNullValue(row["managementHeadquartersName"]),"group":grpNm});
			data.rows.push({"name":"관리팀","value":gfnCheckNullValue(row["managementTeamName"]),"group":grpNm});
			data.rows.push({"name":"Eng SheetNo","value":gfnCheckNullValue(row["engSheetNo"]),"group":grpNm});
			data.rows.push({"name":"공사명","value":gfnCheckNullValue(row["workNm"]),"group":grpNm});
			data.rows.push({"name":"공사번호","value":gfnCheckNullValue(row["workCd"]),"group":grpNm});
			data.rows.push({"name":"공사업체명","value":gfnCheckNullValue(row["agtCd"]),"group":grpNm});
			data.rows.push({"name":"사업년도","value":gfnCheckNullValue(row["businessYear"]),"group":grpNm});
			data.rows.push({"name":"사업구분명","value":gfnCheckNullValue(row["businessPurpose"]),"group":grpNm});
			data.rows.push({"name":"AFE차수","value":gfnCheckNullValue(row["afeNo"]),"group":grpNm});
			data.rows.push({"name":"투자구분","value":gfnCheckNullValue(row["businessPurpNm"]),"group":grpNm});
			data.rows.push({"name":"설계(BP)<br>담당자","value":gfnCheckNullValue(row["designOpr"]),"group":grpNm});
			data.rows.push({"name":"정산여부","value":gfnCheckNullValue(row["accApprDtYn"]),"group":grpNm});
			data.rows.push({"name":"전용회선<br>사업자","value":gfnCheckNullValue(row["lineCustNm"]),"group":grpNm});
			data.rows.push({"name":"상위국","value":gfnCheckNullValue(row["upStaNm"]),"group":grpNm});
			data.rows.push({"name":"상위국주소","value":gfnCheckNullValue(row["upStaAddr"]),"group":grpNm});
			data.rows.push({"name":"하위국","value":gfnCheckNullValue(row["downStaNm"]),"group":grpNm});
			data.rows.push({"name":"하위국주소","value":gfnCheckNullValue(row["downStaAddr"]),"group":grpNm});
			data.rows.push({"name":"유효빌딩(가공)","value":gfnCheckNullValue(row["validKagongBuilding"]),"group":grpNm});
			data.rows.push({"name":"유효빌딩(지중)","value":gfnCheckNullValue(row["validGijungBuilding"]),"group":grpNm});
			data.rows.push({"name":"선로구축방법","value":gfnCheckNullValue(row["consTypeNm"]),"group":grpNm});
			data.rows.push({"name":"인입거리","value":gfnFormatNumber(gfnCheckNullValue(row["leadingLen"])),"group":grpNm});
			data.rows.push({"name":"관로거리(신설)","value":gfnFormatNumber(gfnCheckNullValue(row["newDigLen"])),"group":grpNm});
			data.rows.push({"name":"광케이블<br>기설거리 - T","value":gfnFormatNumber(gfnCheckNullValue(row["sktOldDigLen"])),"group":grpNm});
			data.rows.push({"name":"광케이블<br>기설거리 - B","value":gfnFormatNumber(gfnCheckNullValue(row["skbOldDigLen"])),"group":grpNm});
			data.rows.push({"name":"광케이블<br>신설거리","value":gfnFormatNumber(gfnCheckNullValue(row["totalCableLen"])),"group":grpNm});
			data.rows.push({"name":"접속함체수량","value":gfnFormatNumber(gfnCheckNullValue(row["closuerCnt"])),"group":grpNm});
			data.rows.push({"name":"접속코아수","value":gfnFormatNumber(gfnCheckNullValue(row["coreCnt"])),"group":grpNm});
			data.rows.push({"name":"관로투자비","value":gfnFormatNumber(gfnCheckNullValue(row["digAmt"])),"group":grpNm});
			data.rows.push({"name":"선로투자비","value":gfnFormatNumber(gfnCheckNullValue(row["cableAmt"])),"group":grpNm});
			data.rows.push({"name":"기본설계<br>ENG 발행일자","value":gfnCheckNullValue(row["engApprDt"]),"group":grpNm});
			data.rows.push({"name":"기본설계<br>ENG 발행금액","value":gfnFormatNumber(gfnCheckNullValue(row["engSum"])),"group":grpNm});
			data.rows.push({"name":"실시설계일자","value":gfnCheckNullValue(row["engApprDt1"]),"group":grpNm});
			data.rows.push({"name":"실시설계금액","value":gfnFormatNumber(gfnCheckNullValue(row["designSum"])),"group":grpNm});
			data.rows.push({"name":"정산","value":gfnFormatNumber(gfnCheckNullValue(row["accSum"])),"group":grpNm});
	    	
	    	gfnLoadPropertygrid(data);
	    	
	    	// 데이터 추출
	    	//var infoData = gfnLoadCbndData(attrs, addt, area, merges);
    	}
    } else {
        message.getAlert("MSG1013");
    }
}


/**********************************************************************
설명 : 우측 속성창에 검색 결과 표시
파라메터 : data - easyui propertygrid 에서 사용할 json 객체
			 merges - 셀병합 해야할 row 목록 
리턴값 :
***********************************************************************/
function gfnLoadPropertygrid(data) {
    if (data == null)
        return;
    
    // 데이터 저장
    $("#table_info").propertygrid('loadData', data);

    // 내용을 다시 읽는다.
    $("#table_info").propertygrid('reload');
    
    $("#div_detail_view").tabs("resize");
}