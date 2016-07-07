"use strict";

var login = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	username: $("#username"),
		
	password: $("#password"),
	
	submit: $("#submit"),
	
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
		
		// username 20글자 제한
		that.username.validatebox({
			validType : ["maxLength[20]"],
			tipPosition : "right"
		});
		
		// password 20글자 제한
		that.password.validatebox({
			validType : ["maxLength[20]"],
			tipPosition : "right"
		});
		
		that.username.select();
		
		$("#divReset li a img.toggle").mouseover(function() {
			if($(this).attr("src").indexOf("_n.") > 0) {
				$(this).attr("src", $(this).attr("src").replace("_n.", "_h."));
			}
		})
		.mouseout(function() {
			if($(this).attr("src").indexOf("_h.") > 0) {
				$(this).attr("src", $(this).attr("src").replace("_h.", "_n."));	
			}
		});	
		
	},

	/**********************************************************************
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
		that.username.keydown(function(event) {
			if(event.which == that.KEY_ENTER) {
				that.password.select();
			}
		});
		
		that.password.keydown(function(event) {
			if(event.which == that.KEY_ENTER) {
				that.submit.trigger("click");
			}
		});
		
		that.submit.click(function() {
			that.login();
		});
	},
	
	/**********************************************************************
	설명 : 로그인
	파라메터 :
	리턴값 :
	***********************************************************************/
	login: function() {
		var that = this;
		
		var validItem = that.username || null;
				
		// username 20 글자수 제한 적용
		if(!validItem.validatebox("isValid")) {
			validItem.focus();
			return;
		}
		
		if(validItem.val() == ""){
			alert("username 을 입력해 주세요.");
			validItem.focus();
			return;
		}
		
		validItem = that.password || null;
				
		// password 20 글자수 제한 적용
		if(!validItem.validatebox("isValid")) {
			validItem.focus();
			return;
		}
		
		if(validItem.val() == ""){
			alert("password 를 입력해 주세요.");
			validItem.focus();
			return;
		}
		
		frmLogin.submit();
	}
};