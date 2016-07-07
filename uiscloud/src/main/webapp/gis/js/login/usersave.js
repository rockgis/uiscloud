"use strict";

var usersave = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	user_id: $("#userId"),
	
	mb_id_enabled : $("#mb_id_enabled"),
		
	pwd: $("#pwd"),
	
	repassword: $("#repassword"),
	
	user_name: $("#userName"),
	
	email: $("#email"),
	
	user_region: $("#userRegion"),
	
	user_role: $("#userRole"),
	
	formsubmit: $("#formsubmit"),
	
	userSaveForm : $("#userSaveForm"),
	
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
		that.user_id.validatebox({
			validType : ["maxLength[20]"],
			tipPosition : "right"
		});
		
		// password 16글자 제한
		that.pwd.validatebox({
			validType : ["maxLength[16]"],
			tipPosition : "right"
		});
		
		
		// password 16글자 제한
		that.repassword.validatebox({
			validType : ["maxLength[16]"],
			tipPosition : "right"
		});
		
		
		that.user_id.select();
		
		
	/*	that.userSaveForm.validate({
			  rules: {
				 tel2: {
			      required: false,
			      number: true
			     },
				 tel3: {
				    required: false,
				    number: true
				 }
			  }
			});*/
	},
	
	/**********************************************************************
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
		that.user_id.blur(function(event) {
			
			that.user_id.val( that.user_id.val().replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ) );  //한글입력 불가 
			that.reg_mb_id_check(); // 아이디 체크 

			if(event.which == that.KEY_ENTER) {
				that.pwd.select();
			}
		});
		
		
		that.pwd.keydown(function(event) {
			if(event.which == that.KEY_ENTER) {
				that.repassword.select();
			}
		});
		
		that.repassword.keydown(function(event) {
			if(event.which == that.KEY_ENTER) {
				that.passwordcheck();
				that.user_name.select();
			}
		});
		
		that.user_name.keydown(function(event) {
			if(event.which == that.KEY_ENTER) {
				that.email.focus();
			}
		});
		
		/*
		that.tel3.keydown(function(event) {
			if(event.which == that.KEY_ENTER) {
				
				var mobile = $("#tel1 option:selected").val()+that.tel2.val()+that.tel3.val();
				that.tel.val(mobile);
			}
		});
		*/
		that.formsubmit.click(function() {
			
			that.usersave();
		});
		
	},
	/**********************************************************************
	설명 : 아이디 검증    
	파라메터 :
	리턴값 :
	***********************************************************************/
	reg_mb_id_check: function() {
		var that = this;
		
		var url = "/gis/selectMemberCheck";
		
		var User_ID=that.user_id.val();
		
		$.ajax({
	        type: 'GET',
	        url: url,
	        data: {
	           'userId': User_ID
	        },
	        cache: false,
	        async: false,
	        dataType: "json",
	        contentType: "charset=UTF-8",
	        success: function(result) {
	            var msg = $('#msg_mb_id');
	            switch(result.result) {
	                case '110' : msg.html('영문자, 숫자, _ 만 입력하세요.').css('color', 'red'); break;
	                case '120' : msg.html('최소 3자이상 입력하세요.').css('color', 'red'); break;
	                case '130' : msg.html('이미 사용중인 아이디 입니다.').css('color', 'red'); break;
	                case '140' : msg.html('예약어로 사용할 수 없는 아이디 입니다.').css('color', 'red'); break;
	                case '000' : msg.html('사용하셔도 좋은 아이디 입니다.').css('color', 'blue'); break;
	                default : alert( '잘못된 접근입니다.\n\n' + result ); break;
	            }
	            $('#mb_id_enabled').val(result.result);
	        }
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
	설명 : 회원 등록   
	파라메터 :
	리턴값 :
	***********************************************************************/
	usersave: function() {
		var that = this;
		
		var validItem = that.user_id || null;
				
		// username 20 글자수 제한 적용
		if(!validItem.validatebox("isValid")) {
			validItem.focus();
			return;
		}
		
		if(validItem.val() == "" || that.mb_id_enabled.val() =="130"){
			alert("user_id 을 입력해 주세요.");
			validItem.focus();
			return;
		}
		
		validItem = that.repassword || null;
				
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
		
		
		userSaveForm.submit();
	}
};