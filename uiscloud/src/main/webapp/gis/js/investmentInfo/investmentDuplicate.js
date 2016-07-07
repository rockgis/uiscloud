"use strict";

var investmentDuplicate = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 관리본부
	managementHeadquarters: $("#frmInvestmentDuplicate .managementHeadquarters"),
	// 신설사업자
	investSysClf: $("#frmInvestmentDuplicate :checkbox[name='sysClf']"),
	// Eng 발행일자 Start Date
	startDate: $("#frmInvestmentDuplicate .startDate"),	
	// Eng 발행일자 Finish Date
	finishDate: $("#frmInvestmentDuplicate .finishDate"),
	// Eng Sheet No
	engSheetNo: $("#frmInvestmentDuplicate .engSheetNo"),
	// 공사번호
	workCd: $("#frmInvestmentDuplicate .workCd"),
	// 사업연도
	businessYear: $("#frmInvestmentDuplicate .businessYear"),
	// 사업구분명
	businessPurpose: $("#frmInvestmentDuplicate .businessPurpose"),	
	// 시도 ComboBox
	sidoComboBox: $("#frmInvestmentDuplicate .sidoComboBox"),
	// 시군구 ComboBox
	sggComboBox: $("#frmInvestmentDuplicate .sggComboBox"),
	// 읍면동 ComboBox
	emdComboBox: $("#frmInvestmentDuplicate .emdComboBox"),
	// 리 ComboBox
	liComboBox: $("#frmInvestmentDuplicate .liComboBox"),	
	//검색 타입
	coverageType : $("#frmInvestmentDuplicate input:radio[name='coverageType']"),
	
	searchButton: $("#frmInvestmentDuplicate .search"),
	
	bboxSearchButton: $("#frmInvestmentDuplicate .bbox"),
	
	searchStatisticsButton: $("#frmInvestmentDuplicate .searchStatistics"),
	
	downloadStatisticsExcelButton: $("#frmInvestmentDuplicate .downloadStatisticsExcel"),
	
	resetButton: $("#frmInvestmentDuplicate .reset"),
	
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
		
		that.layer = new BiesVector("investDup",{
			styleMap : new OpenLayers.StyleMap({
				'default': new OpenLayers.Style(null, {
					rules: [new OpenLayers.Rule({
						symbolizer : {
							"Point": {
								pointRadius: 4,
								graphicName: "circle",
								fillColor: "\${fillColor}",
								fillOpacity: "\${fillOpacity}",
								strokeWidth: 3,
								strokeOpacity: 1,
								strokeColor: "\${strokeColor}"
							},
							"Line": {
								strokeWidth: "\${strokeWidth}",
								strokeOpacity: "\${strokeOpacity}",
								strokeColor: "\${strokeColor}",
								strokeDashstyle : "solid"
							},
							"Polygon": {
								strokeWidth: 3,
								strokeOpacity: 1,
								strokeColor: "#ffff00",
								fillColor: "#ffff00",
								fillOpacity: 0
							}
						}
					})]
				})
			})
		});
		
		map.addLayer(that.layer);
