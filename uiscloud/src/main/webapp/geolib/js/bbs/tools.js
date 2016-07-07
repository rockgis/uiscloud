/**
 * 매인 메뉴 선택
 * @param idx
 * @return
 */
function setMenu(idx) {
	var list = document.getElementById("menuList");
	list.childNodes[idx].className = "on";
	try {
		list.childNodes[idx].setAttribute("class", "on");
	} catch(e) {
		
	}
	//list.childNodes[idx].setAttribute("class", "on");
	//document.getElementById("m" + obj).setAttribute("class", "m_selected");
}
/**
 * 오늘 날짜를 문자열로
 * @return
 */
function getToday() {
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var date = d.getDate();
	if(month < 10) {
		month = "0" + month;
	}
	if(date < 10) {
		date = "0" + date;
	}
	
	return year +"-" + month + "-" + date;
}

 /**
  * 스트링의 Byte수를 구한다.
  * @param str
  * @return
  */
 function getStringBytes(str) {
		var count = 0;

		for ( i = 0 ; i < str.length ; i++ ) {
			var code = str.charCodeAt (i);
			if (code > 128) count += 2; // 한글일 경우
			else count++;	
		}
		return count;
	}

 
/**
 * 시도 시군구 선택
 * @param sggCd
 * @param sidoName
 * @param sggName
 * @return
 */
function setSidoSggBySgg(sggCd, sidoName, sggName) {
	if(sggCd == "") {
		return;
	}
	var sidoCd = sggCd.substring(0,2);
	$("#"+sidoName).val(sidoCd); 
	$("#"+sggName).val(sggCd);

}
 
function setAddrToSelectBox(addr, sidoId, sggId, emdId, riId, sanId, mNumId, sNumId) {
	if (addr == "") {
		return;
	}
	var sidoCd = addr.substring(0,2);
	var sggCd = addr.substring(0,5);
	var emdCd = addr.substring(0,8);
	var riCd = addr.substring(8,10);
	var sanCd = addr.substring(10,11);
	var mNum = parseInt(addr.substring(11,15),10);
	var sNum = parseInt(addr.substring(15),10);
	$("#"+sidoId).val(sidoCd);
	$("#"+sggId).val(sggCd);
	$("#"+emdId).val(emdCd);
	if (riCd != "00") {
		$("#"+riId).val(emdCd+riCd);
	}
	if (sanCd == "2") {
		$("#"+sanId).attr("checked", "true");
	}
	if (mNum > 0)
		$("#"+mNumId).val(mNum);
	if (sNum > 0)
		$("#"+sNumId).val(sNum);

}
 
function trim(str) {
	    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}


function startLoad(){
	try{
		endLoad();
	}catch(e){}
	
	var src = "/upispweb/images/img/loading.gif";
	var width = "220px";
	var height = "91px";
	var img = "<img src='<SRC>' width='<WIDTH>' height='<HEIGHT>'/>".replace("<SRC>", src);
	img = img.replace("<WIDTH>", width);
	img = img.replace("<HEIGHT>", height);
	var div = document.createElement("div");
	div.style.width = width;
	div.style.height = height;
	div.style.left = "50%";
	div.style.top = "50%";
	div.style.position = "absolute";
	div.style.zIndex = "9999999";
	div.id = "loadDIV";
	
	div.innerHTML = img;
	
	var body = document.getElementsByTagName("BODY")[0];
	body.appendChild(div);
	//$('#wrap').fadeTo('fast', 0.3);
	
}

function endLoad() {
	var body = document.getElementsByTagName("BODY")[0];
	var div = document.getElementById("loadDIV");
	//body.removeChild(body.children[body.children.length-1]);	
	body.removeChild(div);
	//$('#wrap').fadeTo('fast', 1.0);
}

