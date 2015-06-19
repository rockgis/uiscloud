/**
파일명 : util.js
설명 : 지도 공통 유틸 함수 
 
 수정일       수정자   수정내용
 ----------   -------  --------------------------------------------------
 2013.09.27 최원석	최초생성
 2013.10.25 김종민	Ajax 이용 파일 업로드 함수 추가
 2013.10.31 김종민	JSON 을 Excel 변환 후 다운로드 함수 추가
 2013.11.08 이민규  gfnCreateAddTab에서 같은 검색 결과라도 새로운 그리드 탭으로 보인다.
 2013.11.08 정봉화  gfnCreateAddTab에서 새로운 아이디를 리턴하게 한다.
 2013.11.11 정봉화  검색 결과 탭에서 마지막 선택된 그리드 아이디 가져오는 함수 추가.
 2013.11.21 정봉화  그리드 관련 함수들 개선.
 2013.12.05 정봉화  그리드에 건수가 나오게 함.
*/

/**********************************************************************
설명 : jeasy ui validatebox 기본값 변경
***********************************************************************/
$.extend($.fn.validatebox.defaults, {
	missingMessage : "필수 조건입니다.",
	tipPosition : "left"
});

/**********************************************************************
설명 : jeasy ui validatebox 기본 룰값 변경
***********************************************************************/
$.extend($.fn.validatebox.defaults.rules, {
	// 정수 최소값 체크
	min : {
		validator : function(value, minValue) {			
			return parseInt(value) >= minValue;
		},
		message : "{0} 이상의 정수값을 입력하여 주십시오."
	},
	// 정수 최대값 체크
	max : {
		validator : function(value, maxValue) {			
			return parseInt(value) <= maxValue;
		},
		message : "{0} 이하의 정수값을 입력하여 주십시오."
	},
	// 최대 입력 길이 체크
	maxLength : {
		validator : function(value, maxLength) {
			var len = $.trim(value).length;
			return len <= maxLength;
		},
		message : "{0} 이하 길이의 값을 입력하여 주십시오."
	},
	// 입력 길이 체크
	length : {
		validator : function(value, between) {
			var len = $.trim(value).length;
			return len >= between[0] && len <= between[1];
		},
		message : "{0} 과 {1} 사이 길이의 값을 입력하여 주십시오."
	},
	// 상세검색용 년도 체크
	detailLength : {
		validator : function(value, between) {
			var len = $.trim(value).length;
			return len >= between[0] && len <= between[1];
		},
		message : "YYYY 형식의 년도를 입력하여 주십시오."
	},
	// 범위 값 체크
	between : {
		validator : function(value, between) {
			return value >= between[0] && value <= between[1];
		},
		message : "{0} 과 {1} 사이 값을 입력하여 주십시오."
	},
	// 양수 체크
	positive : {
		validator : function(value) {
			var regExp = /^([+]?)(\d+)$/;
			return regExp.test(value);
		},
		message : "양수 값을 입력하여 주십시오."
	},
	// 정수 체크
	integer : {
		validator : function(value) {
			var regExp = /^([+-]?)(\d+)$/;
			return regExp.test(value);
		},
		message : "정수 값을 입력하여 주십시오."
	},
	// 숫자형 체크
	number : {
		validator : function(value) {
			var regExp = /^([+-]?)(?=\d|\.\d)\d*(\.\d*)?([Ee]([+-]?\d+))?$/;
			return regExp.test(value);
		},
		message : "숫자형의 값을 입력하여 주십시오."
	},
	//라디오 버튼
	requireRadio:{
		validator : function(value,param) {
			var input = $(param[0]);
			input.off('.requireRadio').on('click.requireRadio',function(){
				$(this).focus();
			});
			return $(param[0] + ':checked').val() != undefined;
		},
		message : 'please choose option for {1}.'
	},
	// 한글과 숫자만 입력 허용
	hangulNumber : {
		validator : function(value) {
			var reg = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힝|0-9]*$/;
			
			return reg.test(value);
		},
		message : "한글과 숫자만 입력하여 주십시오."
	},
	// 한글과 숫자, 공백만 입력 허용
	hangulNumberSpace : {
		validator : function(value) {
			var reg = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힝|0-9|\s]*$/;
			
			return reg.test(value);
		},
		message : "한글과 숫자, 공백만 입력하여 주십시오."
	}
});

