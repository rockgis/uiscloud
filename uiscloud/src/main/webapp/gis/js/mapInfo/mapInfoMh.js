"use strict";

var mapInfoMh = {
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
	
	// 맨홀 구분
	gisCode: $("#div_mapInfo_search .gotc_mh :checkbox[name='gisCode']"),
		
	// 자사/타사 설비구분
	sktSysClf: $("#div_mapInfo_search #gotc_mh :checkbox[name='sktSysClf']"),
	// 인/수공 구분
	mhInd: $("#div_mapInfo_search #gotc_mh :checkbox[name='mhInd']"),
	// 준공일자
	compDtCheckBox: $("#div_mapInfo_search #gotc_mh :checkbox[name='compDtCheckBox']"),
	// 준공일자
	compDtStartDate: $("#div_mapInfo_search #gotc_mh .compDtStartDate"),	
	// 준공일자
	compDtFinishDate: $("#div_mapInfo_search #gotc_mh .compDtFinishDate"),
	// 맨홀규격
	mhStd: $("#div_mapInfo_search #gotc_mh :checkbox[name='mhStd']"),
	// 맨홀위치
	mhLoc: $("#div_mapInfo_search #gotc_mh :checkbox[name='mhLoc']"),
	
	searchButton: $("#frmMapInfoFacility #gotc_mh .search"),
	
	resetButton: $("#frmMapInfoFacility #gotc_mh .reset"),
	
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

	/**********************************************************************
	설명 : DateBox 초기화
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
		
		var startDate = that.compDtStartDate.datebox("setValue", threeMonthAgo);
		var finishDate = that.compDtFinishDate.datebox("setValue", now);
		
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
	설명 : 왼쪽메뉴 - 레이어 기능 이벤트 바인딩
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
        	
        	// 자사/타사 설비구분	
        	, 'sktSysClf': gfnCheckBoxCheckedToArray(that.sktSysClf).join()
    		// 인/수공 구분
            , 'mhInd': gfnCheckBoxCheckedToArray(that.mhInd).join()
    		// 준공일자
            , 'compDtStartDate': that.compDtStartDate.datebox('getValue')
    		// 준공일자
            , 'compDtFinishDate': that.compDtFinishDate.datebox('getValue')
    		// 맨홀규격
        	, 'mhStd': gfnCheckBoxCheckedToArray(that.mhStd).join()
    		// 맨홀위치
        	, 'mhLoc': gfnCheckBoxCheckedToArray(that.mhLoc).join()
        	
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
			message += "\n자사/타사 설비구분: " + data.sktSysClf;
			message += "\n인/수공 구분: " + data.mhInd;
			message += "\n준공일자 시작일: " + data.compDtStartDate;
			message += "\n준공일자 마감일: " + data.compDtFinishDate;
			message += "\n맨홀규격: " + data.mhStd;
			message += "\n맨홀위치: " + data.mhLoc;

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
		
		var targetUrl = "/gis/mapInfoMh/search";
    	var id = "mapInfoMhSearch";
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
				
		// 맨홀 구분
		gfnClearCheckBoxGroup(that.gisCode);
		
		// 자사/타사 설비구분
		gfnClearCheckBoxGroup(that.sktSysClf);
		// 인/수공 구분
		gfnClearCheckBoxGroup(that.mhInd);		
		// 준공일자
		gfnClearCheckBoxGroup(that.compDtCheckBox);
//		// 준공일자
//		that.compDtStartDate.val("");
//		// 준공일자
//		that.compDtFinishDate.val("");
		// 맨홀규격
		gfnClearCheckBoxGroup(that.mhStd);
		// 맨홀위치
		gfnClearCheckBoxGroup(that.mhLoc);
	}
};