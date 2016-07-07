// 공인인증서 확인 및 Ajax 호출
// 인자리스트:
//		form: 공인 인증 확인용 폼
//		param: ajax 작업용 데이타
//		url: ajax 호출 위치
//		callback: ajax 종료 후 콜백 함수
function chkCertAndCallAjax(form, param, url, callback)
{
    var strData;
	var nResult;
	var strReturnData;
	var sessionID = "";
	//var strSendData; 
	
	strData= GPKISubmit(form); 
	nResult = Init();
	
	if( nResult == 117) {
		return;
	}
    
	if( form.challenge.value != null) {     
		sessionID = form.challenge.value;
	}

	if( GPKISecureWeb.SetSessionID(sessionID) != 1) {
		return;
	}
	
	nResult = GPKISecureWeb.Login(SiteID, strData);
	strReturnData = GPKISecureWeb.GetReturnData();
	
	if( nResult == 1 ) {
		// + 기호가 인코딩 되어 버리는 문제 해결
		strReturnData = strReturnData.replace(/\+/g, '%2B');
		
		startLoad();
		
		reqDate = "encryptedData=" + strReturnData + "&" + param;
		//$AM.fireText(url, param, callback, "POST");
		$AM.fireText(url, reqDate, callback, "POST");
		
		return true;
	}
	else {
		if( nResult != 106) {
			alert(strReturnData);
		}
		
		return false;
	}
}