/**********************************************************************
설명 : 로딩바 Ajax 호출 전 보이기, 호출 후 감추기
파라메터 :
리턴값 :
***********************************************************************/
function gfnLoadingBar() {
	$('#loadingBar').ajaxStart(function() { 
		$(this).show();
	}).ajaxStop(function() { 
		$(this).hide();
	});
}

/**********************************************************************
설명 : 마우스 우클릭 방지
파라메터 :
리턴값 :
***********************************************************************/
function gfnDeactiveRightClick() {
	document.oncontextmenu = function(){
		return false;
	};
}

/**********************************************************************
StringBuffer 사용 방법
   str = new StringBuffer();
   str.append("문자열");
   alert(str.toString())
***********************************************************************/

/**********************************************************************
설명 : StringBuffer 생성자
파라메터 :
리턴값 : StringBuffer 인스턴스
***********************************************************************/
var StringBuffer = function() {
    this.buffer = new Array();
};

/**********************************************************************
설명 : StringBuffer 에 문자열 추가
파라메터 : 추가할 문자열
리턴값 : 
***********************************************************************/
StringBuffer.prototype.append = function(obj) {
    this.buffer.push(obj);
};

/**********************************************************************
설명 : StringBuffer 에 문자열 추출
파라메터 : 
리턴값 : String
***********************************************************************/
StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};


/**********************************************************************
설명 : 문자열 Null 체크, Null 이면 지정된 문자열을 반환함
파라메터 : value - 확인할 문자값
 			 str - Null 일때 반환할 값
리턴값 : Null 이 아니면 원래 값, Null 이면 지정된 반환 값 
***********************************************************************/
function gfnCheckNullValue(value, str) {
	if(!str) {
		str = "-";
	}
	if(value == null || value == "" || value + "" == "NaN") {
		return str;
    } else {
        return value;
    }
}

/**********************************************************************
설명 : 지정된 길이만큼 좌측에 특정문자열 채움
파라메터 :  str - 기준 문자열
			len - 길이
 			ch 	- 특정문자
리턴값 : 문자열
***********************************************************************/
function gfnLPadString(str, len, ch) {
	var retVal = '';
	for(var i=str.length; i < len; i++) {
		if(ch) retVal += ch;
		else retVal += "0";
	}
	retVal += str;
	return retVal;
}

/**********************************************************************
설명 : 객체를 문자열로 반환
파라메터 : obj - 객체 (1 차원 객체 )
 			 ch - 객체값을 연결할 문자
리턴값 : 문자열
***********************************************************************/
function gfnConvertObjToStr(obj, ch) {
	var retVal = "";
	if(!ch) {
		ch = "&";
	}
	for(var i in obj) {
		retVal += ch;
		retVal += i;
		retVal += "=";
		retVal += obj[i];
	}
	return retVal.substr(1);
}

/**********************************************************************
설명 : 파일을 ajax 를 통해 업로드
파라메터 : _uploadButton 			(필수)업로드 버튼 id 
		   _beforeSubmitCallback 	(옵션)업로드 전 콜백 - false 를 반납하면 업로드 취소
		   _compleateCallback		(옵션)업로드 / 서버 저장 완료 후 콜백
		   _userId					(옵션)사용자 id - 사용자 id 에 따라 서브 폴더에 저장
		   _actionUrl				(옵션)기본은 '/bies/fileUpload'
리턴값 : json
***********************************************************************/
function gfnAjaxUpload(_uploadButton, _beforeSubmitCallback, _compleateCallback, _userId, _actionUrl) {
	// jQuery ajaxupload 적용
	new AjaxUpload(_uploadButton[0], {
		action : _actionUrl? _actionUrl: '/bies/fileUpload',
		data : {
			userId : _userId? _userId: ''
		},
		responseType : 'json',
		onComplete : function(file, response) { //파일 업로드 성공하였을 때 수행될 함수
			$('#loadingBar').hide();
			if(!_compleateCallback) {
			} else {
				_compleateCallback(file, response);
			}
		},
		onSubmit : function(file, ext) { //파일 업로드 submit 전에 수행될 함수, false 반환하면 파일 전송 중지
			$('#loadingBar').show();
			if(!_beforeSubmitCallback) {
			    //$('#loadingBar').hide();
			} else {
				var r = _beforeSubmitCallback(file, ext);
				
				if (r === false) {
					$('#loadingBar').hide();
					return false;
				}
				else {
					return true;
				}
			}
		}
	});
}

