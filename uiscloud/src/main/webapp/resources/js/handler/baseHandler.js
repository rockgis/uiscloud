/**
파일명 : moveFeatureHandler.js
설명 : 통합시스템에서 호출 (1차 대비 - 공간객체 검색 및 이동)
 
 수정일       수정자   수정내용
 ----------   -------  --------------------------------------------------
 2013-12-02 최원석	최초생성
*/
var baseHandler = {
		
	/**********************************************************************
	설명 : 시스템 핸들러 초기화
	파라메터 : 
	리턴값 : 
	***********************************************************************/	
	init : function() {
		this.initUi();
		this.initFn();
		//this.moveMap();
	},
	
	/**********************************************************************
	설명 : 화면 초기 설정
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	initUi : function() {
		commonHandler.drawUi();	// UI 호출
		$("#div_bottom_tab").tabs({
			closable:true,
			// 도로명 검색과 건물명칭 검색은 그리드가 특수함으로 재검색 및 사용자목록 추가를 하지 않도록 한다.
			onSelect : function (title,index) {
			    if (title.indexOf("도로명주소 검색") >= 0 || title.indexOf("건물명칭 검색") >= 0) { 
			        $("#a_serGridToolbarAddUserGrid").css("visibility", "hidden");
			        $("#a_serGridToolbarExcel").css("visibility", "hidden");
			        $("#a_serGridToolbarKML").css("visibility", "hidden");
			        $("#span_reSer").css("visibility", "hidden");
			    } else {
			        $("#a_serGridToolbarAddUserGrid").css("visibility", "visible");
	                $("#a_serGridToolbarExcel").css("visibility", "visible");
	                $("#a_serGridToolbarKML").css("visibility", "visible");
	                $("#span_reSer").css("visibility", "visible");
			    }
			}
		});
		commonGridWidth = $("body")[0].clientWidth - 10;
		
		// 하단 그리드 수정시 영역 변경
		$("#div_south").panel({onResize: function(width, height) {
		    if (height > 10) {
		        var gridHeight = height - 70;
		        if (commonGridHeight != gridHeight) {
	                commonGridHeight = gridHeight;
	                setTimeout(gfnGridResize, 300);
		        }
		    }
		}});
		//Tab 일괄 닫기
	    $("#a_serGridToolbarTabsCloseAll").click(function(){
	        var len = $("#div_bottom_tab").tabs("tabs").length;
	    	
	        for(var i=len-1; i >=0; i--){
	    		$("#div_bottom_tab").tabs("close",i);
	    	}
	        
	        gridIdex = 0;
	        datagrid.index = gridIdex;
	    });
	},
	
	/**********************************************************************
	설명 : 시스템 초기 이벤트 설정
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	initFn : function() {
	},
	
	moveMap : function() {
		gfnMoveMaxExtent();	// 전체 축척으로 이동 - map.js
	}
};
