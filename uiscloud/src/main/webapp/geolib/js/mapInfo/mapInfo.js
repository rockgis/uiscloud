"use strict";

var mapInfo = {
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
	sysClf: $("#frmMapInfoFacility .sysClf"),
	// 시도 ComboBox
	sidoComboBox: $("#frmMapInfoFacility .sidoComboBox"),
	// 시군구 ComboBox
	sggComboBox: $("#frmMapInfoFacility .sggComboBox"),
	// 읍면동 ComboBox
	emdComboBox: $("#frmMapInfoFacility .emdComboBox"),
	// 리 ComboBox
	liComboBox: $("#frmMapInfoFacility .liComboBox"),	
		
	// 시설물 구분 체크
	facilityTypeTpo: $("#frmMapInfoFacility .gotc_tpo"),
	facilityTypeJp: $("#frmMapInfoFacility .gotc_jp"),
	facilityTypeMh: $("#frmMapInfoFacility .gotc_mh"),
	facilityTypeCa: $("#frmMapInfoFacility .gotc_ca"),
	facilityTypeCd: $("#frmMapInfoFacility .gotc_cd"),	
	facilityTypeUser: $("#frmMapInfoFacility .mapBookmark"),	
	facilityTypeReq: $("#frmMapInfoFacility .mapRequire"),	
	facilityHelp: $("#frmMapInfoFacility .help"),	
		
	// 시설물 상세 검색
	facilityTpo: $("#gotc_tpo"),
	facilityJp: $("#gotc_jp"),
	facilityMh: $("#gotc_mh"),
	facilityCa: $("#gotc_ca"),
	facilityCd: $("#gotc_cd"),	
	facilityBm: $("#mapBookmark"),	
	
	// 고유관리번호 검색 Button
	searchFacility: $("#frmMapInfoFacility .searchFacility"),
	// 고유관리번호를 통한 시설물 검색 결과 Gird
	searchFacilityResultGrid: $("#frmMapInfoFacility .searchFacilityResultGrid"),
	// 링명
	ringName: $("#frmMapInfoFacility .ringName"),	
	// 반경
	//radius: $("#frmMapInfoFacility .radius"),	
	// 검색영역설정
	searchFigureType: $("#frmMapInfoFacility .searchFigureType"),	
	
	searchButton: $("#frmMapInfoFacility .searchForm > ul .search"),
	
	resetButton: $("#frmMapInfoFacility .reset"),
	
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
		
		/*// 시설명 10글자 제한
		that.fctsNm.validatebox({
			validType : ["maxLength[10]"],
			tipPosition : "right"
		});

		// 고유관리번호 33글자 제한
		that.unqMgno.validatebox({
			validType : ["maxLength[33]"],
			tipPosition : "right"
		});
		
		// NITS공사번호 21글자 제한
		that.cnstMgno.validatebox({
			validType : ["maxLength[21]"],
			tipPosition : "right"
		});
		
		// 시설물 종류 combobox 초기화
		that.initFacilityKindComboBox();*/
		
		// 시도 & 시군구 & 읍면동 combobox 들 초기화
		that.initAddressComboBoxes();
		
		/*// 시설물 구분 안 보이게
		that.facilityTypeTpo.hide();
		that.facilityTypeJp.hide();
		that.facilityTypeMh.hide();
		that.facilityTypeCa.hide();
		that.facilityTypeCd.hide();
		
		
		// 시설물 상세 검색 안 보이게
		that.facilityTpo.hide();
		that.facilityJp.hide();
		that.facilityMh.hide();
		that.facilityCa.hide();
		that.facilityCd.hide();*/
	},
	
	/**********************************************************************
	설명 : 시도 & 시군구 & 읍면동 combobox 들 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initAddressComboBoxes: function() {
		var that = this;
		
		//setAddressComboBoxes(that.sidoComboBox, that.sggComboBox, that.emdComboBox, that.liComboBox);
		setAddressComboBoxes(that.sidoComboBox, that.sggComboBox, that.emdComboBox);
	},
		
	/**********************************************************************
	설명 : 시설물 종류 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initFacilityKindComboBox: function() {
		var that = this;
		
		/*
			  1: 국소
			  2: 접속함체
			  4: 맨홀
			  8: 광케이블
			 16: 관로
		 	128: 코아수용률
		 	
		 	Bitwise And Filter: 159
		*/	
				
		that.facilityKind.combobox({
			  data : [
			        	  {"korName": "국소", "tableName": "gotc_tpo"}
			        	, {"korName": "접속함체", "tableName": "gotc_jp"}
			        	, {"korName": "맨홀", "tableName": "gotc_mh"}
			        	, {"korName": "광케이블", "tableName": "gotc_ca"}
			        	, {"korName": "관로", "tableName": "gotc_cd"}
			        	, {"korName": "사용자데이터", "tableName": "bookmark"}
				        ]
			, valueField : 'tableName'
			, textField : 'korName'
			, editable : false
			, onSelect: function(rec){
				that.onSelectFacilityKind(rec);
			}
		});
	},
	
	onSelectFacilityKind: function(rec) {
		var that = this;
		
		// 시설물 구분 안 보이게
		that.facilityTypeTpo.hide();
		that.facilityTypeJp.hide();
		that.facilityTypeMh.hide();
		that.facilityTypeCa.hide();
		that.facilityTypeCd.hide();
		that.facilityTypeReq.show();
		that.facilityHelp.show();
		// 시설물 상세 검색 안 보이게
		that.facilityTpo.hide();
		that.facilityJp.hide();
		that.facilityMh.hide();
		that.facilityCa.hide();
		that.facilityCd.hide();
		that.facilityBm.hide();
		
		switch(rec.tableName) {
		case 'gotc_tpo':
			that.facilityTypeTpo.show();
			that.facilityTpo.show();
			break;
		case 'gotc_jp':
			that.facilityTypeJp.show();
			that.facilityJp.show();
			break;
		case 'gotc_mh':
			that.facilityTypeMh.show();
			that.facilityMh.show();
			break;
		case 'gotc_ca':
			that.facilityTypeCa.show();
			that.facilityCa.show();
			break;
		case 'gotc_cd':
			that.facilityTypeCd.show();
			that.facilityCd.show();
			break;
		case 'bookmark':
			that.facilityTypeUser.show();
			that.facilityBm.show();
			that.facilityTypeReq.hide();
			that.facilityHelp.hide();
			break;		
		}
	}, 
		
	/***************************************************************************
	 * 설명 : 고유관리번호를 통한 시설물 검색 결과 그리드 초기화 
	 * 파라메터 : 
	 * 리턴값 :
	 **************************************************************************/
	initSearchFacilityResultGrid: function() {
		var that = this; 
		
		that.searchFacilityResultGrid.datagrid({
			data : null,
			columns : [[
			    {field:"unqMgno", title:"고유관리번호", align:"left", sortable: true},
			    {field:"name", title:"시설명", align:"left", sortable: true},
			    {field:"lglCd", title:"법정동 코드", align:"left", hidden: false}
			]],
			closed : true,
			pagePosition: "top",
			onClickRow : function(rowIndex, rowData) {
				//getAddressComboSetting(rowData.unqMgno, cap, sgg, tts, li);
			}
		});
	},
		
	/**********************************************************************
	설명 : 왼쪽메뉴 - 레이어 기능 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
		// 국공 기본도 레이어 on/off
		$("#a_layer_base").click(that.toggleBaseLayer);
		
		// DaumHybrid 레이어 on/off
		$("#a_layer_hybrid").click(that.toggleHybrid);
	
		// DaumSatellite 레이어 on/off
		$("#a_layer_satellite").click(that.toggleSatellite);	
		
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
	설명 : 기본도 레이어 ON/OFF
	파라메터 :
	리턴값 :
	***********************************************************************/
	toggleBaseLayer: function () {
		var that = this;
		var selectedMap = $('#selectBox_bgm').val();
		if($(that).hasClass("layer_on")) {
			gfnGetLayer(selectedMap + "_base").setVisible(false);
			//gfnMergeNewParams("biesBaseLayer", gfnGetBaseLayerList(false));
			$(that).removeClass("layer_on");
			$(that).find("img").attr("src", $(that).find("img").attr("src").replace("_a.", "_n."));
		}
		else {
			gfnGetLayer(selectedMap + "_base").setVisible(true);
			//changeBaseLayer("DaumStreetMap");
			$(that).addClass("layer_on");
			$(that).find("img").attr("src", $(that).find("img").attr("src").replace("_n.", "_a."));
		}
	},
	
	/**********************************************************************
	설명 : HybridMap 레이어 ON/OFF
	파라메터 :
	리턴값 :
	***********************************************************************/
	toggleHybrid: function () {
		var that = this;
		var selectedMap = $('#selectBox_bgm').val();
		if($(that).hasClass("layer_on")) {
			gfnGetLayer(selectedMap + "_hybrid").setVisible(false);
			//gfnMergeNewParams("biesBaseLayer", gfnGetBaseLayerList(false));
			$(that).removeClass("layer_on");
			$(that).find("img").attr("src", $(that).find("img").attr("src").replace("_a.", "_n."));			
		}
		else {
			gfnGetLayer(selectedMap + "_hybrid").setVisible(true);
			$(that).addClass("layer_on");
			$(that).find("img").attr("src", $(that).find("img").attr("src").replace("_n.", "_a."));
		}
	},
	
	/**********************************************************************
	설명 : SatelliteMap 레이어 ON/OFF
	파라메터 :
	리턴값 :
	***********************************************************************/
	toggleSatellite: function () {
		var that = this;
		var selectedMap = $('#selectBox_bgm').val();
		if($(that).hasClass("layer_on")) {
			gfnGetLayer(selectedMap + "_satellite").setVisible(false);
			//("biesBaseLayer", gfnGetBaseLayerList(false));
			$(that).removeClass("layer_on");
			$(that).find("img").attr("src", $(that).find("img").attr("src").replace("_a.", "_n."));			
		}
		else {
			gfnGetLayer(selectedMap + "_satellite").setVisible(true);
			$(that).addClass("layer_on");
			$(that).find("img").attr("src", $(that).find("img").attr("src").replace("_n.", "_a."));
		}
	},
	
	/**********************************************************************
	설명 : 기본도/항공사진 on/off
	파라메터 : layerName - 레이어명
	리턴값 :
	***********************************************************************/
	changeBaseLayer: function (layerName) {
		var that = this;
		
		$(".a_layer_set").each(function() {
			$(that).removeClass("layer_on");
			$(that).find("img").attr("src", $(that).find("img").attr("src").replace("_a.", "_n."));
		});
		
		var layers = map.layers;
		for(var i=0, len=layers.length; i < len; i++) {
			if(layers[i].CLASS_NAME == "OpenLayers.Layer.TMS") {
				if(layers[i].name == layerName) {
					layers[i].setVisibility(true);
				}
				else {
					layers[i].setVisibility(false);
				}
			}
		}
		
		if(layerName == "baseLayer") {
			gfnMergeNewParams("biesBaseLayer", gfnGetBaseLayerList(true));
		}
		else {
			gfnMergeNewParams("biesBaseLayer", gfnGetBaseLayerList(false));
		}
	},
	
	/**********************************************************************
	설명 : 고유관리번호를 통한 시설물 검색
	파라메터 :
	리턴값 :
	***********************************************************************/
	searchUnqMgno: function() {
		var that = this;
		
		var validItem = that.unqMgno || null;
		
		if((that.facilityKind.combobox('getValue') || 0) === 0){
			$.messager.alert("알림", "시설물 종류를 선택해 주세요.");
			return;
		}
		
		// 고유관리번호 33 글자수 제한 적용
		if(!validItem.validatebox("isValid")) {
			validItem.focus();
			return;
		}		
		if(validItem.val() == ""){
			$.messager.alert("알림", "고유관리번호를 입력해 주세요.");
			validItem.focus();
			return;
		}

		// NITS공사번호 21 글자수 제한 적용
		if(!validItem.validatebox("isValid")) {
			validItem.focus();
			return;
		}		
		
		$.post(
	        "/titan/mapInfo/selectUnqMgno",
	        {
	        	'tableName': that.facilityKind.combobox('getValue'),
	        	'unqMgno': that.unqMgno.val()
	        },
	        function(jsonData){
	        	// 검색 결과 표시
	        	that.searchFacilityResultGrid.datagrid("getPanel").panel("open");
	        	// 검색 결과 그리드 창 영역
	        	that.searchFacilityResultGrid.datagrid('resize');
	        	// 데이터 저장
	        	that.searchFacilityResultGrid.datagrid('loadData', jsonData);
				// 내용을 다시 읽는다.
	        	that.searchFacilityResultGrid.datagrid('reload');
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

		/*// 검색 필터를 3 개 미만으로 설정하면 검색 거부		
		var searchConditionCount = 0;
		
		// 시설물 테이블
		var tableName = that.facilityKind.combobox('getValue');
		
		var gisCode = [];		
		$("#div_mapInfo_search ." + tableName + " :checkbox[name='gisCode']:checked").each(function() {
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
		$("#div_mapInfo_search :checkbox[name='sysClf']:checked").each(function() {
			sysClf.push($(this).val());
		});	*/
		
		var sidoLglCd = that.sidoComboBox.combobox('getValue') || 0;
		var sggLglCd = that.sggComboBox.combobox('getValue') || 0;
		var emdlLglCd = that.emdComboBox.combobox('getValue') || 0;
		var lglCd = "";
		var tableName = '';
		if(emdlLglCd !== 0) {
			lglCd = emdlLglCd;
			tableName = 'tl_scco_emd_11000';
		} else if(sggLglCd !== 0) {
			lglCd = sggLglCd;
			tableName = 'tl_scco_sig_11000';
		} else if(sidoLglCd !== 0){
			lglCd = sidoLglCd;
			tableName = 'tl_scco_ctprvn_11000';
		};

		/*var message = "";
		
		message += "테이블: " + tableName;
		message += "\ngisCode: " + gisCode.join();
		message += "\n시설명: " + fctsNm;
		message += "\n고유관리번호: " + unqMgno;
		message += "\nNITS공사번호: " + cnstMgno;
		message += "\n자산소유구분: " + sysClf.join();
		message += "\n시도 lglCd: " + sidoLglCd;
		message += "\n시군구 lglCd: " + sggLglCd;
		message += "\n읍면동(리) lglCd: " + emdlLglCd;
		message += "\n검색 lglCd: " + lglCd;*/
		
//		alert(message);
		
		/*if(tableName === 0){
			$.messager.alert("알림", "시설물 종류를 선택해 주세요.");
			return;
		}
		
		if(tableName.length > 0) { searchConditionCount++; }
		if(gisCode.length > 0 ) { searchConditionCount++; }
		if(fctsNm.length > 0 ) { searchConditionCount++; }
		if(cnstMgno.length > 0 ) { searchConditionCount++; }
		if(sysClf.length > 0 ) { searchConditionCount++; }
		if(sidoLglCd != 0 ) { searchConditionCount++; }
		if(sggLglCd != 0 ) { searchConditionCount++; }
		if(emdlLglCd != 0 ) { searchConditionCount++; }
		
		if(searchConditionCount < 3) {
			$.messager.alert("알림", "검색 필터를 3가지 이상 선택해 주세요.");
			return;
		}*/
		
		var targetUrl = "/gis/mapInfo/search";
    	var id = "mapInfoSearch";
		var gridId = "";
		var title = "주소검색";
		var tab = $('#div_bottom_tab').tabs('getSelected');
		var index = $('#div_bottom_tab').tabs('getTabIndex',tab);
		var data = {
	        	  'tableName': tableName
	        	  /* , 'gisCode': gisCode.join()
		        	, 'fctsNm': fctsNm
		        	, 'unqMgno': unqMgno
		        	, 'cnstMgno': cnstMgno
		        	, 'sysClf': sysClf.join()*/
		        	, 'lglCd': lglCd
		        	, 'totalCount': null
	  	        	, 'page': 1
	  	        	, 'rows': 10
		        };
				
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
	    			        	dynamicSld.showResult(tableName, jsonData, index);
	    			        }
	    				});
	    			} else {
	    				dynamicSld.showResult(tableName, jsonData, index);
	    			}
	    		} else {
    				$.ajax({
    			        type: "GET",
    			        url: targetUrl + "Gids",
    			        data: data,
    			        dataType: "json",
    			        contentType: "charset=UTF-8",
    			        success: function(jsonData){
    			        	dynamicSld.showResult(tableName, jsonData, index);
    			        }
    				});
	    		}
	    		
	    		var onClickRow = function(rowIndex, rowData){
					gfnGetFeatureById(prefix+tableName.toLowerCase(), [rowData.gid], true, true, true);
		        };
	    		
	    		gridId = datagrid.showResult("검색-"+title, tableName, jsonData, that.addrGridColumns, true, onClickRow);				
	    		
	    	    $("#" + gridId).datagrid("getPager").pagination({
	    	    	buttons: [{
						iconCls: 'icon-excel',
						handler: function() {
							var message = "";
							
							message += "tableName: " + tableName;
							message += "\ngisCode: " + gisCode.join();
							message += "\n시설명: " + fctsNm;
							message += "\n고유관리번호: " + unqMgno;
							message += "\nNITS공사번호: " + cnstMgno;
							message += "\n자산소유구분: " + sysClf.join();
							message += "\n시도 lglCd: " + sidoLglCd;
							message += "\n시군구 lglCd: " + sggLglCd;
							message += "\n읍면동(리) lglCd: " + emdlLglCd;
							message += "\n검색 lglCd: " + lglCd;
							
							//alert(message);
							
							var url = targetUrl + "DownloadExcel";
							url += '?tableName=' + tableName;
							url += '&ngisCode=' + gisCode.join();
							url += '&fctsNm=' + fctsNm;
							url += '&unqMgno=' + unqMgno;
							url += '&cnstMgno=' + cnstMgno;
							url += '&sysClf=' + sysClf.join();
							url += '&lglCd=' + lglCd;
							
							$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
							$("#frm_file_download").attr("action", url);
							$("#frm_file_download").submit();							
						}
	    	    	}],
	    	    	onSelectPage : function(page, rows){
	    	    		var params = {
    	    				  'tableName': tableName
	    	  	        	, 'gisCode': gisCode.join()
	    	  	        	, 'fctsNm': fctsNm
	    	  	        	, 'unqMgno': unqMgno
	    	  	        	, 'cnstMgno': cnstMgno
	    	  	        	, 'sysClf': sysClf.join()
	    	  	        	, 'lglCd': lglCd
	    	  	        	, 'totalCount': jsonData.total
	    	  	        	, 'page': page
	    	  	        	, 'rows': rows
	    	  	        };
	    	    		
	    	    		$.post(
	    	    			  targetUrl
	    	    			, params
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
	    	    					
	    	    		    		dynamicSld.showResult(tableName, data, index);

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
		
		// 시설물 종류
		that.fctsNm.val("");
		// 고유관리번호
		that.unqMgno.val("");
		// NITS공사번호
		that.cnstMgno.val("");
		// 자산소유구분
		for(var i = 0; i < $(":checkbox[name='sysClf']").length; i++) {
			$(":checkbox[name='sysClf']")[i].checked = false;
		}
		
		// easyui 콤보 박스 초기화 처리
		that.facilityKind.combobox("clear");
		that.sidoComboBox.combobox("clear");
		that.sggComboBox.combobox("clear");
		that.emdComboBox.combobox("clear");
		
		// 시설물 검색 결과 그리드 닫기
		var grid = that.searchFacilityResultGrid;
		if(grid.data() && grid.data().datagrid) {
			grid.datagrid("getPanel").panel("close");
		}
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
		// 객체를 복제시킴. 서로 데이터가 물고 있어서 칼럼 크기 변경시 오동작을 발생시키기 때문.
	    var newCols = JSON.parse(JSON.stringify(that.gridColumns));
	    // 대장면적과 대장가액 콤마 들어가게 포맷터 넣기. 메소드는 json으로 넘어가지 않기 때문.
	    //newCols[3].formatter = that.gridColumns[3].formatter;
	    //newCols[4].formatter = that.gridColumns[4].formatter;
	    var columList = [];
	    columList.push(newCols);
//	    var rowCnt = datas.rows.length;
//	    if (rowCnt > 50 ) { // 건수가 너무 많으면 브라우져가 느려지므로 사용자가 다 볼지 선택하게 한다.
//	        // message.getConfirm은 비동기로 동작하므로 사용하지 못함.
//	        var r = confirm(message.getMessage("MSG1510", rowCnt).message);
//	        if (r) {
//	            rowCnt = 50;
//	            datas.rows = datas.rows.slice(0, 50);
//	        }
//	    }

	    //var rowCnt = datas.rows.length;
	    var rowCnt = datas.total;
	    //var num = $("#div_bottom_tab").tabs("tabs").length;
	    ++gridIdex;
	    var ids = id + gridIdex;
	    var newTitle = gridIdex + "." + title + "(" + gfnFormatNumber(rowCnt) + "건)";
	    
	    //검색된 데이터가 없으면 검색결과가 없는 html 코드를 넣는다.
//	    var onContent = 
	    var resultContents = 
	            "<table id=\""+ids+"\"\ class=\"easyui-datagrid\"\" style=\"height:"+commonGridHeight+"px\" pagination='true'>" +
	            "<thead data-options=\"frozen:true\"><tr>" +
	            "<th data-options=\"field:'itemNo',checkbox:true\"></th>" +
	            "</tr></thead>" +
	            "</table>";
//		var offContent = "<div id=\"gridContent\"><ul><li class=\"gridSearch\">검색결과가 없습니다.</li></ul></div>";
	//  var resultContents = (datas.rows.length > 0) ? onContent : offContent;    
	    
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
	        onClickRow :function(rowIndex, rowData){
	            if(onclickRow)
	                onclickRow(this);
	        },
	        onCheck : function(rowIndex, rowData){
	        	gfnHighlightFeatureByUnqMgnos(rowData.layerName, rowData.unqMgno,false,false);
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
	        	var unqMgnoLists = [];
	        	for(var i=0; i<rows.length; i++){
	        		unqMgnoLists.push(rows[i].unqMgno);
	        	}
	        	gfnHighlightFeatureByUnqMgnos(rows[0].layerName, unqMgnoLists,false,false);
	        },
	        onUncheckAll : function(rows){
	        	gfnGetLayer("searchLayer").removeAllFeatures();
	        }	        
	    });
	    
	    return ids;		
	},
	// 검색 부분 그리드 컬럼 정의
	gridColumns: [[
	      {field:"itemNo",checkbox:true}
       	, {field:"unqMgno", title:"고유관리번호", width:150, halign:"center", align:"left", sortable: false}
    	, {field:"fctsNm",title:"시설명", width:180, halign:"center", align:"left", sortable: false}
    	, {field:"cnstMgno",title:"공사번호", width:120, halign:"center", align:"right", sortable: false}
    	, {field:"addr",title:"법정동명", width:200, halign:"center", align:"left", sortable: false}
    	, {field:"gid",title:"gid", width:120, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"lglCd",title:"lglCd", width:100, halign:"center", align:"right", sortable: false, hidden: true}
    	, {field:"theGeom",title:"theGeom", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"layerName",title:"layerName", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    ]],
    // 주소검색 그리드 컬럼 정의
	addrGridColumns: [[
	      {field:"itemNo",checkbox:true}
       	, {field:"gid", title:"gid", width:150, halign:"center", align:"left", sortable: false}
    	, {field:"ctprvnCd",title:"시도코드", width:180, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"sigCd",title:"시군구코드", width:180, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"emdCd",title:"읍면동코드", width:180, halign:"center", align:"left", sortable: false, hidden: true}
    	, {field:"ctpKorNm",title:"시도명", width:180, halign:"center", align:"left", sortable: false}
    	, {field:"sigKorNm",title:"시군구명", width:180, halign:"center", align:"left", sortable: false}
    	, {field:"emdKorNm",title:"읍면동명", width:180, halign:"center", align:"left", sortable: false}
    	, {field:"theGeom",title:"theGeom", width:200, halign:"center", align:"left", sortable: false, hidden: true}
    ]]
};