/**********************************************************************
설명 : excel 을 ArrayInArray 형태의 JSON 으로 변환 후 받아오기
파라메터 : _uploadButton 			(필수)업로드 버튼 id 
		   _beforeSubmitCallback 	(옵션)업로드 전 콜백 - false 를 반납하면 업로드 취소
		   _compleateCallback		(옵션)업로드 / 서버 저장 완료 후 콜백
리턴값 : json
***********************************************************************/
function gfnAjaxExcel2ArrayInArray(_uploadButton, _beforeSubmitCallback, _compleateCallback) {
	// jQuery ajaxupload 적용
	return new AjaxUpload(_uploadButton[0], {
		action : '/bies/excel2ArrayInArray',
		autoSubmit: true,
		responseType : 'json',
		onComplete : function(file, response) { //파일 업로드 성공하였을 때 수행될 함수
			if(!_compleateCallback) {
			} else {
				_compleateCallback(file, response);
			}
		},
		onSubmit : function(file, ext) { //파일 업로드 submit 전에 수행될 함수, false 반환하면 파일 전송 중지
			if(!_beforeSubmitCallback) {
			} else {
				return _beforeSubmitCallback(file, ext);
			}
		}
	});
}

/**********************************************************************
설명 : excel 을 JSON 으로 변환 후 받아오기
파라메터 : _uploadButton 			(필수)업로드 버튼 id 
		   _beforeSubmitCallback 	(옵션)업로드 전 콜백 - false 를 반납하면 업로드 취소
		   _compleateCallback		(옵션)업로드 / 서버 저장 완료 후 콜백
리턴값 : json
***********************************************************************/
function gfnAjaxExcel2JSON(_uploadButton, _beforeSubmitCallback, _compleateCallback) {
	// jQuery ajaxupload 적용
	return new AjaxUpload(_uploadButton[0], {
		action : '/bies/excel2json',
		autoSubmit: true,
		responseType : 'json',
		onComplete : function(file, response) { //파일 업로드 성공하였을 때 수행될 함수
			if(!_compleateCallback) {
			} else {
				_compleateCallback(file, response);
			}
		},
		onSubmit : function(file, ext) { //파일 업로드 submit 전에 수행될 함수, false 반환하면 파일 전송 중지
			if(!_beforeSubmitCallback) {
			} else {
				return _beforeSubmitCallback(file, ext);
			}
		}
	});
}


/**********************************************************************
설명 : 파일 다운로드 URL 반환
파라메터 : name 			(필수)파일명
		     userId			(옵션)사용자 아이디
		     bThumbnail		(옵션)썸네일여부
리턴값 : 파일 다운로드 URL
***********************************************************************/
function gfnGetDownloadUrl(name, userId, bThumbnail) {
	if(bThumbnail) {
		var baseName = name.substring(0, name.lastIndexOf("."));
		var extension = name.substring(name.lastIndexOf("."));
		name = baseName + "_Thumbnail" + extension;
	}
	var downloadUrl = "";
	downloadUrl += "/bies/fileDownload?requestedFile=";
	downloadUrl += name;
	
	if(userId) {
		downloadUrl += "&userId=" + userId;
	}
	return downloadUrl;
}

/**********************************************************************
설명 : JSON 을 Excel 변환 후 다운로드
파라메터 : 
	jsonField,  // 엑셀 헤더 정보
	jsonData  	// 엑셀 데이타 정보 
리턴값 : 
 ***********************************************************************/
