"use strict";

var testMode = false;

var interactiveUi = {
	// 엔터키 코드
	KEY_ENTER: 13,

	searchForm : $("#frmInteractiveUi"),
	
	// 검색조건 종류 구분 - addt : 행정구역, bbox : 영역
	searchType : $("#frmInteractiveUi input:radio[name='searchType']"),
	// 시설명
	fctsNm: $("#frmInteractiveUi .fctsNm"),	
	// 고유관리번호
	unqMgno: $("#frmInteractiveUi .unqMgno"),
	// NITS공사번호
	cnstMgno: $("#frmInteractiveUi .cnstMgno"),
	// 자산소유구분
	sysClf: $("#frmInteractiveUi .sysClf"),
	// 시도 ComboBox
	sidoComboBox: $("#frmInteractiveUi .sidoComboBox"),
	// 시군구 ComboBox
	sggComboBox: $("#frmInteractiveUi .sggComboBox"),
	// 읍면동 ComboBox
	emdComboBox: $("#frmInteractiveUi .emdComboBox"),
	// 리 ComboBox
	liComboBox: $("#frmInteractiveUi .liComboBox"),
	
	// 매설위치
	ungrLoc: $("#frmInteractiveUi :checkbox[name='ungrLoc']"),
	// 포설거리
	compLenMin: $("#frmInteractiveUi .compLenMin"),
	// 포설거리
	compLenMax: $("#frmInteractiveUi .compLenMax"),
	// 지도거리
	gisLenMin: $("#frmInteractiveUi .gisLenMin"),
	// 지도거리
	gisLenMax: $("#frmInteractiveUi .gisLenMax"),
	// 코아수
	coreCntMin: $("#frmInteractiveUi .coreCntMin"),
	// 코아수
	coreCntMax: $("#frmInteractiveUi .coreCntMax"),
	// 사용코아수
	useCoreCntMin: $("#frmInteractiveUi .useCoreCntMin"),
	// 사용코아수
	useCoreCntMax: $("#frmInteractiveUi .useCoreCntMax"),
	// 접속코아수
	connCoreCntMin: $("#frmInteractiveUi .connCoreCntMin"),
	// 접속코아수
	connCoreCntMax: $("#frmInteractiveUi .connCoreCntMax"),
	// 설치일자
	compDtCheckBox: $("#frmInteractiveUi .compDtCheckBox"),
	// 설치일자
	compDtStartDate: $("#frmInteractiveUi .compDtStartDate"),
	// 설치일자
	compDtFinishDate: $("#frmInteractiveUi .compDtFinishDate"),
	// 작업지시번호
	workDocNo: $("#frmInteractiveUi .workDocNo"),
	// 케이블제조번호
	caMnftNo: $("#frmInteractiveUi .caMnftNo"),
	// 망 분류
	netClf: $("#frmInteractiveUi :checkbox[name='netClf']"),
	// 서비스구분
	serviceType: $("#frmInteractiveUi :checkbox[name='serviceType']"),
	// 코아수용률
	useCoreGrade: $("#frmInteractiveUi :checkbox[name='useCoreGrade']"),
	// 잔여코아수
	coreRemainingCntMin: $("#frmInteractiveUi .coreRemainingCntMin"),
	// 잔여코아수
	coreRemainingCntMax: $("#frmInteractiveUi .coreRemainingCntMax"),

	bboxSearchButton : $("#frmInteractiveUi .bbox"),
	
	searchButton: $("#frmInteractiveUi .search"),
	
	resetButton: $("#frmInteractiveUi .reset"),
		
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

		// 시도 & 시군구 & 읍면동 combobox 들 초기화
		that.initAddressComboBoxes();
		
		that.initCalendarDateBox();

		that.compDtStartDate.datebox({"disabled": true});
		that.compDtFinishDate.datebox({"disabled": true});		
	},

	
	initCalendarDateBox: function() {
		var that = this;
		
		if(that.finishDate == null) {
			var nowDate = new Date();
			
			var yyyy = nowDate.getFullYear();
			var mm = nowDate.getMonth() + 1;
			var dd = nowDate.getDate();
			
			that.finishDate = yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
		}
		
		if(that.startDate == null) {
			var threeMonthAgoDate = new Date(yyyy, mm - 3, dd);
			
			yyyy = threeMonthAgoDate.getFullYear();
			mm = threeMonthAgoDate.getMonth() + 1;
			dd = threeMonthAgoDate.getDate();
			
			that.startDate = yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
		}
		
		var compDtStartDate = that.compDtStartDate.datebox("setValue", that.startDate);
		var compDtFinishDate = that.compDtFinishDate.datebox("setValue", that.finishDate);
		
		var calendar;
		
		calendar = compDtStartDate.datebox("calendar");
		
		calendar.calendar({
			weeks: ['일','월','화','수','목','금','토'],
			months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
		});	

		calendar = compDtFinishDate.datebox("calendar");
		
		calendar.calendar({
			weeks: ['일','월','화','수','목','금','토'],
			months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
		});
	},	
	
	/**********************************************************************
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
		that.searchType.change(function() {
			var searchType = $("#frmInteractiveUi input:radio[name='searchType']:checked").val();
			if(searchType == "addt") {
				$("#frmInteractiveUi .li_bbox").hide();
				$("#frmInteractiveUi .li_addt").show();
			}
			else {
				$("#frmInteractiveUi .li_addt").hide();
				$("#frmInteractiveUi .li_bbox").show();
			}
		});
		
		// 영역검색
		that.bboxSearchButton.click(function() {
			opener.gfnActiveControl(["interactiveUI"]);
			opener.focus();
		});
		
		// 설치일자 검색 포함 checkBox
		that.compDtCheckBox.click(function() {
			if($("#frmInteractiveUi :checkbox[name='compDtCheckBox']")[0].checked === true) {
				that.compDtStartDate.datebox({"disabled": false});
				that.compDtFinishDate.datebox({"disabled": false});
				
				that.initCalendarDateBox();
			} else {
				that.startDate = that.compDtStartDate.datebox('getValue');
				that.finishDate = that.compDtFinishDate.datebox('getValue');
				
				that.compDtStartDate.datebox({"disabled": true});
				that.compDtFinishDate.datebox({"disabled": true});		
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
	설명 : 시도 & 시군구 & 읍면동 combobox 들 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initAddressComboBoxes: function() {
		var that = this;
		
		that.setAddressComboBoxes(that.sidoComboBox, that.sggComboBox, that.emdComboBox);
	},
		
	/**********************************************************************
	설명 : 검색창 리셋
	파라메터 :
	리턴값 :
	***********************************************************************/
	reset: function() {
		var that = this;
		
		that.searchForm[0].reset();
		
		// easyui 콤보 박스 초기화 처리
		that.sidoComboBox.combobox("clear");
		that.sggComboBox.combobox("clear");
		that.emdComboBox.combobox("clear");
		
		// 검색 구분(지역, 영역) 초기화
		$("#frmInteractiveUi .li_bbox").hide();
		$("#frmInteractiveUi .li_addt").show();
		
		opener.interactive.reset();
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
	설명 : 검색
	파라메터 :
	리턴값 :
	***********************************************************************/
	search: function() {
		var that = this;
		
		// 검색 필터를 3 개 미만으로 설정하면 검색 거부		
		var searchConditionCount = 0;

		var gisCode = [];		
		$("#frmInteractiveUi :checkbox[name='gisCode']:checked").each(function() {
			gisCode.push($(this).val());
		});
		// 시설명
		var fctsNm = that.fctsNm.val();
		// 고유관리번호
		var unqMgno = that.unqMgno.val();		
		// NITS공사번호
		var cnstMgno = that.cnstMgno.val();			
		// 자산소유구분
		var sysClf = [];
		$("#frmInteractiveUi :checkbox[name='sysClf']:checked").each(function() {
			sysClf.push($(this).val());
		});	
		 
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
		};
		
		// 포설거리
		var compLenMin = that.compLenMin.val();	
		// 포설거리
		var compLenMax = that.compLenMax.val();
		// 지도거리
		var gisLenMin = that.gisLenMin.val();	
		// 지도거리
		var gisLenMax = that.gisLenMax.val();
		// 코아수
		var coreCntMin = that.coreCntMin.val();	
		// 코아수
		var coreCntMax = that.coreCntMax.val();
		// 사용코아수
		var useCoreCntMin = that.useCoreCntMin.val();	
		// 사용코아수
		var useCoreCntMax = that.useCoreCntMax.val();
		// 접속코아수
		var connCoreCntMin = that.connCoreCntMin.val();	
		// 접속코아수
		var connCoreCntMax = that.connCoreCntMax.val();	
		// 설치일자
		var compDtStartDate = that.compDtStartDate.datebox('getValue');
		// 설치일자
		var compDtFinishDate = that.compDtFinishDate.datebox('getValue');
		// 작업지시번호
		var workDocNo = that.workDocNo.val();	
		// 케이블제조번호
		var caMnftNo = that.caMnftNo.val();		
		// 매설위치
		var ungrLoc = [];
		for(var i = 0; i < $("#frmInteractiveUi :checkbox[name='ungrLoc']").length; i++) {
			if($("#frmInteractiveUi :checkbox[name='ungrLoc']")[i].checked === true) {
				ungrLoc.push($("#frmInteractiveUi :checkbox[name='ungrLoc']")[i].value);
			}
		}
		// 망 분류
		var netClf = [];
		for(var i = 0; i < $("#frmInteractiveUi :checkbox[name='netClf']").length; i++) {
			if($("#frmInteractiveUi :checkbox[name='netClf']")[i].checked === true) {
				netClf.push($("#frmInteractiveUi :checkbox[name='netClf']")[i].value);
			}
		}
		// 서비스구분
		var serviceType = [];
		for(var i = 0; i < $("#frmInteractiveUi :checkbox[name='serviceType']").length; i++) {
			if($("#frmInteractiveUi :checkbox[name='serviceType']")[i].checked === true) {
				serviceType.push($("#frmInteractiveUi :checkbox[name='serviceType']")[i].value);
			}
		}
		// 코아수용률
		var useCoreGrade = [];
		for(var i = 0; i < $("#frmInteractiveUi :checkbox[name='useCoreGrade']").length; i++) {
			if($("#frmInteractiveUi :checkbox[name='useCoreGrade']")[i].checked === true) {
				useCoreGrade.push($("#frmInteractiveUi :checkbox[name='useCoreGrade']")[i].value);
			}
		}
		// 잔여코아수
		var coreRemainingCntMin = that.coreRemainingCntMin.val();
		// 잔여코아수
		var coreRemainingCntMax = that.coreRemainingCntMax.val();
				
		// ToDo
		var message = "";

		message += "gisCode: " + gisCode.join();
		message += "\n시설명: " + fctsNm;
		message += "\n고유관리번호: " + unqMgno;
		message += "\nNITS공사번호: " + cnstMgno;
		message += "\n자산소유구분: " + sysClf.join();
		message += "\n시도 lglCd: " + sidoLglCd;
		message += "\n시군구 lglCd: " + sggLglCd;
		message += "\n읍면동(리) lglCd: " + emdlLglCd;
		message += "\n검색 lglCd: " + lglCd;		
		
		message += "\n매설위치: " + ungrLoc.join();
		message += "\n포설거리: " + compLenMin;
		message += "\n포설거리: " + compLenMax;
		message += "\n지도거리: " + gisLenMin;
		message += "\n지도거리: " + gisLenMax;
		message += "\n코아수: " + coreCntMin;
		message += "\n코아수: " + coreCntMax;
		message += "\n사용코아수: " + useCoreCntMin;
		message += "\n사용코아수: " + useCoreCntMax;
		message += "\n접속코아수: " + connCoreCntMin;
		message += "\n접속코아수: " + connCoreCntMax;
		message += "\n설치일자: " + compDtStartDate;
		message += "\n설치일자: " + compDtFinishDate;
		message += "\n작업지시번호: " + workDocNo;
		message += "\n케이블제조번호: " + caMnftNo;
		message += "\n망 분류: " + netClf.join();
		message += "\n서비스구분: " + serviceType.join();
		message += "\n코아수용률: " + useCoreGrade.join();
		message += "\n잔여코아수: " + coreRemainingCntMin;
		message += "\n잔여코아수: " + coreRemainingCntMax;
		
		if(testMode) {
			console.log(message);
			return true;
		}
				
		var searchType = $("#div_interactiveUi_search input:radio[name='searchType']:checked").val();
				
		if(searchType == "addt") {
			if(sggLglCd == 0) {
				$.messager.alert("알림", "시도/시군구를 선택해 주세요.");
				return;			
			}
			
			if(gisCode.length > 0 ) { searchConditionCount++; }
			if(fctsNm.length > 0 ) { searchConditionCount++; }
			if(unqMgno.length > 0 ) { searchConditionCount++; }
			if(cnstMgno.length > 0 ) { searchConditionCount++; }
			if(sysClf.length > 0 ) { searchConditionCount++; }
			
			
			if(sidoLglCd != 0 ) { searchConditionCount++; }
			if(sggLglCd != 0 ) { searchConditionCount++; }
			if(emdlLglCd != 0 ) { searchConditionCount++; }		

			if(ungrLoc.length > 0 ) { searchConditionCount++; }
			if(compLenMin.length > 0 ) { searchConditionCount++; }
			if(compLenMax.length > 0 ) { searchConditionCount++; }
			if(gisLenMin.length > 0 ) { searchConditionCount++; }
			if(gisLenMax.length > 0 ) { searchConditionCount++; }
			if(coreCntMax.length > 0 ) { searchConditionCount++; }
			if(coreCntMax.length > 0 ) { searchConditionCount++; }
			if(useCoreCntMin.length > 0 ) { searchConditionCount++; }
			if(useCoreCntMax.length > 0 ) { searchConditionCount++; }
			if(connCoreCntMin.length > 0 ) { searchConditionCount++; }
			if(connCoreCntMax.length > 0 ) { searchConditionCount++; }
			if(compDtStartDate.length > 0 ) { searchConditionCount++; }
			if(compDtFinishDate.length > 0 ) { searchConditionCount++; }
			if(workDocNo.length > 0 ) { searchConditionCount++; }
			if(caMnftNo.length > 0 ) { searchConditionCount++; }
			if(netClf.length > 0 ) { searchConditionCount++; }
			if(serviceType.length > 0 ) { searchConditionCount++; }
			if(useCoreGrade.length > 0 ) { searchConditionCount++; }
			if(coreRemainingCntMin.length > 0 ) { searchConditionCount++; }
			if(coreRemainingCntMax.length > 0 ) { searchConditionCount++; }
			
			if(searchConditionCount < 3) {
				$.messager.alert("알림", "검색 필터를 3가지 이상 선택해 주세요.");
				return;
			}
		}
		
		var targetUrl = "/gis/interactiveUi/search";
    	var data = {
    	      'gisCode': gisCode.join()
        	, 'fctsNm': fctsNm
        	, 'unqMgno': unqMgno
        	, 'cnstMgno': cnstMgno
        	, 'sysClf': sysClf.join()
        	
        	
        	, 'ungrLoc':ungrLoc.join()
        	, 'compLenMin':compLenMin
        	, 'compLenMax':compLenMax
        	, 'gisLenMin':gisLenMin
        	, 'gisLenMax':gisLenMax
        	, 'coreCntMin':coreCntMin
        	, 'coreCntMax':coreCntMax
        	, 'useCoreCntMin':useCoreCntMin
        	, 'useCoreCntMax':useCoreCntMax
        	, 'connCoreCntMin':connCoreCntMin
        	, 'connCoreCntMax':connCoreCntMax
        	, 'compDtStartDate':compDtStartDate
        	, 'compDtFinishDate':compDtFinishDate
        	, 'workDocNo':workDocNo
        	, 'caMnftNo':caMnftNo
        	, 'netClf':netClf.join()
        	, 'serviceType':serviceType.join()
        	, 'useCoreGrade':useCoreGrade.join()
        	, 'coreRemainingCntMin':coreRemainingCntMin
        	, 'coreRemainingCntMax':coreRemainingCntMax

        	, 'totalCount': 0
        	, 'page': 1
        	, 'rows': 10
        	, 'fetchCount' : 0
        };
		
		var searchType = $("#div_interactiveUi_search input:radio[name='searchType']:checked").val();
		if(searchType == "addt") {
			data.lglCd = lglCd;
		}
		else {
			var polygonWKT = opener.interactive.getPolygonWKT();
			if(!polygonWKT) {
				$.messager.alert("알림", "검색할 영역을 지정하여 주십시오.");
				return;
			}
			else if(polygonWKT == "over") {
				$.messager.alert("알림", "1000k㎢ 이하로 영역을 지정하여 주십시오.");
				return;
			}
			data.polygonWKT = polygonWKT;
		}
		
		$.ajax({
	        type: "GET",
	        url: targetUrl,
	        data: data,
	        dataType: "json",
	        contentType: "charset=UTF-8",
	        success: function(jsonData){
	    		if(jsonData.nodes.length == 0 || jsonData.links.length == 0){
	    			$.messager.alert("알림", "검색결과가 없습니다.");
	    			return false;
	    		}
	    		
	    		$("#div_Main").empty();
	    		that.showD3(jsonData);
        	}
	    });
	},
	
	showD3: function(jsonData) {
		// 원 그리기
		var nodes = [];
		// 선 그리기
		var links = [];
		// 원에 라벨 붙이기
		var labelAnchors = [];
		// 원과 라벨 사이에 투명선 그리기
		var labelAnchorLinks = [];

		// 데이터 준비
		var myNodes = jsonData.nodes;
		var myLinks = jsonData.links;

		var maxLength = myNodes.length;
		
		for(var i = 0; i < maxLength; i++) {
			var node = {
				label : myNodes[i].tpoName || myNodes[i].jpName,
				nodeId : myNodes[i].nodeId,
				tpoCode: myNodes[i].tpoCode,
				idx : i
			};
			nodes.push(node);
			labelAnchors.push({
				node : node
			});
			labelAnchors.push({
				node : node
			});
		};
		
		for(var i = 0; i < nodes.length; i++) {
			labelAnchorLinks.push({
				source : i * 2,
				target : i * 2 + 1,
				weight : 10
			});
		};
		
		for(var i = 0; i < maxLength; i++) {
			$.each(myLinks, function(_sourceIndex, _myLink) {
				if(_myLink.source == nodes[i].nodeId) {
					var _source = i;
					
					$.each(nodes, function(_targetIndex, _node) {
						if(_node.nodeId == _myLink.target) {
							var _target = _targetIndex;
							
							links.push({
								source: _source,
								target: _target,
								sourceLabel: nodes[i].label,
								targetLabel: _node.label,
								sysClf: _myLink.sysClf,
								cableLabel: _myLink.sumCoreCnt + " / " + _myLink.sumUseCoreCnt + " (" + _myLink.countCable + ")",
								useRate: (_myLink.sumUseCoreCnt / _myLink.sumCoreCnt * 100),
								weight: Math.random()
							});
						}
					});
				}
			});
		};		

		var color = d3.scale.category20();
		
		var labelDistance = 0;
		
		var margin = {
				top : 0,
				right : 0,
				bottom : 0,
				left : 0
			}

		var width = $("#div_Main").width() - margin.left - margin.right - 5;
		var height = $("#div_Main").height() - margin.top - margin.bottom - 5;
		
		var vis = d3.select("#div_Main").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("pointer-events", "all")
			.append("g")
			//.attr("transform", "translate(" + margin.left + "," + margin.right + ")")
			.call(d3.behavior.zoom().on("zoom", redraw))
			.append('g');

		// 줌인 줌아웃 이벤트 발생용		
		vis.append('rect')
		    .attr('width', width)
		    .attr('height', height)
		    .attr('fill', 'rgba(1,1,1,0)'); 
		
		//var force = d3.layout.force().size([w, h]).nodes(nodes).links(links).gravity(fnGravity).linkDistance(50).charge(-3000).linkStrength(fnLinkStrength);
		// fnGravity 안 먹음
		var force = d3.layout.force().size([width, height]).nodes(nodes).links(links).gravity(1).linkDistance(fnLinkDistance).charge(-100  * width / maxLength).linkStrength(fnLinkStrength);
		var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(0).linkStrength(8).charge(-100).size([width, height]);

		force.start();
		force2.start();

		var link = vis.selectAll("link").data(links).enter().append("line").attr("class", "link");
		link.style("stroke", function(k) { return linkColor(k); })
			.style("stroke-width", function(k) { return linkWidth(k); });
			
		// START: Line 에 텍스트 표시하기
		var label = vis.selectAll("lineLabel").data(links).enter().append("g").attr("class", "anchorNode")
			.append('text')
			.attr("text-anchor", "middle")
			.style("fill", "#000000")
			.style("font-family", "Arial")
			.style("font-size", 4)
			.text(function(d) {
				return d.cableLabel;
			});
		// FINISH: Line 에 텍스트 표시하기
		
		var node = vis.selectAll("node").data(force.nodes()).enter().append("g").attr("class", "node");
		node.append("circle").attr("r", function(d) {
				if(d.tpoCode) {
					switch(d.tpoCode) {
					case "TPO001":
						return 7;
						break;
					case "TPO002":
						return 5;
						break;
					case "TPO003":
						return 3;
						break;
					case "TPO004":
						return 3;
						break;
					case "TPO005":
						return 3;
						break;
					default:
						return 3;
					}
				} else {
					return 3;
				}
			})
/*			
			.style("stroke", function(d) {
				if(d.tpoCode) {
					switch(d.tpoCode) {
					case "TPO001":
					case "TPO002":
					case "TPO003":
						return "#FF0000";
						break;
					case "TPO004":
						return "#0000FF";
						break;
					default:
						return "#00FF00";
					}
				} else {
					return "#000000";
					//return color(d.label);
				}
			})
			.style("stroke-width", function(d) {
				if(d.tpoCode) {
					switch(d.tpoCode) {
					case "TPO001":
					case "TPO002":
						return 15;
						break;
					case "TPO003":
						return 10;
						break;
					case "TPO004":
						return 5;
						break;
					case "TPO005":
						return 5;
						break;
					default:
						return 5;
					}
				} else {
					return 5;
				}
			})
*/			
			.style("fill", function(d) {
				if(d.tpoCode) {
					switch(d.tpoCode) {
					case "TPO001":
						return "#FF0000";
						break;
					case "TPO002":
						return "#FF00FF";
						break;
					case "TPO003":
						return "#FF9900";
						break;
					case "TPO004":
						return "#0000FF";
						break;
					default:
						return "#00FF00";
					}
				} else {
					return "#000000";
				}
			});
			
		node.call(force.drag);

		var anchorLink = vis.selectAll("anchorLink").data(labelAnchorLinks);//.enter().append("line").attr("class", "anchorLink").style("stroke", "#999");

		var anchorNode = vis.selectAll("anchorNode").data(force2.nodes()).enter().append("g").attr("class", "anchorNode");
		anchorNode.append("circle").attr("r", 0)
			.style("fill", "#FFF");
			
		anchorNode.append("text").text(function(d, i) { return i % 2 == 0 ? "" : d.node.label; })
			.style("fill", "#555")
			.style("font-family", "Arial")
			.style("font-size", 4);

		var updateLink = function() {
			this.attr("x1", function(d) {
				return d.source.x;
			}).attr("y1", function(d) {
				return d.source.y;
			}).attr("x2", function(d) {
				return d.target.x;
			}).attr("y2", function(d) {
				return d.target.y;
			});
		}

		var updateNode = function() {
			this.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
		}
		
		var updateLabel = function() {			
			this.attr("transform", function(d) {
				var x = (d.source.x + d.target.x) / 2;
				var y = (d.source.y + d.target.y) / 2;
				
				return "translate(" + x + "," + y + ")";
			});
		}

		force.on("tick", function() {
			force2.start();

			anchorNode.each(function(d, i) {
				if(i % 2 == 0) {
					d.x = d.node.x;
					d.y = d.node.y;
				} else {
					var b = this.childNodes[1].getBBox();

					var diffX = d.x - d.node.x;
					var diffY = d.y - d.node.y;

					var dist = Math.sqrt(diffX * diffX + diffY * diffY);

					var shiftX = b.width * (diffX - dist) / (dist * 2);
					shiftX = Math.max(-b.width, Math.min(0, shiftX));
					var shiftY = 5;
					this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
				}
			});

			node.call(updateNode);
			link.call(updateLink);
			label.call(updateLabel);
			anchorNode.call(updateNode);
			anchorLink.call(updateLink);
		});
		
		// 줌인 줌아웃 이벤트 핸들러
		function redraw() {
			console.log("here", d3.event.translate, d3.event.scale);
			vis.attr("transform","translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")"); 
		}	

		// 링크 라인 칼라 지정 
		function linkColor(k) {
			var color = "#D2691E";
			
			if(k.sysClf == "SK") {
				color = "#CD1039";
			} else if(k.sysClf == "HT") {
					color = "#1E90FF";
			}
			
			return color;
		}

		// 링크 라인 두께 지정
		function linkWidth(k) {
			var lineWidth = 1;
			
			if(k.useRate >= 80.0) {
				lineWidth = 3;
			}
			
			return lineWidth;
		}
		
		// 중력값 조절
		function fnGravity(x) {
			//console.log("fnGravity : " + x);
						
			if(x.sourceLabel && x.targetLabel) {
				return 2;
			} else {
				return 1;
			}
		}
		
		function fnLinkDistance(x) {
			// TPO 끼리는 멀리 배치
			if(x.sourceLabel && x.targetLabel) {
				return 30;
			} else {
				return 30;
			}
		}
		
		function fnLinkStrength(x) {
			//return x.weight * 10
			
			// TPO 는 강한 힘으로 배치
			if(x.sourceLabel && x.targetLabel) {
				return 0.9;
			} else {
				return 1.2;
			}
		}
	}
};