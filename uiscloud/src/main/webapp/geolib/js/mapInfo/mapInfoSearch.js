"use strict";

var mapInfoSearch = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 시설물 종류
	facilityKind: $("#div_center .facilityKind"),		
	// 검색 방법
	searchKind: $("#div_center .searchKind"),	
	// 검색 방법
	pnuaddr: $("#div_center .pnuaddr"),	
	
	insertDate: $("#div_center .insertDate"),	
	
	searchButton: $("#div_center .searchbtn"),
	
	resetButton: $("#div_center .resetbtn"),
	
	searchValue : $("#div_center .searchValue"),
	
	sinsertDate : $("#div_center .sinsertDate"),
	
	einsertDate : $("#div_center .einsertDate"),
	
	dynamicSld : $("#div_center .a_menu_sld"),
	
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
		
		// 시설물 종류 combobox 초기화
		that.initFacilityKindComboBox();
		// 검색 방법 combobox 초기화
		that.initSearchKindComboBox();
		//that.initCalendarDateBox();
		// 대,소번지 숨기기
		that.pnuaddr.hide();
		that.insertDate.hide();
	},
	/**********************************************************************
	설명 : 입력일자 DateBox 초기화
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
		
		var startDate = that.sinsertDate.datebox("setValue", threeMonthAgo);
		var finishDate = that.einsertDate.datebox("setValue", now);
		
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
				        ]
			, valueField : 'tableName'
			, textField : 'korName'
			, editable : false			
		});
	},
	/**********************************************************************
	설명 : 검색 방법 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initSearchKindComboBox: function() {
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
				
		that.searchKind.combobox({
			  data : [
			        	  {"korName": "시설명", "searchKind": "name"}
			        	, {"korName": "고유관리번호", "searchKind": "originNum"}
			        	, {"korName": "NITS공사번호", "searchKind": "nitsNum"}
//			        	, {"korName": "PNU", "searchKind": "pnuaddr"}	
			        	, {"korName": "입력일자", "searchKind": "insertDt"}	
				        ]
			, valueField : 'searchKind'
			, textField : 'korName'
			, editable : false
			, onSelect: function(rec){
				that.onSelectSearchKind(rec);
			}
		});
	},
	onSelectSearchKind: function(rec) {
		var that = this;
		var type = rec.searchKind;
		if( type == 'insertDt'){			
			that.insertDate.show();
			that.searchValue.hide();
		}
		else{
			that.insertDate.hide();
			that.searchValue.show();
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
		
		// 시설물 테이블
		var tableName = that.facilityKind.combobox('getValue');
		// 검색 조건
		var searchKind = that.searchKind.combobox('getValue');
		// 시설명
		var fctsNm = "";
		// 고유관리번호
		var unqMgno = "";		
		// NITS공사번호
		var cnstMgno = "";
		// 주소
		var lglCd = "";
		// 입력일자
		var startDate = "";
		var endDate = "";
		switch(searchKind) {
		case 'name':

			fctsNm = that.searchValue.val();
			break;
		case 'originNum':

			unqMgno = that.searchValue.val();
			break;
		case 'nitsNum':

			cnstMgno = that.searchValue.val();
			break;
		case 'pnuaddr':

			lglCd = that.searchValue.val();
			break;		
		case 'insertDt':
			startDate = that.sinsertDate.datebox('getValue');
			endDate = that.einsertDate.datebox('getValue');
			break;		
		}


		var message = "";
		
		message += "테이블: " + tableName;
		message += "\n시설명: " + fctsNm;
		message += "\n고유관리번호: " + unqMgno;
		message += "\nNITS공사번호: " + cnstMgno;
		message += "\n검색 lglCd: " + lglCd;
		
//		alert(message);
		
		if(tableName == ''){
			$.messager.alert("알림", "시설물 종류를 선택해 주세요.");
			return;
		}
		if(searchKind == ''){
			$.messager.alert("알림", "검색 조건을 선택해 주세요.");
			return;
		}
		if(that.searchValue.val() == '' && startDate == '' && endDate == ''){
			$.messager.alert("알림", "검색 조건 값을 입력해 주세요.");
			return;
		}
		var targetUrl = "/titan/mapInfo/search";
    	var id = "mapInfoSearch";
    	var title = that.facilityKind.combobox('getText');
		var gridId = "";

		var data = {
	        	  'tableName': tableName			  	    
		        	, 'fctsNm': fctsNm
		        	, 'unqMgno': unqMgno
		        	, 'cnstMgno': cnstMgno		        	
		        	, 'lglCd': lglCd
		        	, 'startDate' : startDate
		        	, 'endDate' : endDate
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
	    		gridId = datagrid.showResult("검색-"+title, tableName, jsonData, that.gridColumns, true);	
	    		
	    		if(jsonData.total > 3000) {
	    			var tf = confirm(jsonData.total + " 건의 데이터를 지도 상에 일괄 표시하시겠습니까? 주의: 브라우저가 느려지거나 멈출 수 있습니다.");
	    			
		    		if(tf) {
	    				$.ajax({
	    			        type: "GET",
	    			        url: targetUrl + "Gids",
	    			        data: data,
	    			        dataType: "json",
	    			        contentType: "charset=UTF-8",
	    			        success: function(jsonData){
	    			        	dynamicSld.showResult(tableName, jsonData, gridId);
	    			        }
	    				});
	    			} else {
	    				dynamicSld.showResult(tableName, jsonData, gridId);
	    			}
	    		} else {
    				$.ajax({
    			        type: "GET",
    			        url: targetUrl + "Gids",
    			        data: data,
    			        dataType: "json",
    			        contentType: "charset=UTF-8",
    			        success: function(jsonData){
    			        	dynamicSld.showResult(tableName, jsonData, gridId);
    			        }
    				});
	    		}	    					
	    		
	    	    $("#" + gridId).datagrid("getPager").pagination({
	    	    	buttons: [{
						iconCls: 'icon-excel',
						handler: function() {
							var message = "";
							
							message += "tableName: " + tableName;
							message += "\n시설명: " + fctsNm;
							message += "\n고유관리번호: " + unqMgno;
							message += "\nNITS공사번호: " + cnstMgno;
							message += "\n검색 lglCd: " + lglCd;
							
							//alert(message);
							
							var url = targetUrl + "DownloadExcel";
							url += '?tableName=' + tableName;
							url += '&fctsNm=' + fctsNm;
							url += '&unqMgno=' + unqMgno;
							url += '&cnstMgno=' + cnstMgno;
							url += '&lglCd=' + lglCd;
							url += '&startDate=' + startDate;
							url += '&endDate=' + endDate;
							
							$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
							$("#frm_file_download").attr("action", url);
							$("#frm_file_download").submit();							
						}
	    	    	}],
	    	    	onSelectPage : function(page, rows){
	    	    		console.log(page)
	    	    		var params = {
    	    				  'tableName': tableName
	    	  	        	, 'fctsNm': fctsNm
	    	  	        	, 'unqMgno': unqMgno
	    	  	        	, 'cnstMgno': cnstMgno
	    	  	        	, 'lglCd': lglCd
	    	  	        	, 'startDate' : startDate
	    		        	, 'endDate' : endDate
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
	    	    					
	    	    		    		//dynamicSld.showResult(tableName, data, gridId);

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
				
		// easyui 콤보 박스 초기화 처리
		that.facilityKind.combobox("clear");
		that.searchKind.combobox("clear");
		that.searchValue.val("");
		that.sinsertDate.val("");
		that.einsertDate.val("");
		that.insertDate.hide();
		that.searchValue.show();
		
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
	    
	    $("#div_bottom_tab").tabs("resize");
	        
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
    ]]
};