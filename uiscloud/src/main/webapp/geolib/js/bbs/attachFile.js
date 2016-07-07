// 첨부파일 UI Class
//
// attachFileClass: new 로 생성한 AttachFile 변수명
// attachIdx: 현재 인덱스
// startAttachIdx: 시작 인덱스
// attachFormId: attachInputSpanId 들을 둘러싸는 span ID
// attachInputSpanId: 파일 input Span ID
// attachFileId: 파일 input ID
// attachFileField: 파일 input name
// attachListTrId: 파일 리스트를 그리는 테이블이 tr ID
// attachListTableId: 파일 리스트를 그리는 테이블 ID
// isAppendInput: true 이면 초기화시 file input 생성, false 이면 생성안함
// attachFileCmt: 첨부파일 코멘트 필드 input name
// attachImageTextAreaId : Image 태그를 삽입할 Textarea ID

function AttachFile(attachFileClass, attachIdx, startAttachIdx, attachFormId, attachInputSpanId, 
	attachFileId, attachListLiId, attachListUlId, baseContext, isAppendInput, maxCount) {
	try {
		this.attachFileClass = attachFileClass;
		this.attachIdx = attachIdx;
		this.startAttachIdx = startAttachIdx;
		this.attachFormId = attachFormId;
		this.attachInputSpanId = attachInputSpanId;
		this.attachFileId = attachFileId;
		this.attachListLiId = attachListLiId;
		this.attachListUlId = attachListUlId;
		this.baseContext = baseContext;
		this.deleteAttachListId = "deleteAttachList";
		if (maxCount == undefined) this.maxCount = 999;
		else this.maxCount = maxCount;
		this.currentCount = startAttachIdx;
		
		//checkFileExtension();
				
		AttachFile.prototype.appendAttachInput = appendAttachInput;
		AttachFile.prototype.hiddenAttachInput = hiddenAttachInput;
		AttachFile.prototype.appendAttachList = appendAttachList;
		AttachFile.prototype.removeAttachList = removeAttachList;
		AttachFile.prototype.removeAttachInput = removeAttachInput;
		AttachFile.prototype.removeAttachFile = removeAttachFile;
		AttachFile.prototype.setDeleteAttachListId = setDeleteAttachListId;
		AttachFile.prototype.setMaxCount = setMaxCount;
		AttachFile.prototype.checkFileExtension = checkFileExtension;
		AttachFile.prototype.attachCount = attachCount;
				
		if (isAppendInput == true) {
			this.appendAttachInput();
		}
	} catch(e) {
		alert("AttachFile : "+ e.message);
	}
}

function setMaxCount(mc) {
	this.maxCount = mc;
}

function setDeleteAttachListId(varname) {
	this.deleteAttachListId = varname;
}

function appendAttachInput() {
	// 업로드 불가능 파일 확장자인 파일을 선택했을 경우는 그냥 통과
	if (this.checkFileExtension() == false) {
		return;
	}
	
	// 파일 주석 필드
	var cmtFieldStr = "";
	
	var attachForm = $("#"+ this.attachFormId);
	var attachInputStr = "<span id="+ this.attachInputSpanId + this.attachIdx +
		"><input type=file id="+ this.attachFileId + this.attachIdx +" name="+ 
		this.attachFileId +" class='input' size=50 style='width:400px;height:20px'" +
		" onchange='"+ this.attachFileClass + ".appendAttachInput()'></span>";
	//alert(attachInputStr);
	attachForm.append(attachInputStr);

	this.hiddenAttachInput();
	this.appendAttachList();
	this.attachIdx++;

	// 최대갯수만큼 찼으면 파일선택박스 안 보이게 처리
	if (this.currentCount == this.maxCount) {
		$("#"+ this.attachInputSpanId + (this.attachIdx-1)).hide();
	}
}

// 파일 input 을 감춘다.
function hiddenAttachInput() {
	if (this.attachIdx <= this.startAttachIdx) return;
	$("#"+ this.attachInputSpanId + (this.attachIdx-1)).hide();
}

