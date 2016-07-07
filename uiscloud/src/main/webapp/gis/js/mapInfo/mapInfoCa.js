"use strict";

var mapInfoCa = {
	// 엔터키 코드
	KEY_ENTER: 13,	
	
	// 시설물 종류
	facilityKind: $("#div_mapInfo_search .facilityKind"),		
	// 시설명
	fctsNm: $("#div_mapInfo_search .fctsNm"),	
	// 고유관리번호
	unqMgno: $("#div_mapInfo_search .unqMgno"),
	// NITS공사번호
	cnstMgno: $("#div_mapInfo_search .cnstMgno"),
	// 자산소유구분
	sysClf: $("#div_mapInfo_search :checkbox[name='sysClf']"),
	// 시도 ComboBox
	sidoComboBox: $("#div_mapInfo_search .sidoComboBox"),
	// 시군구 ComboBox
	sggComboBox: $("#div_mapInfo_search .sggComboBox"),
	// 읍면동 ComboBox
	emdComboBox: $("#div_mapInfo_search .emdComboBox"),
	// 리 ComboBox
	liComboBox: $("#div_mapInfo_search .liComboBox"),
	
	// 광케이블 구분
	gisCode: $("#div_mapInfo_search .gotc_ca :checkbox[name='gisCode']"),
	
	// 매설위치
	ungrLoc: $("#div_mapInfo_search #gotc_ca :checkbox[name='ungrLoc']"),
	// 포설거리
	compLenMin: $("#div_mapInfo_search #gotc_ca .compLenMin"),
	// 포설거리
	compLenMax: $("#div_mapInfo_search #gotc_ca .compLenMax"),
	// 지도거리
	gisLenMin: $("#div_mapInfo_search #gotc_ca .gisLenMin"),
	// 지도거리
	gisLenMax: $("#div_mapInfo_search #gotc_ca .gisLenMax"),
	// 코아수
	coreCntMin: $("#div_mapInfo_search #gotc_ca .coreCntMin"),
	// 코아수
	coreCntMax: $("#div_mapInfo_search #gotc_ca .coreCntMax"),
	// 사용코아수
	useCoreCntMin: $("#div_mapInfo_search #gotc_ca .useCoreCntMin"),
	// 사용코아수
	useCoreCntMax: $("#div_mapInfo_search #gotc_ca .useCoreCntMax"),
	// 접속코아수
	connCoreCntMin: $("#div_mapInfo_search #gotc_ca .connCoreCntMin"),
	// 접속코아수
	connCoreCntMax: $("#div_mapInfo_search #gotc_ca .connCoreCntMax"),
	// 설치일자
	compDtCheckBox: $("#div_mapInfo_search #gotc_ca :checkbox[name='compDtCheckBox']"),
	// 설치일자
	compDtStartDate: $("#div_mapInfo_search #gotc_ca .compDtStartDate"),
	// 설치일자
	compDtFinishDate: $("#div_mapInfo_search #gotc_ca .compDtFinishDate"),
	// 작업지시번호
	workDocNo: $("#div_mapInfo_search #gotc_ca .workDocNo"),
	// 케이블제조번호
	caMnftNo: $("#div_mapInfo_search #gotc_ca .caMnftNo"),
	// 망 분류
	netClf: $("#div_mapInfo_search #gotc_ca :checkbox[name='netClf']"),
	// 서비스구분
	serviceType: $("#div_mapInfo_search #gotc_ca :checkbox[name='serviceType']"),
	// 코아수용률
	useCoreGrade: $("#div_mapInfo_search #gotc_ca :checkbox[name='useCoreGrade']"),
	// 잔여코아수
	coreRemainingCntMin: $("#div_mapInfo_search #gotc_ca .coreRemainingCntMin"),
	// 잔여코아수
	coreRemainingCntMax: $("#div_mapInfo_search #gotc_ca .coreRemainingCntMax"),

	searchButton: $("#div_mapInfo_search #gotc_ca .search"),
	
	resetButton: $("#div_mapInfo_search #gotc_ca .reset"),

	startDate: null,
	finishDate: null,
	
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
		
//		// 시설명 10글자 제한
//		that.fctsNm.validatebox({
//			validType : ["maxLength[10]"],
//			tipPosition : "right"
//		});
//
//		// 고유관리번호 33글자 제한
//		that.unqMgno.validatebox({
//			validType : ["maxLength[33]"],
//			tipPosition : "right"
//		});
//		
//		// NITS공사번호 21글자 제한
//		that.cnstMgno.validatebox({
//			validType : ["maxLength[21]"],
//			tipPosition : "right"
//		});
//		
//		// 시설물 종류 combobox 초기화
//		that.initFacilityKindComboBox();
				
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
		
		// 설치일자 검색 포함 checkBox
		that.compDtCheckBox.click(function() {
			if(that.compDtCheckBox[0].checked === true) {
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
	설명 : 검색
	파라메터 :
	리턴값 :
	***********************************************************************/
	search: function() {
		var that = this;
		
		// 검색 필터를 3 개 미만으로 설정하면 검색 거부		
		var searchConditionCount = 0;
		
		var data = {
			// 시설물 테이블
    	      'tableName': that.facilityKind.combobox('getValue')
			// 시설명
        	, 'fctsNm': that.fctsNm.val()
    		// 고유관리번호
        	, 'unqMgno': that.unqMgno.val()			
    		// NITS공사번호
        	, 'cnstMgno': that.cnstMgno.val()	
    		// 자산소유구분
        	, 'sysClf': gfnCheckBoxCheckedToArray(that.sysClf).join()
        	// PNU 코드
        	, 'lglCd': (function() {       		 
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
        		
        		return lglCd;
        	})()

			// 광케이블 구분
	  	    , 'gisCode': gfnCheckBoxCheckedToArray(that.gisCode).join()
        	
        	// 매설위치        	
        	, 'ungrLoc': gfnCheckBoxCheckedToArray(that.ungrLoc).join()
    		// 포설거리
            , 'compLenMin': that.compLenMin.val()	
    		// 포설거리
            , 'compLenMax': that.compLenMax.val()
    		// 지도거리
            , 'gisLenMin': that.gisLenMin.val()	
    		// 지도거리
            , 'gisLenMax': that.gisLenMax.val()
    		// 코아수
            , 'coreCntMin': that.coreCntMin.val()	
    		// 코아수
            , 'coreCntMax': that.coreCntMax.val()
    		// 사용코아수
            , 'useCoreCntMin': that.useCoreCntMin.val()	
    		// 사용코아수
            , 'useCoreCntMax': that.useCoreCntMax.val()
    		// 접속코아수
            , 'connCoreCntMin': that.connCoreCntMin.val()	
    		// 접속코아수
            , 'connCoreCntMax': that.connCoreCntMax.val()	
    		// 설치일자
            , 'compDtStartDate': that.compDtStartDate.datebox('getValue')
    		// 설치일자
            , 'compDtFinishDate': that.compDtFinishDate.datebox('getValue')
    		// 작업지시번호
            , 'workDocNo': that.workDocNo.val()	
    		// 케이블제조번호
            , 'caMnftNo': that.caMnftNo.val()
            
    		// 망 분류
        	, 'netClf': gfnCheckBoxCheckedToArray(that.netClf).join()
    		// 서비스구분
        	, 'serviceType': gfnCheckBoxCheckedToArray(that.serviceType).join()
    		// 코아수용률
        	, 'useCoreGrade': gfnCheckBoxCheckedToArray(that.useCoreGrade).join()
    		// 잔여코아수
        	, 'coreRemainingCntMin': that.coreRemainingCntMin.val()
    		// 잔여코아수
        	, 'coreRemainingCntMax': that.coreRemainingCntMax.val()
        	
        	, 'totalCount': null
        	, 'page': 1
        	, 'rows': 10
        };				
		
		if(testMode) {
			var message = "";

			message += "테이블: " + data.tableName;
			message += "\ngisCode: " + data.gisCode;
			message += "\n시설명: " + data.fctsNm;
			message += "\n고유관리번호: " + data.unqMgno;
			message += "\nNITS공사번호: " + data.cnstMgno;
			message += "\n자산소유구분: " + data.sysClf;
			message += "\n시도 lglCd: " + that.sidoComboBox.combobox('getValue');
			message += "\n시군구 lglCd: " + that.sggComboBox.combobox('getValue');
			message += "\n읍면동(리) lglCd: " + that.emdComboBox.combobox('getValue');
			message += "\n검색 lglCd: " + data.lglCd;
			
			message += "\n매설위치: " + data.ungrLoc;
			message += "\n포설거리: " + data.compLenMin;
			message += "\n포설거리: " + data.compLenMax;
			message += "\n지도거리: " + data.gisLenMin;
			message += "\n지도거리: " + data.gisLenMax;
			message += "\n코아수: " + data.coreCntMin;
			message += "\n코아수: " + data.coreCntMax;
			message += "\n사용코아수: " + data.useCoreCntMin;
			message += "\n사용코아수: " + data.useCoreCntMax;
			message += "\n접속코아수: " + data.connCoreCntMin;
			message += "\n접속코아수: " + data.connCoreCntMax;
			message += "\n설치일자: " + data.compDtStartDate;
			message += "\n설치일자: " + data.compDtFinishDate;
			message += "\n작업지시번호: " + data.workDocNo;
			message += "\n케이블제조번호: " + data.caMnftNo;
			message += "\n망 분류: " + data.netClf;
			message += "\n서비스구분: " + data.serviceType;
			message += "\n코아수용률: " + data.useCoreGrade;
			message += "\n잔여코아수: " + data.coreRemainingCntMin;
			message += "\n잔여코아수: " + data.coreRemainingCntMax;
			
			console.log(message);
		}
		
		if(data.tableName === 0){
			$.messager.alert("알림", "시설물 종류를 선택해 주세요.");
			return;
		}
		
		for(var propertyName in data) {
			if(data.hasOwnProperty(propertyName) == false) continue;
			if(propertyName == 'totalCount') continue;
			if(propertyName == 'page') continue;
			if(propertyName == 'rows') continue;
						
			if(data[propertyName].length > 0) searchConditionCount++;
		}
		
		if(searchConditionCount < 3) {
			$.messager.alert("알림", "검색 필터를 3가지 이상 선택해 주세요.");
			return;
		}
		
		var targetUrl = "/gis/mapInfoCa/search";
    	var id = "mapInfoSearch";
    	var title = that.facilityKind.combobox('getText');
		var gridId = "";
		
		if(testMode) {
			console.log(JSON.stringify(data, null, 2));
			return true;
		}
				
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
	    		gridId = datagrid.showResult("검색-"+title, data.tableName, jsonData, mapInfo.gridColumns, true);

	    		if(jsonData.total > 5000) {
	    			var tf = confirm(jsonData.total + " 건의 데이터를 지도 상에 일괄 표시하시겠습니까? 주의: 브라우저가 느려지거나 멈출 수 있습니다.");
	    			
		    		if(tf) {
	    				$.ajax({
	    			        type: "GET",
	    			        url: targetUrl + "Gids",
	    			        data: data,
	    			        dataType: "json",
	    			        contentType: "charset=UTF-8",
	    			        success: function(jsonData){
	    			        	dynamicSld.showResult(data.tableName, jsonData, gridId);
	    			        }
	    				});
	    			} else {
	    				dynamicSld.showResult(data.tableName, jsonData, gridId);
	    			}
	    		} else {
    				$.ajax({
    			        type: "GET",
    			        url: targetUrl + "Gids",
    			        data: data,
    			        dataType: "json",
    			        contentType: "charset=UTF-8",
    			        success: function(jsonData){
    			        	dynamicSld.showResult(data.tableName, jsonData, gridId);
    			        }
    				});
	    		}
	    		
	    		
	    		
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
	    	    					
	    	    		    		//dynamicSld.showResult(data.tableName, _data, index);

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

		// 시설물 종류 - easyui 콤보 박스 초기화 처리
		//that.facilityKind.combobox("clear");
		// 시설명
		that.fctsNm.val("");
		// 고유관리번호
		that.unqMgno.val("");
		// NITS공사번호
		that.cnstMgno.val("");
		// 자산소유구분
		gfnClearCheckBoxGroup(that.sysClf);
		
		// 시도 - easyui 콤보 박스 초기화 처리
		that.sidoComboBox.combobox("clear");
		// 시군구 - easyui 콤보 박스 초기화 처리
		that.sggComboBox.combobox("clear");
		// 읍면동(리) - easyui 콤보 박스 초기화 처리
		that.emdComboBox.combobox("clear");
				
		// 광케이블 구분
		gfnClearCheckBoxGroup(that.gisCode);
		
		// 매설위치
		gfnClearCheckBoxGroup(that.ungrLoc);
		// 포설거리
		that.compLenMin.val("");
		// 포설거리
		that.compLenMax.val("");
		// 지도거리
		that.gisLenMin.val("");
		// 지도거리
		that.gisLenMax.val("");
		// 코아수
		that.coreCntMin.val("");
		// 코아수
		that.coreCntMax.val("");
		// 사용코아수
		that.useCoreCntMin.val("");
		// 사용코아수
		that.useCoreCntMax.val("");
		// 접속코아수
		that.connCoreCntMin.val("");
		// 접속코아수
		that.connCoreCntMax.val("");
		// 설치일자
		gfnClearCheckBoxGroup(that.compDtCheckBox);
//		// 설치일자
//		that.compDtStartDate.val("");
//		// 설치일자
//		that.compDtFinishDate.val("");
		// 작업지시번호
		that.workDocNo.val("");
		// 케이블제조번호
		that.caMnftNo.val("");
		// 망 분류
		gfnClearCheckBoxGroup(that.netClf);
		// 서비스구분
		gfnClearCheckBoxGroup(that.serviceType);
		// 코아수용률
		gfnClearCheckBoxGroup(that.useCoreGrade);
		// 잔여코아수
		that.coreRemainingCntMin.val("");
		// 잔여코아수
		that.coreRemainingCntMax.val("");	
	}
};