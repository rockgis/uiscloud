"use strict";

$(document).ready(function() {
	investmentDuplicateCheck.init();
});

var investmentDuplicateCheck = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 중복투자 여부
	yn: $("#chkFrm .yn"),
	noReason: $("#chkFrm .noReason"),
	detail: $("#chkFrm .noReason"),
	addFileBtn: $("#addFile"),
	insertOpr: $("#chkFrm .insertOpr"),
	saveBtn: $("#chkFrm .save"),
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
		
		// 중복투자 엽 combobox 초기화
		that.initYnComboBox();
		that.initNoReasonComboBox();
		
		/*if (that.insertOpr.val() == "")
			that.insertOpr.val(usersave.user_name);*/
	},
	
	/**********************************************************************
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		that.yn.combobox({
				onSelect: function(record) {
						if (record.value == "Y") {
							that.noReason.combobox("clear");
						}
					}
				});
		
		that.addFileBtn.click(function() {
			that.addFile();
		});
		
		// 저장
		that.saveBtn.click(function() {
			that.save();
		});
	},
	
	/**********************************************************************
	설명 : 중복투자 여부 combobox 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initYnComboBox: function() {
		var that = this;
		this.yn.combobox({
			data : [
			        {"korName": "중복투자", "value": "Y"}
			        , {"korName": "중복투자 아님", "value": "N"}
			]
			, valueField : 'value'
			, textField : 'korName'
			, editable : false
		});
	},
	initNoReasonComboBox: function() {		
		this.noReason.combobox({
			data : [
			        {"value": "현장 임시 케이블(긴급복구 등)"}
			        , {"value": "데이터 오입력"}
			        , {"value": "고객측 별도 케이블 분리 요청"}
			        , {"value": "현장케이블 용량 부족"}
			        , {"value": "기설케이블 활용 불가"}
			        , {"value": "기존회설 철거로 인한 여유용량 발생"}
			]
			, valueField : 'value'
			, textField : 'value'
			, editable : false
		});
	},
	/**********************************************************************
	설명 : 파일 첨부
	파라메터 :
	리턴값 :
	***********************************************************************/
	addFile: function() {
		var fileIndex = $('#fileList ul').children().length;

	    if(fileIndex > 1){
	    	alert("첨부파일은 최대 1개입니다.");
	    	return;
	    }
	    $('#fileList').append(
	            '<ul style=list-style-type:none;><li>'+
	            '   <input type="file" name="files['+ fileIndex +']" />'+
	            '</ul></li>');
	}, 
	/**********************************************************************
	설명 : 저장
	파라메터 :
	리턴값 :
	***********************************************************************/
	save: function() {
		var that = this;
		
		var frm = document.getElementById("chkFrm");
		
		if ($("input[name=yn]").val() == "") {
			alert("중복투자 여부를 선택하세요.");
			return;
		}
		
		if ($("input[name=yn]").val() == "N") {
			if ($("input[name=noReason]").val() == "") {
				alert("중복투자 아닌 경우 사유를 선택하세요.");
				return;
			}
		}
		if ($("input[name=detail]").val() == "") {
			alert("세부사유를 입력하시기 바랍니다.");
			return;
		}

		if ($("input[name=insertOpr]").val() == "") {
			alert("작성자 성명을 입력하시기 바랍니다.");
			return;
		}
		
		frm.action = "saveCheck";
		frm.submit();

	}, 
	downloadCheckFile: function(investDupSeq) {
		document.getElementById("fileForm").investDupSeq.value = investDupSeq;
		document.getElementById("fileForm").action = "/gis/investmentInfo/downloadCheckFile";
		document.getElementById("fileForm").submit();
	},
	deleteCheckFile: function(investDupSeq) {
		document.getElementById("fileForm").investDupSeq.value = investDupSeq;
		document.getElementById("fileForm").action = "/gis/investmentInfo/deleteCheckFile";
		document.getElementById("fileForm").submit();
	}
};
