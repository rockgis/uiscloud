"use strict";

var passwdsave = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	user_id: $("#userId"),
		
	pwd: $("#pwd"),
	
	repassword: $("#repassword"),
	
	email: $("#email"),
	
	userCheckformsubmit: $("#userCheckformsubmit"),
	
	userCheckForm: $("#userCheckForm"),
	
	userSavePassformsubmit : $("#userSavePassformsubmit"),
	
	userSavePassForm : $("#userSavePassForm"),
	
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
		
		// username 10글자 제한
		that.user_id.validatebox({
			validType : ["maxLength[10]"],
			tipPosition : "right"
		});
		
		// password 10글자 제한
		that.pwd.validatebox({
			validType : ["maxLength[10]"],
			tipPosition : "right"
		});
		
		
		// password 10글자 제한
		that.repassword.validatebox({
			validType : ["maxLength[10]"],
			tipPosition : "right"
		});
		
		
		that.user_id.select();

	},
	
	/**********************************************************************
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
		that.user_id.keydown(function(event) {
			if(event.which == that.KEY_ENTER) {
				that.email.select();
			}
		});
		
		that.userCheckformsubmit.click(function() {
			that.passwdcheck();
		});
		
		
		that.pwd.keydown(function(event) {
			if(event.which == that.KEY_ENTER) {
				that.repassword.select();
			}
		});
		
		that.repassword.keydown(function(event) {
			if(event.which == that.KEY_ENTER) {
				that.passwordcheck();
			}
		});
		
		that.userSavePassformsubmit.click(function() {
			that.passwdsave();
		});
		
	},
	
	
	/**********************************************************************
	설명 : 패스워드 검증    
	파라메터 :
	리턴값 :
	***********************************************************************/
	passwordcheck: function() {
		var that = this;
				
		// password 20 글자수 제한 적용
		if(that.pwd.val() == that.repassword.val() ) {
			that.user_name.select();
			return;
		}else {
			alert("password를 다시 입력해 주세요.");
			that.pwd.focus();
			return;
		}

	},
	
	
	/**********************************************************************
	설명 : 패스워드 업데이트  
	파라메터 :
	리턴값 :
	***********************************************************************/
	passwdcheck: function() {
		var that = this;
		
		
		var validItem = that.user_id || null;
		
		if(validItem.val() == ""){
			alert("user_id 을 입력해 주세요.");
			validItem.focus();
			return;
		}
		
		
		userCheckForm.submit();
	},
	
	
	
	/**********************************************************************
	설명 : 패스워드 업데이트  
	파라메터 :
	리턴값 :
	***********************************************************************/
	passwdsave: function() {
		var that = this;
		
		// password 20 글자수 제한 적용
		if(that.pwd.val() == that.repassword.val() ) {
			
			userSavePassForm.submit();
			
		}else {
			
			alert("password를 다시 입력해 주세요.");
			that.pwd.focus();
			return;
		}
		
		
	}
};