function gfnJson2Excel(jsonField, jsonData) {
	var jsonFieldString = JSON.stringify(jsonField);
	var jsonDataString = JSON.stringify(jsonData);
	
	$("#jsonFieldString").val(jsonFieldString);
	$("#jsonDataString").val(jsonDataString);
	$("#frm_json2excel").submit();
}

/**********************************************************************
설명 : 시도, 시군구, 읍면동리 콤보 초기 셋팅 사용법
파라메터 : 
	시도 textbox id,  
	시군구 textbox id,  // 옵션
	읍면동리 textbox id,  // 옵션
리턴값 : 
 ***********************************************************************/

// 시도 리스트 테이터는 일회만 받는다.
var sidoListData;

/**********************************************************************
설명 : 시도, 시군구, 읍면동리 콤보 초기 셋팅
파라메터 : 
	시도 textbox id,  
	시군구 textbox id,  // 옵션
	읍면동리 textbox id,  // 옵션
리턴값 : 
 ***********************************************************************/
function setAddressComboBoxes(sidoComboBox, sggComboBox, emdComboBox) {
	// 최초 호출이 아니면 다단계 콤보를 초기화 하지 않는다.
	// if(sidoComboBox.combobox('getValue')) return;
	
	sidoComboBox.combobox({
		editable: false
	});
	
	if(sggComboBox != null) {
		sggComboBox.combobox('setValue', '전체');
		sggComboBox.combobox({
			editable: false
		});
	}
	
	if(emdComboBox != null) {
		emdComboBox.combobox('setValue', '전체');
		emdComboBox.combobox({
			editable: false
		});
	}
	
	// 시도 리스트 테이터는 일회만 받는다.
	if(sidoListData) {
		sidoComboBox.combobox({
			data: sidoListData,
			valueField : 'lglCd',
			textField : 'name',
			onSelect : function(record){
				if(sggComboBox != null) {
					setSggComboBox(record.lglCd, sggComboBox, emdComboBox);
				}
				
				if(emdComboBox != null) {
					setEmdComboBox("999999999", emdComboBox);
				}
			}
		});
		
		return;
	}
	
    $.get(
    	"/bies/address/selectSido",
    	function(response) {
    		if(response && response.result) {
    			sidoListData = response.result;

    			sidoComboBox.combobox({
    				data: response.result,
    				valueField : 'lglCd',
    				textField : 'name',
    				onSelect : function(record){

    					if(record.lglCd == ""){

							sggComboBox.combobox({
			    				data: [{lglCd: '',  name: '전체'}],
			    				valueField : 'lglCd',
			    				textField : 'name',
    							editable: false
			    			});

							emdComboBox.combobox({
			    				data: [{lglCd: '',  name: '전체'}],
			    				valueField : 'lglCd',
			    				textField : 'name',
    							editable: false
			    			});
							
    						return;
    					}
    					
    					if(sggComboBox != null ) {
    						setSggComboBox(record.lglCd, sggComboBox, emdComboBox);
    					}
    					if(emdComboBox != null ) {
    						setEmdComboBox("999999999", emdComboBox);
    					}
    				}
    			});
    		}
    		else {
    			alert("setAddressComboBoxes error code");
    		}
    	},
    	"json"
    );
}

/**********************************************************************
설명 : 시군구 콤보 조회
파라메터 : 
	시군구코드,  
	시군구 textbox id,  
	읍면동리 textbox id,  // 옵션
	targetOption  	// 초기 선택 시군구 lglCd 5 자리 옵션
리턴값 : 
 ***********************************************************************/
