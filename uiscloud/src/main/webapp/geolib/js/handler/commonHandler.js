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
		investment : {
			show : true,
			title : "투자비정보"
		},
		coverageMap : {
			show : true,
			title : "Coverage Map"
		},
		pgRouting : {
			show : true,
			title : "단일경로 검색"
		},
		kRouting : {
			show : true,
			title : "다중경로 검색"
		},
		aRouting : {
			show : true,
			title : "Mass Simulation"
		},
		sysmg : {
			show : true,
			title : "시스템관리"
		}
	},
	
	// 지도정보 탭
	layerTabs : {
		bies : {
			show : true,
			title : "지도정보"
		}
	},
	
	// 투자비정보 탭
	investmentTabs : {
		investment : {
			show : true,
			title : "검색"
		}
	},
	
	// Coverage Map 탭
	coverageMapTabs : {
		coverageMap : {
			show : true,
			title : "검색"
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
	설명 : 왼쪽 메뉴 아코디언 설정 (GIS 업무 코드 목록에 따라 아코디언 보이기/숨기기)
	파라메터 : dftGisCdList - GIS 업무 코드 목록
	리턴값 : 
	***********************************************************************/
	setUiByGisCdList : function(dftGisCdList) {
		var that = this;
		var gisCdList = dftGisCdList.split(",");
		
		// 확인해야될 Ui 숨기기
		that.layerTabs.user.show = false;
		that.eastTabs.user.show = false;
		that.accordion.search.show = false;
		that.accordion.dcs.show = false;
		
		// GIS 업무 코드 목록에 따라 UI 보이기
		for(var i in gisCdList) {
			// 세번째 코드를 반환  ex) 'G_MS' > 'M'
			var uiCode = gisCdList[i].replace("G_", "").substring(0,1);
			switch(uiCode) {
			// 사용자 주제도
			case "U": 
				that.eastTabs.user.show = true;
				that.layerTabs.user.show = true;
				break;
			case "M":
				that.accordion.search.show = true;
				break;
			// 의사결정
			case "P" :
			case "B" :
			case "R" :
			case "L" :
			case "D" :
				that.accordion.search.show = true;
				that.accordion.dcs.show = true;
				break;
			}
		}			
	},
	
	setFnMenu : function(dftGisCdList) {
		var gisCdList = dftGisCdList.split(",");
		
		// 확인해야될 Ui 숨기기 (의사결정)
		$(".btn_dcs").hide();
		
		for(var i in gisCdList) {
			var gisCd = gisCdList[i];
			
			switch(gisCd) {
			case "G_UP" : 
			case "G_UF" : 
			case "G_UI" :	
				break;
			case "G_MS" :
				break;
			case "G_S1" :
			case "G_S2" :
			case "G_S3" :
			case "G_S4" :
			case "G_S5" :
			case "G_S6" :
			case "G_S7" :
			case "G_S8" :
			case "G_S9" :
			case "G_S10" :
			case "G_S11" :
			case "G_S12" :
			case "G_S13" :
			case "G_S14" :
			case "G_S15" :
			case "G_S16" :
			case "G_S17" :
			case "G_S18" :
			case "G_S19" :
			case "G_S20" :	
				break;
			case "G_P1" :		// 공시지가 미산정지 조회
				$("#a_paamt_un_esti_value").show();
				break;
			case "G_P2" :		// 공시지가 추정		
				$("#a_paamt_un_esti_value").show();
				break;
			case "G_P3" :		// 토지 감정가격(공시지가) 추정
				$("#a_paamt_land_value").show();
				break;
			case "G_P4" :		// 건물 감정가격(공시지가) 추정
				$("#a_paamt_buld_value").show();
				break;
			case "G_B1" :		// 매각제한 재산 조회
				$("#a_dspl_psb").show();
				break;
			case "G_B2" :		// 매각가능 재산 조회
				$("#a_dspl_lm_value").show();
				break;
			case "G_B3" :		// 사전매각 승인 재산 분석
				$("#a_dspl_perms_value").show();
				break;
			case "G_B4" :		// 연접재산 소유자 조회
				$("#a_dspl_apchr").show();
				break;
			case "G_R1" :		// 대부 가능 재산 분석
				$("#a_rent_loan").show();
				break;
			case "G_R2" :		// 사용허가 가능 재산 분석
				$("#a_rent_pms").show();
				break;
			case "G_L1" :		// 비축가능 토지 분석
				$("#a_svemg_psb_land").show();
				break;
			case "G_L2" :		// 비축토지 현황 조회
				$("#a_svemg_land").show();
				break;
			case "G_L3" :		// 대규모 재산현황 조회
				$("#a_svemg_lrsc_land").show();
				break;
			case "G_D1" :	// 청관사 개발밀도 분석
				$("#a_dvpland_gbd").show();
				break;
			case "G_D2" :	// 유휴행정재산 분석
				$("#a_dvpland_ty").show();
				break;
			case "G_D3" :	// 기타 개발가능토지 분석
				$("#a_dvpland_etc").show();
				break;
			case "G_D4" :	// 개발대상지 조회
				$("#a_dvpland_dev_oj").show();
				break;
			case "G_D5" :	// 개발진행상황 조회
				$("#a_dvpland_dev_process").show();
				break;
			default : 
				break;
			};
		}
	},
	
	/**********************************************************************
	설명 : 관리자 여부에 따라서 시스템관리 아코디언 보이기/숨기기
	파라메터 : isAdmin 관리자 여부
	리턴값 : 
	***********************************************************************/
	setAdmin : function(isAdmin) {
		var that = this;
		that.accordion.sysmg.show = isAdmin;
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
		that.drawInvestmentTabs(); // 투자비정보 탭 UI
		that.drawCoverageMapTabs(); // Coverage Map 탭 UI
		that.drawPgRoutingTabs(); // 단일경로 검색 탭 UI
		that.drawKRoutingTabs(); // 다중경로 검색 탭 UI
		that.drawARoutingTabs(); // Mass Simulation 검색 탭 UI
		that.drawEastTabs();	// 우측 탭 UI
		map.updateSize();		// 지도 화면 크기 변경
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
		if(that.layerout.south && $("#div_layout").layout()) {
			//$("#div_layout").layout("collapse", "south");
		}
		// 우측 검색결과 닫기
		if(that.layerout.east && $("#div_layout").layout()) {
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
						userLayer.init();			// 사용자레이어 - /titan/js/mapsv/userLayer.js
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
	설명 : 투자비정보 탭 UI 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	drawInvestmentTabs : function() {
		var that = this;
		// 왼쪽메뉴 Show, 레이어 아코디언 Show 일때만 실행
		if(that.layerout.west && that.accordion.investment.show) {
			$("#div_investmentInfo_menu").tabs();
			// 투자비정보 탭 숨기기
			for(var tab in that.investmentTabs) {
				if(!that.investmentTabs[tab].show) {
					$("#div_investmentInfo_menu").tabs("close", that.investmentTabs[tab].title);
				}
			}
		}
	},
	
	/**********************************************************************
	설명 : Coverage Map 탭 UI 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	drawCoverageMapTabs : function() {
		var that = this;
		// 왼쪽메뉴 Show, 레이어 아코디언 Show 일때만 실행
		if(that.layerout.west && that.accordion.coverageMap.show) {
			$("#div_coverageMap_menu").tabs();
			// 투자비정보 탭 숨기기
			for(var tab in that.coverageMapTabs) {
				if(!that.coverageMapTabs[tab].show) {
					$("#div_coverageMap_menu").tabs("close", that.coverageMapTabs[tab].title);
				}
			}
		}
	},
	
	/**********************************************************************
	설명 : 단일경로 검색 탭 UI 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	drawPgRoutingTabs : function() {
		var that = this;
		// 왼쪽메뉴 Show, 레이어 아코디언 Show 일때만 실행
		if(that.layerout.west && that.accordion.pgRouting.show) {
			$("#div_pgRouting_menu").tabs();
			// 단일경로 탭 숨기기
			for(var tab in that.pgRoutingTabs) {
				if(!that.pgRoutingTabs[tab].show) {
					$("#div_pgRouting_menu").tabs("close", that.pgRoutingTabs[tab].title);
				}
			}
		}
	},
	
	/**********************************************************************
	설명 : 다중경로 검색 탭 UI 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	drawKRoutingTabs : function() {
		var that = this;
		// 왼쪽메뉴 Show, 레이어 아코디언 Show 일때만 실행
		if(that.layerout.west && that.accordion.kRouting.show) {
			$("#div_kRouting_menu").tabs();
			// 다중경로 탭 숨기기
			for(var tab in that.kRoutinggTabs) {
				if(!that.kRoutinggTabs[tab].show) {
					$("#div_kRouting_menu").tabs("close", that.kRoutinggTabs[tab].title);
				}
			}
		}
	},
	
	/**********************************************************************
	설명 : Mass Simulation 검색 탭 UI 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	drawARoutingTabs : function() {
		var that = this;
		// 왼쪽메뉴 Show, 레이어 아코디언 Show 일때만 실행
		if(that.layerout.west && that.accordion.aRouting.show) {
			$("#div_aRouting_menu").tabs();
			// Mass Simulation 탭 숨기기
			for(var tab in that.ARoutinggTabs) {
				if(!that.aRoutinggTabs[tab].show) {
					$("#div_aRouting_menu").tabs("close", that.aRoutinggTabs[tab].title);
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
	},
	
	/**********************************************************************
	설명 : GIS 업무 코드에 따라 초기 업무 화면 표시
	파라메터 : dftGisCd - GIS 업무 코드
	리턴값 : 
	***********************************************************************/
	selectFn : function(dftGisCd) {
		var that = this;
		switch(dftGisCd) {
		case "G_UP" : 
		case "G_UF" : 
		case "G_UI" :	
			$("#div_layer_tree").tabs("select", "사용자주제도");
			break;
		case "G_MS" :
			that.selectMSFn();
			break;
		case "G_S1" :
		case "G_S2" :
		case "G_S3" :
		case "G_S4" :
		case "G_S5" :
		case "G_S6" :
		case "G_S7" :
		case "G_S8" :
		case "G_S9" :
		case "G_S10" :
		case "G_S11" :
		case "G_S12" :
		case "G_S13" :
		case "G_S14" :
		case "G_S15" :
		case "G_S16" :
		case "G_S17" :
		case "G_S18" :
		case "G_S19" :
		case "G_S20" :	
			break;
		case "G_P1" :		// 공시지가 미산정지 조회
		case "G_P2" :		// 공시지가 추정		
			gfnMenuPammt();
			$("#a_paamt_un_esti_value img").trigger("click");
			break;
		case "G_P3" :		// 토지 감정가격(공시지가) 추정
			gfnMenuPammt();
			$("#a_paamt_un_esti_value img").trigger("click");
			break;
		case "G_P4" :		// 건물 감정가격(공시지가) 추정
			gfnMenuPammt();
			$("#a_paamt_un_esti_value img").trigger("click");
			break;
		case "G_B1" :		// 매각제한 재산 조회
			gfnMenuDspl();
			$("#a_dspl_psb img").trigger("click");
			//$("#dspl_type").hide();
			break;
		case "G_B2" :		// 매각가능 재산 조회
			gfnMenuDspl();
			$("#a_dspl_lm_value img").trigger("click");
			break;
		case "G_B3" :		// 사전매각 승인 재산 분석
			gfnMenuDspl();
			$("#a_dspl_perms_value img").trigger("click");
			break;
		case "G_B4" :		// 연접재산 소유자 조회
			gfnMenuDspl();
			$("#a_dspl_apchr img").trigger("click");
			that.selectB4Fn();
			break;
		case "G_R1" :		// 대부 가능 재산 분석
			gfnMenuRent();
			$("#a_rent_loan img").trigger("click");
			break;
		case "G_R2" :		// 사용허가 가능 재산 분석
			gfnMenuRent();
			$("#a_rent_pms img").trigger("click");
			break;
		case "G_L1" :		// 비축가능 토지 분석
			gfnMenuSave();
			$("#a_svemg_psb_land img").trigger("click");
			break;
		case "G_L2" :		// 비축토지 현황 조회
			gfnMenuSave();
			$("#a_svemg_land img").trigger("click");
			break;
		case "G_L3" :		// 대규모 재산현황 조회
			gfnMenuSave();
			$("#a_svemg_lrsc_land img").trigger("click");
			break;
		case "G_D1" :	// 청관사 개발밀도 분석
			gfnMenuDvpland();
			$("#a_dvpland_gbd img").trigger("click");
			break;
		case "G_D2" :	// 유휴행정재산 분석
			gfnMenuDvpland();
			$("#a_dvpland_ty img").trigger("click");
			break;
		case "G_D3" :	// 기타 개발가능토지 분석
			gfnMenuDvpland();
			$("#a_dvpland_etc img").trigger("click");
			break;
		case "G_D4" :	// 개발대상지 조회
			gfnMenuDvpland();
			$("#a_dvpland_dev_oj img").trigger("click");
			break;
		case "G_D5" :	// 개발진행상황 조회
			gfnMenuDvpland();
			$("#a_dvpland_dev_process img").trigger("click");
			break;
		default : 
			break;
		};
	},
	
	/**********************************************************************
	설명 : G_MS (검색조건) - 상세검색 창 표시 (소관에 따라 기능 분리)
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	selectMSFn : function() {
		// 상세검색 활성화
		$("#div_view").accordion("select", "검색");
		$("#a_ser_detail").trigger("click");
		
		// 소관코드 (총괄청이 아닐 경우)
		if(mainVo.offcCd && mainVo.offcCd != "0000") {
			$("#ser_detail_offc_select").parent().parent().hide();		// 소관 숨기기
			
			// 일선관서 코드
			if(mainVo.fgoCd) {
				$("#ser_detail_fgo_select").parent().parent().hide();		// 일선관서 숨기기
			}
		}
		
		// 재산구분
		if(mainVo.propDivCd) {
			$("#ser_detail_use_select").parent().parent().hide();		// 재산구분 숨기기
		}
		
		// 재산종류 구분 
		if(mainVo.propKndCd) {
			$(".span_detail_ser_type").hide();
			var propKndCd = mainVo.propKndCd;
			for(var i=0, len=propKndCd.length; i < len; i++) {
				var code = propKndCd.charAt(i);
				switch(code) {
				case "A" : 
					$("#span_detail_ser_cbnd").show();
					break;
				case "B" :
					$("#span_detail_ser_buld").show();
					break;
				case "C" : 
					$("#span_detail_ser_nbb").show();
					break;
				}
			}
			// 첫번째로 보이는 값에 체크
			$(".span_detail_ser_type").each(function() {
				if($(this).css("display") == "inline") {
					$(this).find("a img").trigger("click");
					return false;
				}
			});
		}
	},
	
	/**********************************************************************
	설명 : G_B4 (연접재산 소유자 조회) - 매각 > 연접재산 표시
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	selectB4Fn : function() {
		if(mainVo.astNo) {
			dsplApchrLandPropAlyInfo.searchByNpms();
		}
		else {
			message.getAlert("MSG9102", "자산번호");
		}
	},
	
	/**********************************************************************
	설명 : 통합시스템에서 선택한 자산번호로 이동 
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	moveAssetsNos : function() {
		// 통합시스템에서 넘겨준 LglCd 리스트 추출
		var assetsNos = mainVo.astNo.split("|");
		if(assetsNos.length > 0) {
			// 공간 & 속성 검색 호출
			gfnGetFeatureByEquals("VW_CBND_ASSEST_LAND", "ASSETS_NO", assetsNos, true, true, true, function(response) {
				if(!response || !response.features || response.features.length == 0) {
					message.getAlert("MSG9101");
					gfnMoveMaxExtent();
				}
			});
		}
		else {
			message.getAlert("MSG9101");
			gfnMoveMaxExtent();
		}
	},
	
	/**********************************************************************
	설명 : 통합시스템에서 선택한 LglCd로 검색 및 이동
	파라메터 : 
	리턴값 : 
	***********************************************************************/
	moveLglCds : function() {
		var that = this;
		
		// 통합시스템에서 넘겨준 LglCd 리스트 추출
		var lglCds = mainVo.lglCd.split("|");
		if(lglCds.length > 0) {
			// 공간 & 속성 검색 호출
			gfnGetFeatureByEquals("Z_KLIS_LP_PA_CBND", "LglCd", lglCds, true, true, true, function(response) {
				if(!response || !response.features || response.features.length == 0) {
					message.getAlert("MSG9101");
					gfnMoveMaxExtent();
				}
				else {
					that.showAddrPopups(response.features);
				}
			});
		}
		else {
			message.getAlert("MSG9101");
			gfnMoveMaxExtent();
		}
	},
	
	/**********************************************************************
	설명 : 주소 팝업 목록 추가
	파라메터 : 도형정보 목록
	리턴값 : 
	***********************************************************************/
	showAddrPopups : function(features) {
		var that = this;
		if(mainVo && mainVo.isAddr && mainVo.isAddr == "1") {
			for(var i=0, len=features.length; i < len; i++) {
				var feature = features[i];
				that.addAddrPopups(feature);
			}
		}
	},
	
	/**********************************************************************
	설명 : 주소 팝업 추가
	파라메터 : 도형정보
	리턴값 : 
	***********************************************************************/
	addAddrPopups : function(feature) {
		var lglCd = feature.data["LglCd"];
		
		$.get(
			"/titan/info/lglCdToAddr",
			"lglCdNo="+lglCd,
			function(response) {
				var contentHtmlTag = '<div class="divDrawShowBox">' + response.data + '</div>';
				// 6640 좌표로 변환 후 센터 좌표를 구한 다음 다시 900913으로 변환 - 이렇게 하지 않을 경우 다른 위치가 센터점으로 나오는 현상이 있음
				var center = feature.geometry.clone().transform(EPSG900913, SRORG6640).getCentroid().transform(SRORG6640, EPSG900913);
				var lonlat = new OpenLayers.LonLat(center.x, center.y);
				var popup = new OpenLayers.Popup(lglCd, lonlat, null, contentHtmlTag, true, function() {
					var popups = map.popups;
					for(var i=popups.length-1; i >= 0; i--) {
						if(popups[i].type == "addr" && popups[i].id == lglCd) {
							map.removePopup(popups[i]);
						}
					}
				});
				popup.type = "addr";
				popup.attributes = {
					contentHtml : response.data,
					lon : lonlat.lon,
					lat : lonlat.lat,
					featureType : "textbox",
					fontColor : "#000000",
					fontSize : "12px",
					fontFamily : "Dotum",
					print : true
				};
				popup.autoSize = true;
				map.addPopup(popup);
			},
			"json"
		);
	}
		
};