// 파일 리스트 테이블에 tr 을 추가한다.
function appendAttachList() {
	if (this.attachIdx <= this.startAttachIdx) return;
	// 선택된 파일명
	var tmpAttachValue = $("#"+ this.attachFileId + (this.attachIdx-1)).val();
		tmpAttachValue = 
			"<li id="+ this.attachListLiId + (this.attachIdx-1) +">"+ 
			"<a href=\"#\" class=\"link\">"+ tmpAttachValue.substring(tmpAttachValue.lastIndexOf("\\")+1) + "</a>" +
			"<a href=\"#\" onclick=\""+ this.attachFileClass +".removeAttachList("+ (this.attachIdx-1) +
			//",true)\"><img src=\"<c:url value='/images/admin/btn_del.gif'/>\" alt=\"삭제\" class=\"vam\" />" +
			",true)\"><img src=\"" + this.baseContext + "images/admin/btn_del.gif\" alt=\"삭제\" class=\"vam\" />" +
			"</a></li>";
		
	//alert(tmpAttachValue);
	$("#"+ this.attachListUlId).append(tmpAttachValue);

	this.currentCount++;
}

// 파일 리스트 테이블에서 tr 을 제거한다.
function removeAttachList(idx, flag) {

	$("#"+ this.attachListLiId + idx).remove();
	this.removeAttachInput(idx);
	this.currentCount--;
}

// 파일 input 을 제거한다.
function removeAttachInput(idx) {
	if (idx >= this.startAttachIdx) {
		$("#"+ this.attachInputSpanId + idx).remove();
	}

	if (this.currentCount == this.maxCount) {
		$("#"+ this.attachInputSpanId + (this.attachIdx-1)).show();
	}
}

// 수정화면에서 기존 파일들을 삭제할 때 호출한다.
function removeAttachFile(idx, fileId, fileDel) {
	try {
		this.removeAttachList(idx, false);
		var frm = document.forms.updateForm;
		var delFile = document.createElement("input");
		delFile.setAttribute("type", "hidden");
		delFile.setAttribute("name", "fileId");
		delFile.setAttribute("value", fileId);
		frm.appendChild(delFile);
		
		var delFileYn = document.createElement("input");
		delFileYn.setAttribute("type", "hidden");
		delFileYn.setAttribute("name", "fileDel");
		delFileYn.setAttribute("value", fileDel);
		frm.appendChild(delFileYn);
		
	} catch(e) {
		alert("removeAttachFile : "+ e.message);
	}
}

// 파일 확장자 체크
function checkFileExtension() {
	if (this.attachIdx > this.startAttachIdx) {
		var attachFilepath = $("#"+ this.attachFileId + (this.attachIdx-1)).val();
		var attachFilename = attachFilepath.substring(attachFilepath.lastIndexOf("\\")+1);
		var attachFileExt = attachFilename.substring(attachFilename.lastIndexOf(".")+1).toLowerCase();
		
		if (this.isImage == true) {
			if (attachFileExt != 'jpg' && attachFileExt != 'jpeg' && attachFileExt !='png' && attachFileExt != 'gif') {
				alert("선택하신 파일이 이미지 파일이 아닙니다.");
				$("#"+ this.attachFileId + (this.attachIdx-1)).replaceWith($("#"+ this.attachFileId + (this.attachIdx-1)).clone(true));
				return false;
			}
		}
		else {
			if (attachFileExt == 'jsp' || attachFileExt == 'php' || attachFileExt == 'asp' || attachFileExt == 'exe' || attachFileExt == 'com' &&
				attachFileExt == 'htm' || attachFileExt == 'html' || attachFileExt == 'aspx' || attachFileExt == 'bat' || attachFileExt == 'js' && 
				attachFileExt == 'cgi' || attachFileExt == 'pl') {
				alert("선택하신 파일 종류는 업로드하실 수 없습니다.");
				$("#"+ this.attachFileId + (this.attachIdx-1)).replaceWith($("#"+ this.attachFileId + (this.attachIdx-1)).clone(true));
				return false;
			}
		}
	}
	return true;
}

function attachCount() {
	
	return this.attachIdx;
}
