/**
파일명 : gisMain.js
설명 : 지도 기능 / 버튼(토글)
 
 수정일       수정자   수정내용
 ----------   -------  --------------------------------------------------
 2014.01.22 김종민	최초생성 
*/

var	testMode = false;

/**********************************************************************
설명 :화면이 생성 되고 처음 실행되는 함수
파라메터 :
리턴값 :
***********************************************************************/
$(document).ready(function() {	
	window.top.focus();
	
	gfnLoadingBar();			// 로딩바 - /resources/js/com/util.js
	gfnDeactiveRightClick();	// 마우스 우클릭 막기 - /resources/js/com/util.js
	
	gfnInitLayout();			// 공통화면 레이아웃
	gfnInitMainMap();			// 메인지도 초기화 - /resources/js/map/mainMap.js

	//layerTree.init();			// 레이어 트리 - /resources/js/mapInfo/layerTree.js - 레이어 ON/OFF 이벤트 연결	
	
	gfnMenuEvent();				// 상단 메뉴 이벤트 - /resources/js/gisMain.js
	
	baseHandler.init();
	
	//변전소 검색 Tree
	$("#browser").treeview({
		persist: "location",
		collapsed: true,
		unique: true
	});

	// 메인 로고 클릭
	$("#imgLogo").click(function() {
		window.location.reload();
	});
	
	// 동쪽 패널 변경 시 이벤트
	$('#div_east').panel({
        onResize: function(width, height){
        	$("#div_detail_view .panel-body").css("width", "auto");
        	$("#table_info").propertygrid("resize");
        }
    });
});

/**********************************************************************
설명 : 상단 메뉴 이벤트 연결
파라메터 :
리턴값 :
***********************************************************************/
function gfnMenuEvent() {	
	// 지도정보
	$("#a_menu_mapInfo").click(function(){
		$("#div_view").accordion('select','지도정보');
		return false;
	});	
	
	// 단일경로 검색 - pgRouting
	$("#a_menu_pgRouting").click(function(){
		$("#div_view").accordion('select','단일경로 검색');		
		return false;
	});	
	
}

/**********************************************************************
설명 : 상단 메뉴 클릭시 UI 설정
파라메터 : element - 화면에 나타낼 Dom Element 
리턴값 :
***********************************************************************/
function gfnMenuChangeUi(element) {
	if($("#div_west").css("display") == "none") {	$("#div_layout").layout("expand", "west");  }	// 왼쪽 메뉴 보임
	$(element).show();
}


/**********************************************************************
설명 :초기 화면 레이아웃 및 스타일 지정
파라메터 :
리턴값 :
***********************************************************************/
function gfnInitLayout() {
	// 상단 시스템 메뉴- 기본 / 마우스오버 / 클릭 상태 이미지 변경
	$("#ul_menu li a img.toggle").mouseover(function() {
		if($(this).attr("src").indexOf("_n.") > 0) {
			$(this).attr("src", $(this).attr("src").replace("_n.", "_h."));
		}
	})
	.mouseout(function() {
		if($(this).attr("src").indexOf("_h.") > 0) {
			$(this).attr("src", $(this).attr("src").replace("_h.", "_n."));	
		}
	});	
	
	// 지도 툴바 이미지 토클 - 기본 / 마우스오버 / 클릭 상태 이미지 변경
	$("#ul_map_tool li img").mouseover(function() {
		if($(this).attr("src").indexOf("_n.") > 0) {
			$(this).attr("src", $(this).attr("src").replace("_n.", "_h."));
		}
	})
	.mouseout(function() {
		if($(this).attr("src").indexOf("_h.") > 0) {
			$(this).attr("src", $(this).attr("src").replace("_h.", "_n."));	
		}
	});
	
	// 지도 툴바 선택 시 이미지 변경
	$("#ul_map_tool li img.toggle").click(function() {	
		$("#ul_map_tool li img").each(function() {
			$(this).attr("src", $(this).attr("src").replace("_a.", "_n.").replace("_h.", "_n."));	
		});
		
		$(this).attr("src", $(this).attr("src").replace("_n.", "_a."));
	});
	
	// 버튼 이미지 토글
	$(".searchForm li a img").mouseover(function() {
		if($(this).attr("src").indexOf("_n.") > 0) {
			$(this).attr("src", $(this).attr("src").replace("_n.", "_h."));
		}
	})
	.mouseout(function() {
		if($(this).attr("src").indexOf("_h.") > 0) {
			$(this).attr("src", $(this).attr("src").replace("_h.", "_n."));	
		}
	});
	
	
	// 지도 툴바, 축척바에 레벨표시바 표시 
	$("#ul_map_tool").show();
	$("#tooltip").show();
	// 로딩바 숨김
	$("#loadingBar").hide();
	
	// 화면 크기 변경 이벤트
	$(window).bind('resize', gfnResizeLayout);
	$("#div_center").panel({
		onResize : function() {
			if(map) {
				map.updateSize();	
			}
		}
	});
}

function gfnResizeLayout() {
	// jeasyui layout 크기 변경
	$("#div_layout").layout("resize");
	// 지도 화면 크기 변경
	if(map) {
		map.updateSize();	
	}
	
	// 아래 그리드들도 가로 거리를 변경한다.
    var w = $("body")[0].clientWidth - 10;
    if (commonGridWidth != w) {
        commonGridWidth = w;
        setTimeout(gfnGridResize, 300);
    }
}

/**
 * 그리드 크기들을 다 변경.
 * commonGridWidth, commonGridHeight 값은 외부에서 정의되어 이 함수를 호출한다.
 */
function gfnGridResize() { 
    if ($("#div_bottom_tab").length == 0) // 경우에 따라 없는 경우도 있다.
        return;
    
    var tabs = $("#div_bottom_tab").tabs("tabs");
    for (var i=0; i<tabs.length; i++) {
        var grid = tabs[i].panel('options').content;
        var id = $(grid).attr('id');
        $("#"+id).datagrid("resize", {width:commonGridWidth, height:commonGridHeight});
    }
    $("#userGrid").datagrid("resize", {width:commonGridWidth, height:commonGridHeight});
}