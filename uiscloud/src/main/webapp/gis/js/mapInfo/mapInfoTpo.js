"use strict";

var mapInfoTpo = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 시설물 종류
	facilityKind: $("#frmMapInfoFacility .facilityKind"),		
	// 시설명
	fctsNm: $("#frmMapInfoFacility .fctsNm"),	
	// 고유관리번호
	unqMgno: $("#frmMapInfoFacility .unqMgno"),
	// NITS공사번호
	cnstMgno: $("#frmMapInfoFacility .cnstMgno"),
	// 자산소유구분
	sysClf: $("#div_mapInfo_search :checkbox[name='sysClf']"),
	// 시도 ComboBox
	sidoComboBox: $("#frmMapInfoFacility .sidoComboBox"),
	// 시군구 ComboBox
	sggComboBox: $("#frmMapInfoFacility .sggComboBox"),
	// 읍면동 ComboBox
	emdComboBox: $("#frmMapInfoFacility .emdComboBox"),
	// 리 ComboBox
	liComboBox: $("#frmMapInfoFacility .liComboBox"),	
	
	// 국소 구분
	gisCode: $("#div_mapInfo_search .gotc_tpo :checkbox[name='gisCode']"),
	
	// 주소
	addr: $("#frmMapInfoFacility #gotc_tpo .addr"),	
	// 국소유형분류
	clientCd: $("#frmMapInfoFacility #gotc_tpo :checkbox[name='clientCd']"),	
	// 장비유형분류
	devType: $("#frmMapInfoFacility #gotc_tpo :checkbox[name='devType']"),
	
	searchButton: $("#frmMapInfoFacility #gotc_tpo .search"),
	
	resetButton: $("#frmMapInfoFacility #gotc_tpo .reset"),
	
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
	},
	
	/**********************************************************************
	설명 : 왼쪽메뉴 - 레이어 기능 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
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

			// 국소 구분
	  	    , 'gisCode': gfnCheckBoxCheckedToArray(that.gisCode).join()
	  	    	
	  	    // 주소
        	, 'addr': that.addr.val()	
    		// 국소유형분류
        	, 'clientCd': gfnCheckBoxCheckedToArray(that.clientCd).join()
    		// 장비유형분류
        	, 'devType': gfnCheckBoxCheckedToArray(that.devType).join()
        	
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
			
			message += "\n주소: " + that.addr;
			message += "\n국소유형분류: " + that.clientCd;
			message += "\n장비유형분류: " + that.devType;
			
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
		
//		if(searchConditionCount < 3) {
//			$.messager.alert("알림", "검색 필터를 3가지 이상 선택해 주세요.");
//			return;
//		}
		
		var targetUrl = "/gis/mapInfoTpo/search";
    	var id = "mapInfoTpoSearch";
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
	    		
	    		//gridId = datagrid.showResult("검색-"+title, data.tableName, jsonData, mapInfo.gridColumns, true);
	    		
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
		
		// 국소 구분
		gfnClearCheckBoxGroup(that.gisCode)
		
		// 주소
		that.addr.val("");		
		// 국소유형분류
		gfnClearCheckBoxGroup(that.clientCd)
		// 장비유형분류
		gfnClearCheckBoxGroup(that.devType)
	}
};