//		
//		var control = new OpenLayers.Control.DrawFeature(that.layer, OpenLayers.Handler.Polygon, { 
//			id : "invest"
//		});
//		map.addControl(control);
//		
//		that.layer.events.on({
//			"beforefeaturesadded" : function() {
//				$("#btn_pan img").trigger("click");
//				that.layer.removeAllFeatures();
//				$("#div_west").focus();
//			}
//		});
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
					editable : false    				
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
			var coverageType = $("#frmInvestmentDuplicate input:radio[name='coverageType']:checked").val();
			if(coverageType == "addt") {
				$("#frmInvestmentDuplicate .li_bbox").hide();
				$("#frmInvestmentDuplicate .li_addt").show();
			}
			else {
				$("#frmInvestmentDuplicate .li_addt").hide();
				$("#frmInvestmentDuplicate .li_bbox").show();
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
		
		var targetUrl = "/gis/investmentInfo/searchDuplicate";
    	var id = "searchDuplicate";
		var title = "중복투자 검색";
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
//
	        		//gfnHighlightFeatureByUnqMgnos(that.layerName, getRowValue.unqMgno, true, true, true);
//	        		var managementNumbers = that.searchManagementNumbersByWorkCd(getRowValue.g1cnstmgno);
	        		//gfnHighlightFeatureByUnqMgnosForInvestmentInfoDup(that.layerName, getRowValue.unqmgno, true, true, true, function() {}, getRowValue);
	        	
//	        		gfnHighlightFeatureByUnqMgnosForInvestmentInfoDup(that.layerName, getRowValue.g2unqmgno, true, true, true, function() {}, getRowValue);
//	        	});
	    	    
	    	   
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
		gfnClearCheckBoxGroup(that.investSysClf);
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
//	    });    		
//	    $("#div_bottom_tab").tabs({
//			onBeforeClose : function(title,index){
//	    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//	    		var markers = map.getLayer("Markers");
//	    		var features = tabObj[id];
//	    		var marker = aRoutingSearch.arrMarkers;
//	    		if(features) {	    			
//		    		   gfnGetLayer("searchLayer").removeFeatures(features);
//		    		   dynamicSld.layer.removeFeatures(features);
//		    		   if(gfnGetLayer("demand_layer") != null){
//		    			   gfnGetLayer("demand_layer").removeFeatures(features);
//		    		   }
//		    		   if(marker){
//		    			   for(var z=0; z < marker.length; z++){
//			    				markers.removeMarker(marker[z]);			    				
//			    			}
//		    			   aRoutingSearch.arrMarkers = [];
//			    	  }
//		    		   delete tabObj[id];
//		    	}
//	    		
//	    		if($("#div_east").css("display") != "none"){ 
//		    		$('#div_layout').layout("collapse", "east");
//		    		
//	    		}
//				$("#table_info").propertygrid("loadData", []);
//	    	},
//	    	onSelect : function(title,index){
//	    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//	    		if($("#"+id).datagrid()){
//	    		  $("#"+id).datagrid("reload");
//	    		}
//	    	}
//		});
  
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
	        	gfnGetFeatureById(prefix+"gotc_ca", [rowData.gid,rowData.g2gid],true, true, true, function(res) {        		
	        		var layer = gfnGetLayer("searchLayer");
//	        		layer.removeAllFeatures();
	        		that.layer.removeAllFeatures();
	        		var list = [];
    				var eps = res.features;
    				if(eps.length > 0) {
    					for(var i=0, len=eps.length; i < len; i++) {
        					var ep = eps[i];
        					if(ep.data.ca_mgno == rowData.camgno){
	        					ep.attributes = {
	        						strokeWidth : 4,
	        						strokeOpacity : 0.85,
	            					strokeColor : "#C97CA3"            					
	    	        			};	        
	        					list.push(ep);
        					}else if(ep.data.ca_mgno == rowData.g2camgno){
        						ep.attributes = {
                						strokeWidth : 4,
                						strokeOpacity : 0.85,
                    					strokeColor : "#009300"            					
            	        			};
        						list.push(ep);
        					}        					
        				}    					
    				}

    				that.layer.addFeatures(list);
					that.layer.redraw();
	        	});
	        },
	        onDblClickRow: function(index, row) {
	        	window.open("/gis/investmentInfo/checkDuplicate?investDupSeq=" + row.investDupSeq, "_new", "width=600, height=500");
	        }
        
	    });
	    
	    return ids;		
	},
	// 검색 부분 그리드 컬럼 정의
	gridColumns: [     
       	  {field:"managementHeadquartersName", title:"관리본부", width:100, halign:"center", align:"left", sortable: false}	
		, {field:"camgno", title:"신설케이블관리번호", width:130, halign:"center", align:"left", sortable: false,hidden:true}
      	, {field:"unqmgno",title:"신설케이블 SK관리번호", width:130, halign:"center", align:"right", sortable: false}
      	, {field:"g1lglNm", title:"법정동명", width:150, halign:"center", align:"left", sortable: false,}
     	, {field:"g1lglcd", title:"법정동코드", halign:"center", align:"left", sortable: false,hidden:true}
      	, {field:"g1sysclf",title:"신설사업자", width:80, halign:"center", align:"left", sortable: false}
    	, {field:"g1ungrloc",title:"신설가공_지중", width:80, halign:"center", align:"right", sortable: false}
    	, {field:"g1complen",title:"신설포설길이", width:100, halign:"center", align:"right", sortable: false}
    	, {field:"g1gislen",title:"신설도상거리", width:100, halign:"center", align:"right", sortable: false}
    	, {field:"g1corecnt",title:"신설용량", width:80, halign:"center", align:"right", sortable: false}
    	, {field:"g1usecorecnt",title:"신설사용코어", width:100, halign:"center", align:"right", sortable: false}
    	, {field:"g1conncnt",title:"신설연결코어", width:100, halign:"center", align:"right", sortable: false}
    	, {field:"g1cnstmgno",title:"신설케이블공사번호", width:130, halign:"center", align:"right", sortable: false}
    	, {field:"g2camgno",title:"기설케이블관리번호", halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"g2unqmgno",title:"기설케이블 SK관리번호", width:130, halign:"center", align:"right", sortable: false}
      	, {field:"g2lglNm", title:"법정동명", width:150, halign:"center", align:"left", sortable: false}
    	, {field:"g2lglcd",title:"법정동코드", halign:"center", align:"left", sortable: false,hidden:true}
    	, {field:"g2sysclf",title:"기설사업자", width:80, halign:"center", align:"left", sortable: false}
    	, {field:"g2ungrloc",title:"기설가공_지중", width:80, halign:"center", align:"left", sortable: false}
    	, {field:"g2complen",title:"기설포설길이", width:100, halign:"center", align:"right", sortable: false}
    	, {field:"g2gislen",title:"기설도상거리", width:100, halign:"center", align:"right", sortable: false}
    	, {field:"g2corecnt",title:"기설용량", width:100, halign:"center", align:"right", sortable: false}
    	, {field:"g2usecorecnt",title:"기설사용코어", width:100, halign:"center", align:"right", sortable: false}
    	, {field:"g2conncnt",title:"기설연결코어", width:100, halign:"center", align:"right", sortable: false}
    	, {field:"g2cnstmgno",title:"기설케이블공사번호", width:130, halign:"center", align:"right", sortable: false}
    	, {field:"chkInsertOpr",title:"수장자", width:130, halign:"center", align:"left", sortable: false}
    	, {field:"chkInsertDt",title:"수정일", width:130, halign:"center", align:"center", sortable: false}
    ],
    
    
	makeData: function() {
		var that = this;
		
//		var coverageType = $("#frmInvestmentDuplicate input:radio[name='coverageType']:checked").val();
		var sidoLglCd = that.sidoComboBox.combobox('getValue') || 0;
		var sggLglCd = that.sggComboBox.combobox('getValue') || 0;
		var emdlLglCd = that.emdComboBox.combobox('getValue') || 0;
		var lglCd = '';
		var sysClf =  gfnCheckBoxCheckedToArray(that.investSysClf).join();
		
//		var engSheetNo = that.engSheetNo.val();
//		var workCd = that.workCd.val();
//		var params = {};
		
		
		
		var data = {
			  'managementHeadquartersPK': that.managementHeadquarters.combobox('getValue')
			, 'sysClf' : sysClf
	      	, 'startDate': that.startDate.datebox('getValue')
	      	, 'finishDate': that.finishDate.combobox('getValue')	      	
	      	, 'totalCount': null
        	, 'page': 1
        	, 'rows': 10
		};
//		if(coverageType == "addt") {      		 
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
//		} else {
//			var features = that.layer.features;
//			if(features.length == 1) {
//				var format = new OpenLayers.Format.WKT();
//				var polygonWKT = format.write(features[0]);
//				params = {
//					searchType : "bbox"
//					, polygonWKT : polygonWKT
//				};
//			}
//			if(!params.polygonWKT)  {
//				$.messager.alert("알림", "영역을 지정해 주세요.");
//				return false;
//			} 		
//		$.extend(data, {
//			'searchType' : "bbox",
//			'polygonWKT' : polygonWKT
//		});
//		}
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

