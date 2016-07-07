var opticalFiberManage = {
	// 엔터키 코드
	KEY_ENTER: 13

	, init : function(){
		var that = this;
		
		that.initUI();
	}	
	, initUI : function(){
		var that = this;
		
		//접속함체
		uiInit.setJpCombobox($("#opticalFiberManage .jp1"), staticJpMgno);
		uiInit.setJpCombobox($("#opticalFiberManage .jp2"), staticJpMgno);

		//접속케이블
		uiInit.setJpCableCombobox($("#opticalFiberManage .jpCable1"), staticJpCableList);
		uiInit.setJpCableCombobox($("#opticalFiberManage .jpCable2"), staticJpCableList);
		
		//접속케이블 선번
		uiInit.setJpInputOutputCombobox($("#opticalFiberManage .jpInput1"), $("#opticalFiberManage .jpOutput1"), staticJpCableMgno);
		uiInit.setJpInputOutputCombobox($("#opticalFiberManage .jpInput2"), $("#opticalFiberManage .jpOutput2"), staticJpCableMgno);
		
		//임시연결케이블
		uiInit.setTempCableCombobox($("#opticalFiberManage .tempJpCable1"), staticJpMgno);
		uiInit.setTempCableCombobox($("#opticalFiberManage .tempJpCable2"), staticJpMgno);
		
		
		//임시연결케이블 선번
		uiInit.setJpInputOutputCombobox($("#opticalFiberManage .jpTempInput1"), $("#opticalFiberManage .jpTempInput1"), staticJpCableMgno);
		uiInit.setJpInputOutputCombobox($("#opticalFiberManage .jpTempOutput1"), $("#opticalFiberManage .jpTempOutput2"), staticJpCableMgno);

		//map버튼
		$("#opticalFiberManage .mapInfo1").on("click", function(){
			var cableMgno = null;
			uiInit.moveMapByCableMgno(cableMgno);
		})
		$("#opticalFiberManage .mapInfo2").on("click", function(){
			var cableMgno = null;
			uiInit.moveMapByCableMgno(cableMgno);
		})
		
	}	
	, dblClickConn : function(connInfo){
		//var connInfo = {source : null, target : null, core1 : null, core2 : null};
		var that = this;

		
	}
};
