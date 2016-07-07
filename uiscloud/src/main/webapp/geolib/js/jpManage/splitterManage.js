var splitterManage = {
	// 엔터키 코드
	KEY_ENTER: 13

	, init : function(){
		var that = this;
		
		that.initUI();
	}	
	, initUI : function(){
		var that = this;
		
		//접속함체
		uiInit.setJpCombobox($("#splitterManage .jp1"), staticJpMgno);
		uiInit.setJpCombobox($("#splitterManage .jp2"), staticJpMgno);

		//접속케이블
		uiInit.setJpCableCombobox($("#splitterManage .jpCable1"), staticJpCableList);
		uiInit.setJpCableCombobox($("#splitterManage .jpCable2"), staticJpCableList);
		
		//접속케이블 선번
		uiInit.setJpInputOutputCombobox($("#splitterManage .jpInput1"), $("#splitterManage .jpOutput1"), staticJpCableMgno);
		uiInit.setJpInputOutputCombobox($("#splitterManage .jpInput2"), $("#splitterManage .jpOutput2"), staticJpCableMgno);
		
		//임시연결케이블
		uiInit.setTempCableCombobox($("#splitterManage .tempJpCable1"), staticJpMgno);
		uiInit.setTempCableCombobox($("#splitterManage .tempJpCable2"), staticJpMgno);
		
		//임시연결케이블 선번
		uiInit.setJpInputOutputCombobox($("#splitterManage .jpTempInput1"), $("#splitterManage .jpTempInput1"), staticJpCableMgno);
		uiInit.setJpInputOutputCombobox($("#splitterManage .jpTempOutput1"), $("#splitterManage .jpTempOutput2"), staticJpCableMgno);
		
		//map버튼
		$("#splitterManage .mapInfo1").on("click", function(){
			var cableMgno = null;
			uiInit.moveMapByCableMgno(cableMgno);
		})
		$("#splitterManage .mapInfo2").on("click", function(){
			var cableMgno = null;
			uiInit.moveMapByCableMgno(cableMgno);
		})
		
		
	}	
	
		
};
