/**
파일명 : commonHandler.js
설명 : GIS 화면 공통 UI 설정
 
 수정일       수정자   수정내용
 ----------   -------  --------------------------------------------------
 2013-12-04 최원석	최초생성
*/
var commonHandler = {
		
	// 화면 레이아웃
	layerout : {
		north : true,
		south : true,
		east : true,
		west : true
	},
	
	// 왼쪽 메뉴 Accordion 
	accordion : {
		baseMap : {
			show : true,
			title : "배경 지도"
		},
		layer : {
			show : true,
			title : "지도정보"
		},
		pgRouting : {
			show : true,
			title : "단일경로 검색"
		}
	},
	
	// 지도정보 탭
	layerTabs : {
		bies : {
			show : true,
			title : "지도정보"
		}
	},
	
	// 우측 탭
	eastTabs : {
		legend : {
			show : true,
			title : "범례"
		},
		detail : {
			show : true,
			title : "상세속성"
		}
	},

	/**********************************************************************
	설명 : 전체 레이아웃 설정
	파라메터 : resion - 위치 (north, south, east, west)
				 isShow - 표시 여부
	리턴값 : 
	***********************************************************************/
	setLayerout : function(region, isShow) {
		var that = this;
		that.layerout[region] = isShow;
	},
	
	
	
	/**********************************************************************
	설명 : 지도 정보 탭 표시 여부
	파라메터 : name - 탭 이름 (레이어 정보, 검색)
				 isShow - 표시 여부
	리턴값 : 
	***********************************************************************/
	setLayerTabs : function(name, isShow) {
		var that = this;
		that.layerTabs[name].show = isShow;
	},
	
	/**********************************************************************
	설명 : 투자비 정보 탭 표시 여부
	파라메터 : name - 탭 이름 (검색)
				 isShow - 표시 여부
	리턴값 : 
	***********************************************************************/
	setInvestmentTabs : function(name, isShow) {
		var that = this;
		that.investmentTabs[name].show = isShow;
	},

	/**********************************************************************
	설명 : 화면 UI 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	drawUi : function() {
		var that = this;
		that.drawLayout();		// 화면 전체 UI
		that.drawAccordion();	// 왼쪽 메뉴 아코디언 UI
		that.drawLayerTabs();	// 지도정보 탭 UI
		//map.updateSize();		// 지도 화면 크기 변경
	},

	/**********************************************************************
	설명 : 전체 화면 Layout 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	drawLayout : function() {
		var that = this;
		// Layerout 보이기/숨기기
		for(var region in that.layerout) {
			if(that.layerout[region]) {
				$("#div_"+region).show();
			}
			else {
				$("#div_layout").layout("remove", region);
			}
		}
		// 하단 검색결과 닫기
		if(that.layerout.south) {
			$("#div_layout").layout("collapse", "south");
		}
		// 우측 검색결과 닫기
		if(that.layerout.east) {
			$("#div_layout").layout("collapse", "east");
		}
		
		// 주제도 참고문구 보이기
		$("#div_sttu").show();
	},
	
	/**********************************************************************
	설명 : 왼쪽 메뉴 아코디언 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	drawAccordion : function() {
		var that = this;
		// accordion 생성
		$("#div_view").accordion({
			fit: true,
			onSelect : function() {
				$(".accordion-body").css("overflow", "auto");
			}
		});
		
		// accordion 숨기기
		for(var menu in that.accordion) {
			if(!that.accordion[menu].show) {
				$("#div_view").accordion("remove", that.accordion[menu].title);
			}
		}
	},
	
	/**********************************************************************
	설명 : 지도정보 탭 UI 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	drawLayerTabs : function() {
		var that = this;
		// 왼쪽메뉴 Show, 레이어 아코디언 Show 일때만 실행
		if(that.layerout.west && that.accordion.layer.show) {
			$("#div_mapInfo_menu").tabs({
				// 사용자 주제도 선택 시 사용자 주제도 불러오도록 수정
				onSelect : function(title, index) {
					if(title == "사용자주제도") {
						userLayer.init();			// 사용자레이어 - /bies/js/mapsv/userLayer.js
					}
				}
			});
			// 지도정보 탭 숨기기
			for(var tab in that.layerTabs) {
				if(!that.layerTabs[tab].show) {
					$("#div_mapInfo_menu").tabs("close", that.layerTabs[tab].title);
				}
			}
		}
	},
	
	
	/**********************************************************************
	설명 : 오른쪽 탭 UI 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	drawEastTabs : function() {
		var that = this;
		if(that.layerout.east) {
			$("#div_detail_view").tabs();
			$("#div_detail_view").tabs("disableTab", "상세속성");

			for(var tab in that.eastTabs) {
				if(!that.eastTabs[tab].show) {
					$("#div_detail_view").tabs("close", that.eastTabs[tab].title);
				}
			}
		}
	}
		
};