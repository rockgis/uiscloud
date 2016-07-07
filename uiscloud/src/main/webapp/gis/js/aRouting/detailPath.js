"use strict";

// IE 8 오류로 console 사용 금지
var detailPath = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
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
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
	},
	
	onClickRow: function(rowIndex, rowData){
        // alert("준비중\n\nrowIndex: " + rowIndex + "\n\nrowData\n" + rowData.geometry.type);
        
        opener.aRoutingSearch.drawPartical(rowData.geometry);
    }
};