function setSggComboBox(lglCd, sggComboBox, emdComboBox) {
    $.get(
    	"/bies/address/selectSggBySidoLglCd?lglCd="+lglCd,
    	function(response) {
    		if(response && response.result) {
    			sggComboBox.combobox({
    				data: response.result,
    				valueField : 'lglCd',
    				textField : 'name',
    				onSelect : function(record){	
    					if(record.lglCd == "")
    					{
							emdComboBox.combobox({
			    				data: [{lglCd: '',  name: '전체'}],
			    				valueField : 'lglCd',
			    				textField : 'name',
    							editable: false
			    			});
							
    					}	
    					if(emdComboBox != null) 
						{
    						setEmdComboBox(record.lglCd, emdComboBox);
						}
    				}
    			});
    		}
    		else {
    			alert("error code");
    		}
    	},
    	"json"
    );	
}

/**********************************************************************
설명 : 읍면동리 콤보 조회
파라메터 : 
	읍면동리 코드,  
	읍면동리 textbox id,
	리 textbox id,  	// 옵션
리턴값 : 
 ***********************************************************************/
function setEmdComboBox(lglCd, emdComboBox) {

    $.get(
    	"/bies/address/selectEmdlBySggLglCd?lglCd="+lglCd,
    	function(response) {
    		if(response && response.result) {
    			emdComboBox.combobox({
    				data: response.result,
    				valueField : 'lglCd',
    				textField : 'name'
    			});
    		}
    		else {
    			alert("error code");
    		}
    	},
    	"json"
    );	
}

/**********************************************************************
설명 : 정수 숫자에 천단위로 콤마 찍기.
파라메터 : 숫자
    리코드,  
    리 textbox id
리턴값 : 천단위로 콤마가 찍어진 문자열. 소수점 아래 값이 있을 경우 올림.
 ***********************************************************************/
function gfnFormatNumber(number) {
    if (isNaN(number))
        return number;
    else {
        number = '' + Math.ceil(number);
        if (number.length > 3) { 
            var mod = number.length % 3; 
            var output = (mod > 0 ? (number.substring(0,mod)) : ''); 
            for (var i=0 ; i < Math.floor(number.length / 3); i++) { 
                if ((mod == 0) && (i == 0)) 
                    output += number.substring(mod+ 3 * i, mod + 3 * i + 3); 
                else 
                    output+= ',' + number.substring(mod + 3 * i, mod + 3 * i + 3); 
            }
            return output; 
        } else {
        	return number;
        }
    }
}

/**********************************************************************
설명 : 부동소수점 숫자에 천단위로 콤마 찍기.
파라메터 : 숫자
    리코드,  
    리 textbox id
리턴값 : 천단위로 콤마가 찍어진 문자열. 소수점 아래는 유지.
 ***********************************************************************/
function gfnFormatNumberFloat(number) {
    if (number == null)
        return "";
    else if (isNaN(number))
        return number;
    else {
        number = ''+number;
        var p = number.indexOf(".", 0);
        var pointTailNum = '';
        if (p > 1) 
            pointTailNum = number.substring(p, number.length);
        
        number = ''+parseInt(number);
        
        if (number.length > 3) { 
            var mod = number.length % 3; 
            var output = (mod > 0 ? (number.substring(0,mod)) : ''); 
            for (var i=0 ; i < Math.floor(number.length / 3); i++) { 
                if ((mod == 0) && (i == 0)) 
                    output += number.substring(mod+ 3 * i, mod + 3 * i + 3); 
                else 
                    output+= ',' + number.substring(mod + 3 * i, mod + 3 * i + 3); 
            } 
            return output + pointTailNum; 
        } else
            return pointTailNum? number: number + "." + pointTailNum;
    }
}

/**********************************************************************
설명 : 부동소수점 숫자에 천단위로 콤마 찍기.
파라메터 : 숫자
    리코드,  
    리 textbox id
리턴값 : 천단위로 콤마가 찍어진 문자열. 소수점 아래는 2 자리까지만.
 ***********************************************************************/
