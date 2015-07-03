/**
 * 파일명 : message.js
 * 설명 : 자바스크립트 메세지 처리
 * 
 * 수정일       수정자   수정내용
 *----------   -------  --------------------------------------------------
 *2013.11.07    최원석	  최초 생성
 *2013.11.12    정봉화    검색부분 추가.
 */
var message = {
	
	// 메세지 코드 목록
	codes : {
		// 0 - 공통 메세지
		MSG0001 : {
			title : "",
			message : "{0}가 저장되었습니다."
		},
		MSG0002 : {
			title : "",
			message : "{0}가 수정되었습니다."
		},
		MSG0003 : {
			title : "",
			message : "{0}가 삭제되었습니다."
		},
        MSG0004 : {
            title : "",
            message : "정말 삭제하시겠습니까?"
        },
        MSG0005 : {
            title : "",
            message : "선택된 리스트가 없습니다."
        },
        MSG0006 : {
            title : "",
            message : "검색된 결과가 없습니다."
        },
        MSG0007 : {
            title : "",
            message : "리스트가 존재하지 않습니다."
        },
		MSG0101 : {
			title : "",
			message : "{0}는 필수 파라미터 입니다.(개발자용)"
		},
		MSG0201 : {
			title : "파일등록",
			message : "지원되지 않는 확장자입니다."
		},

		MSG0901 : {
			title : "검색목록반환",
			message : "업무에 일괄 반영 하시겠습니까?"
		},
		 MSG0902 : {
			title : "검색목록반환",
			message : "선택한 목록을 반환하시겠습니까?"
		},
		
		// 1000 - 지도 기능 메세지
		MSG1010 : {
			title : "",
			message : "주제도는 10레벨 부터 표시됩니다. <br/> 10레벨로 이동하시겠습니까?"
		}, 
        MSG1013 : {
            title : "정보보기",
            message : "해당 영역에 시설물 정보가 조회되지 않습니다."
        },
		// 1500 - 검색
		MSG1501 : {
            title : "검색목록",
            message : "사용자주제도 목록에 추가하겠습니까?"
		},
        MSG1502 : {
            title : "검색목록",
            message : "엑셀로 저장하시겠습니까?"
        },
        MSG1503 : {
            title : "검색목록",
            message : "구글어스 KML 파일로 저장하겠습니까?"
        },
        MSG1504 : {
            title : "재검색",
            message : "'{0}'에 대한 검색된 결과가 없습니다."
        },
        MSG1505 : {
            title : "검색목록",
            message : "사용자주제도에 저장하시겠습니까?"
        },
        MSG1506 : {
            title : "검색목록",
            message : "사용자 소관코드가 정의되지 않았습니다."
        },
        MSG1507 : {
            title : "검색목록",
            message : "{0}의 소관({1})이 사용자 소관({2})과 달라 추가할 수 없습니다."
        },
        MSG1508 : {
            title : "검색목록",
            message : "{0}는 사용자주제도 목록에 이미 추가되어 있습니다."
        },
        MSG1509 : {
            title : "검색목록",
            message : "작업 목록에 추가할 것을 먼저 체크하여 주세요."
        },
        MSG1510 : {
            title : "검색목록",
            message : "총 건수가 {0}개로 느려질 수 있는데 50개만 표시하겠습니까?\n취소를 누르면 모두 다 표시합니다."
        },
        MSG1511 : {
            title : "검색목록",
            message : "선택 할 목록을 먼저 체크하여 주세요."
        },
        MSG1512 : {
            title : "검색목록",
            message : "대장면적에 대해 검색을 할 수 없습니다."
        },
        MSG1513 : {
            title : "검색목록",
            message : "{0}건이 작업목록에 추가되었습니다.<br/>작업목록을 확인하시겠습니까?"
        },
        MSG1514 : {
            title : "검색목록",
            message : "{0}는 토지코드(LglCd)가 없어서 사용자주제도 목록에 넣을 수 없습니다."
        },
        MSG1701 : {
        	title : "공간검색",
        	message : "공간 검색은 {0}m<sup>2</sup> 내의 영역에서만 사용 가능합니다. <br/> {1}레벨로 이동하시겠습니까?"
        },
        MSG1702 : {
        	title : "다각형검색",
        	message : "다각형 검색은 {0}m<sup>2</sup> 내의 영역에서만 사용 가능합니다. <br/> 검색범위를 줄여 주십시오."
        },
        MSG1703 : {
        	title : "반경검색",
        	message : "반경 검색은 {0}m 내의 영역에서만 사용 가능합니다. <br/> 검색범위를 줄여 주십시오."
        },
        MSG1801 : {
        	title : "상세검색",
        	message : "검색 조건이 최소 하나 이상이어야 합니다."
        },
        MSG1802 : {
        	title : "상세검색",
        	message : "시/도를 선택하여 주십시오."
        },
        MSG1803 : {
        	title : "상세검색",
        	message : "시군구를 선택하여 주십시오."
        },
        MSG1804 : {
        	title : "상세검색",
        	message : "검색결과가 없습니다."
        },
        MSG1805 : {
        	title : "상세검색",
        	message : "읍면동를 선택하여 주십시오."
        },
        MSG1806 : {
        	title : "상세검색",
        	message : "취득년도는 YYYY형태로 입력하셔야 합니다. <br/> 예 : 1994."
        },
        MSG1807 : {
        	title : "다각형 검색",
        	message : "검색할 범위를 선택하여 주십시오."
        },
        MSG1808 : {
        	title : "반경 검색",
        	message : "검색할 범위를 선택하여 주십시오."
        },
        
		// 2000 - 사용자주제도 메세지
        MSG2001 : {
        	title : "사용자주제도",
        	message : "사용자주제도가 등록되었습니다."
        },
        MSG2002 : {
        	title : "사용자주제도",
        	message : "사용자주제도가 수정되었습니다."
        },
        MSG2003 : {
        	title : "사용자주제도",
        	message : "사용자주제도가 삭제되었습니다."
        },
        MSG2013 : {
        	title : "사용자주제도",
        	message : "사용자주제도를 삭제하시겠습니까?"
        },
        MSG2014 : {
        	title : "사용자주제도",
        	message : "사용자주제도 작성을 취소하시겠습니까?"
        },
        MSG2020 : {
        	title : "사용자주제도",
        	message : "사용자주제도 목록을 불러오는 데 실패하였습니다."        		
        },
        MSG2021 : {
        	title : "사용자주제도",
        	message : "사용자주제도 등록에 실패하였습니다."
        },
        MSG2022 : {
        	title : "사용자주제도",
        	message : "사용자주제도 수정에 실패하였습니다."
        },
        MSG2023 : {
        	title : "사용자주제도",
        	message : "사용자주제도 삭제에 실패하였습니다."
        },
        MSG2101 : {
        	title : "사용자주제도",
        	message : "이미지가 등록되었습니다.<br/>이미지를 표시할 위치를 선택하여 주십시오."
        },
        MSG2102 : {
        	title : "사용자주제도",
        	message : "KML 파일에 포함된 도형이 등록되었습니다.<br/>위치로 이동하시겠습니까?"
        },
        MSG2103 : {
        	title : "사용자주제도",
        	message : "KML 파일 등록이 실패했습니다."
        },
        MSG2201 : {
        	title : "사용자주제도",
        	message : "사진이 등록 되었습니다.<br/>사용자주제도 내용 - 사진에 등록한 사진이 표시됩니다."
        },
        MSG2202 : {
        	title : "사용자주제도",
        	message : "화면이 저장 되었습니다.<br/>사용자주제도 내용 - 사진에 등록한 화면이 표시됩니다."
        },
        MSG2301 : {
        	title : "사용자주제도",
        	message : "선택된 도형이 없습니다."
        },
        MSG2401 : {
        	title : "사용자주제도",
        	message : "도형 or 글상자를 하나 이상 입력하여 주십시오."
        },
        MSG2499 : {
        	title : "사용자주제도",
        	message : "사용자주제도 반영은 insert/update 만 가능합니다."
        },
        MSG2500 : {
        	title : "사용자주제도",
        	message : "선택한 이미지를 표시할 위치를 선택하여 주십시오."
        },
        MSG2502 : {
        	title : "사용자주제도-이미지서버",
        	message : "이미지 파일이 서버에 등록되었습니다."
        },
        MSG2503 : {
        	title : "사용자주제도-이미지서버",
        	message : "이미지를 서버에서 삭제하였습니다."
        },
        MSG2511 : {
        	title : "사용자주제도-이미지서버",
        	message : "이미지 파일을 불러오는데 실패했습니다."        		
        },
        MSG2512 : {
        	title : "사용자주제도-이미지서버",
        	message : "이미지를 서버에 등록하는데 실패했습니다."
        },
        MSG2513 : {
        	title : "사용자주제도-이미지서버",
        	message : "이미지를 서버에서 삭제하는데 실패했습니다."
        },
        MSG2901 : {
        	title : "사용자주제도",
        	message : "이미지 서버에서 선택한 이미지 파일을 삭제하시겠습니까?"
        },
		
		// 3000 - 추정공시지가
        MSG3001 : {
        	title : "추정 공시지가",
        	message : "읍면동까지 입력하세요"
        },
        MSG3002 : {
        	title : "추정 공시지가",
        	message : "주소 검색후 그리드를 선택하세요"
        },
        MSG3003 : {
        	title : "추정 공시지가",
        	message : "근접한 표준지가 없습니다. 다른방법으로 검색하세요"
        },
        MSG3004 : {
        	title : "추정 공시지가",
        	message : "일치하는 지목이 없거나 토지의 지목이 없습니다."
        },

		// 4000 - 매각
        MSG4001 : {
        	title : "",
        	message : "시도 콤보를 선택하세요"
        },
        MSG4002 : {
        	title : "",
        	message : "시군구 콤보를 선택하세요"
        },        
        MSG4003 : {
        	title : "",
        	message : "읍면동 콤보를 선택하세요"
        },           
		
		// 5000 - 비축토지
		
		// 6000 - 개발지
        MSG6001 : {
        	title : "청관사 개발밀도 분석",
        	message : "시도값을 입력하세요"
        },
        MSG6002 : {
        	title : "청관사 개발밀도 분석",
        	message : "시군구값을 입력하세요"
        },
        MSG6003 : {
        	title : "청관사 개발밀도 분석",
        	message : "용적률(최대)는 대지규모(최소)보다 작을 수 없습니다"
        },
        MSG6004 : {
        	title : "청관사 개발밀도 분석",
        	message : "사용연한(최대)는 사용연한(최소)보다 작을 수 없습니다"
        },
		
		// 7000 - 임대
        MSG7001 : {
            title : "임대",
            message : "읍면동까지 주소를 지정하여 주십시오."
        },
        MSG7002 : {
            title : "임대",
            message : "선택한 읍면동에 대해 대부 가능한 재산이 없습니다."
        },
        MSG7003 : {
            title : "임대",
            message : "선택한 읍면동에 대해 사용허가 가능한 재산이 없습니다."
        },
        MSG7004 : {
            title : "임대",
            message : "조건을 지정하여 주십시오."
        },
        
        
		// 8000 - 시스템관리
		
		// 9000 - 기타
                
        // 9100 - 업무 연계
        MSG9101 : {
            title : "",
            message : "검색된 결과가 없습니다. <br/> 전체 축척으로 이동합니다."
        },
        
        MSG9102 : {
        	title : "연계 테스트",
        	message : "{0}는 필수 파라미터 입니다.(연계 테스트용)"
        },
        
        MSG9999 : {
            title : "",
            message : "저장하시겠습니까?"
        }

        
        // 9500 - dBrain 연계
        
        
	},
	
	/**********************************************************************
	설명 : 메세지 반환
	파라메터 : arguments - 0 : 코드, 1...n : 출력값
	리턴값 :
	***********************************************************************/ 
	getMessage : function() {
		var args = arguments;
		var code = args[0];
		var title = this.codes[code].title?this.codes[code].title:null;
		var message = this.codes[code].message;
		for(var i=1, len=args.length; i < len; i++) {
			message = message.replace("{"+(i-1)+"}", args[i]);
		}
		return {
			title : title,
			message : message || ""
		};
	},
	
	/**********************************************************************
	설명 : 메세지 알림 창
	파라메터 : arguments - 0 : 코드, 1...n : 출력값
	리턴값 :
	***********************************************************************/
	getAlert : function() {
	    // 메시지 OK 버튼 한글화.
	    $.messager.defaults.ok = "확인";
		var code = this.getMessage.apply(this, arguments);
		$.messager.alert(code.title, code.message);
	},
	
	/**********************************************************************
	설명 : 메세지 확인 창
	파라메터 : arguments - 0 : 코드, 1...n : 출력값, callback - 마지막 매개변수
	리턴값 : 
	***********************************************************************/
	getConfirm : function() {
        // 메시지 OK 버튼 한글화.
        $.messager.defaults.ok = "예";
        $.messager.defaults.cancel = "아니요";
		var code = this.getMessage.apply(this, arguments);
		var callback = arguments[arguments.length-1];
		if(typeof callback === "function") {
			$.messager.confirm(code.title, code.message, callback);
		}
		else {
			message.getAlert("MSG0101", "CallBack 함수");
		}
	}
};

/*// 메세지 출력 샘플
$(function() {
	// jeasyui messager 사용시 역순으로 호출~~ 주의
	alert(message.getMessage("MSG0001", "사용자주제도").message);
	message.getAlert("MSG0001", "사용자주제도");
	message.getConfirm("MSG0001", "사용자주제도", function(isTrue) {
		if(isTrue) {
			alert("확인");	
		}
		else {
			alert("취소");
		}
	});
});*/




