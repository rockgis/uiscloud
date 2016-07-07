"use strict";

// IE 8 오류로 console 사용 금지
var mapInfoBookmark = {
		
	layer : null,
		
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 본부
	headOffice: $("#frmMapInfoFacility .headOffice"),
	
	// 제목
	title: $("#frmMapInfoFacility .title"),
	
	// 작성자명 
	creator: $("#frmMapInfoFacility .creator"),
	
	searchButton: $("#frmMapInfoFacility .searchBookmark"),
	
	resetButton: $("#frmMapInfoFacility .resetBookmark"),
	
	bookmarkExcelPath: $("#mapBookmark #mapBookmarkExcelPath"),

	/**********************************************************************
	설명 : 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 	
	init: function() {
		var that = this;
		
		that.initUi();
		that.bindEvents();
		
		// 본부 combobox 초기화
		that.initheadOfficeComboBoxes();
	},
	
	/**********************************************************************
	설명 : 화면 Ui 작업 jeasyui (validatebox, datagrid)
	파라메터 :
	리턴값 :
	***********************************************************************/
	initUi: function() {
		var that = this;
	},
	
	createLayer : function() {
		var that = this;
		
		that.layer = new BiesVector("bookmarkLayer", {
			styleMap : new OpenLayers.StyleMap({
				'default': new OpenLayers.Style({
					pointRadius: 4,
					graphicName: "circle",
					fillColor: "#FFE400",
					fillOpacity: 0.3,
					strokeWidth: 3,
					strokeOpacity: 1,
					strokeColor: "#FFE400"
				})
			})
		});
		map.addLayer(that.layer);
	},
	
	showFeature : function(wkt) {
		var that = this;
		
		if(!that.layer) that.createLayer();
		
		that.layer.removeAllFeatures();		
		
		var format = new OpenLayers.Format.WKT();
		var feature = format.read(wkt);
		that.layer.addFeatures(feature);

		var bounds = that.layer.getDataExtent();
		if((bounds.left == bounds.right) || (bounds.top == bounds.bottom)) {
			var center = that.layer.getDataExtent().getCenterLonLat();
			map.setCenter(center, 14);
		}
		else {
			map.zoomToExtent(bounds);	
		}
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
						
//						var imageFile = '/gis/images/geoserver/' + row.symbolizer + '.png';
//						return '<span style="margin-left: 15px;"><img src="' + imageFile + '" />' + row[opts.textField] + '</span>';
					}
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
		
		// 검색
		that.searchButton.click(function() {
			that.search();
		});
		
		// 초기화 
		that.resetButton.click(function() {
			that.reset();
		});
		
		// 엑셀 업로드 기능 바인딩
		that.uploadExcel (that.bookmarkExcelPath, that.checkExcelType, that.compleateUploadExcel);
	},

	/**********************************************************************
	설명 : excel 을 JSON 으로 변환 후 받아오기
	파라메터 : _uploadButton 			(필수)업로드 버튼 id 
			   _beforeSubmitCallback 	(옵션)업로드 전 콜백 - false 를 반납하면 업로드 취소
			   _compleateCallback		(옵션)업로드 / 서버 저장 완료 후 콜백
	리턴값 : json
	***********************************************************************/
	uploadExcel: function (_uploadButton, _beforeSubmitCallback, _compleateCallback) {
		// jQuery ajaxupload 적용
		return new AjaxUpload(_uploadButton[0], {
			action : '/gis/mapInfo/create',
			autoSubmit: true,
			responseType : 'json',
			onSubmit : function(file, ext) { //파일 업로드 submit 전에 수행될 함수, false 반환하면 파일 전송 중지
				if(_beforeSubmitCallback) {
					return _beforeSubmitCallback(file, ext);
				}
			},
			onComplete : function(file, response) { //파일 업로드을 수행하고 완료 됬을 때 수행될 함수
				if(_compleateCallback) {
					_compleateCallback(file, response);
				}
			}
		});
	},	
	
	/********************************************************************
	설명 : 검색창 리셋
	파라메터 :
	리턴값 :
	***********************************************************************/
	reset: function() {
		var that = this;
		
		// 제목
		that.title.val("");
		// 작성자명
		that.creator.val("");
		
		// easyui 콤보 박스 초기화 처리
		that.headOffice.combobox("clear");
	},
	
	/**********************************************************************
	설명 : 검색
	파라메터 :
	리턴값 :
	***********************************************************************/
	search : function() {
		var that = this;

		// 본부 id
		var headOffice = that.headOffice.combobox('getText');
		// 제목
		var title = that.title.val();
		// 작성자명
		var creator = that.creator.val();
		
		var message = "";
		
		message += "본부명: " + headOffice;
		message += "\n제목: " + title;
		message += "\n작성자명: " + creator;
		
//		alert(message);		
		
		var targetUrl = "/gis/mapInfo/searchBookmark";
    	var id = "mapInfoSearch";
		var gridTitle = "지도정보 검색";
		var gridId = "";
				
		$.ajax({
	        type: "GET",
	        url: targetUrl,
	        data: {
	        	  'headOffice': headOffice
	        	, 'title': title
	        	, 'creator': creator
	        	, 'totalCount': null
  	        	, 'page': 1
  	        	, 'rows': 10
	        },
	        dataType: "json",
	        contentType: "charset=UTF-8",
	        success: function(jsonData){
	    		if(jsonData.total == 0){
	    			$.messager.alert("알림", "검색결과가 없습니다.");
	    			return false;
	    		}
	    		
	    		gridId = datagrid.showResult("검색-"+gridTitle, null, jsonData, that.gridColumns, true, that.onClickRow, that.onDblClickRow);
	    		tabId  = gridId;
	    	    $("#" + gridId).datagrid("getPager").pagination({
	    	    	onSelectPage : function(page, rows){
	    	    		var params = {
	    	  	        	  'headOffice': headOffice
	    	  	        	, 'title': title
	    	  	        	, 'creator': creator
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
	    	    					// 내용을 다시 읽는다.
	    	    					$("#" + gridId).datagrid('reload');	
	    	    				    	    	    					
//	    	    					$("#" + gridId).pagination({
//	    								total : response.total,
//	    								pageSize : rows
//	    							});	
	    	    				} else {
	    	    					$.messager.alert("알림", "요청에 실패했습니다.");
	    	    				}
	    	    			}
	    	    			, "json"

	    	    		);
//	    	    		var queryString = "";
//	    	    		queryString += "&page=" + page;
//	    	    		queryString += "&rows=" + rows;
//	    	    		queryString += "&layerTreePk=" + layerTreePk;
//	    	    		queryString += "&unqMgno=" + unqMgno;
//	    	    		queryString += "&fctsNm=" + fctsNm;
//	    	    		queryString += "&lglCd=" + lglCd;
//	    	    		
//	    	    		$("#" + gridId).datagrid("getPanel").panel('refresh', '/gis/mapInfo/search?' + queryString);
	            	}
	    	    });
	        }
	    });		
	},
		
	checkExcelType: function(file, ext) {
		var that = this;
		
		if(ext == 'xls' || ext == 'xlsx') {
			return true;
		} else {
			$.messager.alert("알림", '엑셀 파일만 업로드 가능합니다.');
			return false;
		}		
	},	
	
	compleateUploadExcel: function (file, response) {
		var resultCode = response.resultCode;
		
		switch (resultCode) {
		case 200:
			$.messager.alert("알림", '성공적으로 저장하였습니다.\n다시 검색해 주세요.');
			break;
		default:
			$.messager.alert("알림", response.excelErrorMessage);
		
			switch(resultCode) {
			case 730:
				// $.messager.alert("알림", '엑셀 변환에 문제가 있습니다.');
				// break;
				
				// 팝업창으로 Bookmark 오류 세부 정보 보여주기
				var excel = JSON.stringify(response.excel);  // JSON = JSON.parse(String) / String = JSON.stringify(JSON)
	
				var winBookmarkErrorDetail = window.open("", "winBookmarkErrorDetail", "scrollbars=no,toolbar=no,resizable=no,width=900,height=700,left=100,top=100");
				winBookmarkErrorDetail.focus();
				
				$('#frm_mapInfobookmark_error_detail input[name="excelErrorMessage"]').val(response.excelErrorMessage);			
				$('#frm_mapInfobookmark_error_detail input[name="excel"]').val(excel);			
				$("#frm_mapInfobookmark_error_detail").submit();
				break;
			case 720:
				// $.messager.alert("알림", '엑셀 양식이 올바르지 않습니다.');
				break;
			case 710:
				// $.messager.alert("알림", '엑셀이 비어 있습니다.');
				break;
			case 600:  
				// $.messager.alert("알림", '엑셀 변환에 문제가 있습니다. 관리자에게 문의하세요.');
				break;
			default:
				break;
			}
		
		}
	},
	
	onClickRow: function(rowIndex, rowData) {
		//alert("onClickRow");
		$.ajax({
			type: "POST",
			url: "/gis/mapInfo/searchBookmarkExcel",
			data: {
				'bookmarkMasterId' : rowData.bookmarkMasterId
			},
			dataType: "json",
			success : function(data) {
				var format = new OpenLayers.Format.WKT();
				var features = [];
					for(var i in data.rows) {
						var feature = format.read(data.rows[i].geom);
						feature.attributes = dynamicSld.getSldPoint();
						features.push(feature);
					}					
					dynamicSld.showFeatures(features,tabId);	
					
			}
		});
	},
	
	onDblClickRow: function(rowIndex, rowData) {
		//alert("onDblClickRow");
		
		// 팝업창으로 Bookmark 세부 정보 보여주기
		var getRowValue = rowData;
		

		var winBookmark = window.open("", "winBookmark", "scrollbars=no,toolbar=no,resizable=no,width=900,height=700,left=100,top=100");
		winBookmark.focus();
		
		$('#frm_mapInfobookmark input[name="headOffice"]').val(rowData.headOffice);
		$('#frm_mapInfobookmark input[name="creator"]').val(rowData.creator);
		$('#frm_mapInfobookmark input[name="title"]').val(rowData.title);
		$('#frm_mapInfobookmark input[name="bookmarkMasterId"]').val(rowData.bookmarkMasterId);
		
		$("#frm_mapInfobookmark").submit();
	},
	
	// 검색 부분 그리드 컬럼 정의
	gridColumns: [[
	      {field:"bookmarkMasterId",title:"bookmarkMasterId", width:180, halign:"center", align:"left", sortable: false, hidden: true }
	    , {field:"headOffice",title:"본부명", width:180, halign:"center", align:"left", sortable: false}
	    , {field:"creator",title:"작성자", width:200, halign:"center", align:"left", sortable: false}
    	, {field:"title",title:"제목", width:120, halign:"center", align:"right", sortable: false}
    ]]
};