function gfnFormatNumberFloat2(number) {
    if (number == null)
        return "";
    else if (isNaN(number))
        return number;
    else {
        number = '' + Number(number).toFixed(2);
        
        var nums = number.split(".");
        
        var intNumber = nums[0];
        var pointTailNum = nums[1];
        
        if (intNumber.length > 3) { 
            var mod = intNumber.length % 3; 
            var output = (mod > 0 ? (intNumber.substring(0,mod)) : ''); 
            for (var i=0 ; i < Math.floor(intNumber.length / 3); i++) { 
                if ((mod == 0) && (i == 0)) 
                    output += intNumber.substring(mod+ 3 * i, mod + 3 * i + 3); 
                else 
                    output+= ',' + intNumber.substring(mod + 3 * i, mod + 3 * i + 3); 
            } 
            return output + "." + pointTailNum; 
        } else
            return intNumber + "." + pointTailNum;
    }
}

/**
 * 잔여 코어수 계산
 */
function gfnRemandCore(value, row, index) {
	row.remandCoreC = row.coreCnt - row.useCoreC;
	
	return row.remandCoreC;
} 

/**
 * 그리드에 Tab 추가하기
 * id는 새로 부여되어 리턴되고, 타이틀도 순번이 뒤에 붙어서 나오게 된다.
 * @param id 부여할 아이디. 중복을 피하기 위해 뒤에 일련번호가 붙여져서 처리됨.
 * @param title 탭에 표시할 타이틀. 이것도 중복을 피하기 위해 뒤에 일련번호가 붙여져서 처리됨.
 * @param singleSelect 그리드 내에 row 다중클릭/단건클릭여부 체크
 * @param onclickRow 그리드내에 row를 클릭할때 마다 callback으로 function을 받아 처리
 * @return 새로 부여된 아이디
 */
function gfnCreateAddTab(id, title, singleSelect, datas, onclickRow){
	if(datas.rows.length == 0){
		$.messager.alert("알림", "검색결과가 없습니다.");
		return false;
	}
	
	$("#div_layout").layout("expand", "south");
	// 객체를 복제시킴. 서로 데이터가 물고 있어서 칼럼 크기 변경시 오동작을 발생시키기 때문.
    var newCols = JSON.parse(JSON.stringify(commonGridColumns));
    // 대장면적과 대장가액 콤마 들어가게 포맷터 넣기. 메소드는 json으로 넘어가지 않기 때문.
    newCols[3].formatter = commonGridColumns[3].formatter;
    newCols[4].formatter = commonGridColumns[4].formatter;
    var columList = [];
    columList.push(newCols);
    var rowCnt = datas.rows.length;
    if (rowCnt > 50 ) { // 건수가 너무 많으면 브라우져가 느려지므로 사용자가 다 볼지 선택하게 한다.
        // message.getConfirm은 비동기로 동작하므로 사용하지 못함.
        var r = confirm(message.getMessage("MSG1510", rowCnt).message);
        if (r) {
            rowCnt = 50;
            datas.rows = datas.rows.slice(0, 50);
        }
    }

    var rowCnt = datas.rows.length;
    //var num = $("#div_bottom_tab").tabs("tabs").length;
    ++gridIdex;
    var ids = id + gridIdex;
    var newTitle = gridIdex + "." + title + "(" + gfnFormatNumber(rowCnt)+"건)";
    
    //검색된 데이터가 없으면 검색결과가 없는 html 코드를 넣는다.
//    var onContent = 
    var resultContents = 
            "<table id=\""+ids+"\"\ class=\"easyui-datagrid\"\" style=\"height:"+commonGridHeight+"px\">" +
            "<thead data-options=\"frozen:true\"><tr>" +
            "<th data-options=\"field:'itemNo',checkbox:true\"></th>" +
            "</tr></thead>" +
            "</table>";
//	var offContent = "<div id=\"gridContent\"><ul><li class=\"gridSearch\">검색결과가 없습니다.</li></ul></div>";
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
        	gfnHighlightFeatureByLglCd(rowData.lglCdNo,false,false);
        },
        onUncheck : function(rowIndex, rowData){
        	var layer = gfnGetLayer("searchLayer");
        	var features = layer.features;
        	for(var i=features.length-1; i >= 0; i--) {
        		if(features[i] && features[i].data && features[i].data.LglCd == rowData.lglCdNo) {
        			layer.removeFeatures(features[i]);
        		}
        	}
        },
        onCheckAll : function(rows){
        	var lglCdLists = [];
        	for(var i=0; i<rows.length; i++){
        		lglCdLists.push(rows[i].lglCdNo);
        	}
        	gfnHighlightFeatureByLglCd(lglCdLists,false,false);
        },
        onUncheckAll : function(rows){
        	gfnGetLayer("searchLayer").removeAllFeatures();
        }
    });
    return ids;
}

/**
 * 선택된 탭의 그리드의 ID를 리턴
 * @return 현재 선택된 그리드 ID
 */
function gfnGetSelectedTabGridId() {
    var tab = $('#div_bottom_tab').tabs('getSelected');
    var grid = tab.panel('options').content;
    var id = $(grid).attr('id');
    if (id == null) // 널이면 사용자 그리드를 가져온다.
        return "userGrid";
    else
        return id;
}

function gfnEmdKeyowrSearch(txt, grid) {
	// 읍면동 검색 5 글자수 제한 적용
	if(!txt.validatebox("isValid")) {
		txt.focus();
		return;
	}
	
	if(txt.val() == ""){
		alert("행정구역명(읍면동리)를 한자 이상 입력해 주세요.");
		return;
	}

	$.post(
        "/bies/info/searchEmdList",
        {
        	'areaNm': txt.val()
        },
        function(jsonData){
        	// 검색 결과 표시
        	grid.datagrid("getPanel").panel("open");
        	// 검색 결과 그리드 창 영역
        	grid.datagrid('resize');
        	// 데이터 저장
			grid.datagrid('loadData', jsonData);
			// 내용을 다시 읽는다.
		    grid.datagrid('reload');
        },
        "json"
    );
}

function gfnCreateGrid(grid, cap, sgg, tts, li) {
	// 행정구역 검색 결과 그리드 생성
	grid.datagrid({
		data : null,
		columns : [[
		    {field:"lglCdNo", title:"LglCd", align:"center", hidden: true},
		    {field:"areaNm", title:"행정구역명", align:"left", sortable: true}
		]],
		closed : true,
		pagePosition: "top",
		singleSelect : true,
		onClickRow : function(rowIndex, rowData) {
			getAddressComboSetting(rowData.lglCdNo, cap, sgg, tts, li);
		}
	});
}


/**********************************************************************
설명 : easyUI DateBox 포맷 설정
***********************************************************************/
function gfnEasyUiDateFormatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth()+1;
    var d = date.getDate();
    return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
};

function gfnEasyUiDateParser(s) {
    if (!s) return new Date();
    var ss = s.split('-');
    var y = parseInt(ss[0],10);
    var m = parseInt(ss[1],10);
    var d = parseInt(ss[2],10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
            return new Date(y,m-1,d);
    } else {
            return new Date();
    }
};

/**********************************************************************
설명 : easyUI 숫자 Sorter 구현
***********************************************************************/
function gfnNumberSorter(a, b){
	var num1 = Number((a + "").replace("%", ""));
	var num2 = Number((b + "").replace("%", ""));
	
	if(isNaN(num1) || isNaN(num2)) {
		return (a >= b)? 1: -1;
	}
	
	return (num1 >= num2)? 1: -1;
}

/**********************************************************************
설명 : 값을 입력 받아서 숫자로 변환 가능하면 해당 숫자로
       변환 불가능하면 0 을 반환
***********************************************************************/
function gfnNumberOrZero(op) {
	return (Number(op) == NaN ? 0: Number(op));	
}


/**********************************************************************
설명 : 체크 박스 그룹 에선 check 된 것만 찾아서 배열로 리턴
***********************************************************************/
function gfnCheckBoxCheckedToArray(target) {
	var arr = [];
	
	target.filter(":checked").each(function() {
		arr.push($(this).val());
	});	
	
	return arr;
}


/**********************************************************************
설명 : 체크 박스 그룹 초기화
***********************************************************************/
function gfnClearCheckBoxGroup(target) {
	for(var i = 0; i < target.length; i++) {
		target[i].checked = false;
	}
}