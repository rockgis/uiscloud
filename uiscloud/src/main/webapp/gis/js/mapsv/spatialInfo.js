/**
파일명 : spatialInfo.js
설명 : 지적위치 조절
*/
var spatialInfo = {
		
	// 지도 객체
	map : null,
		
	// 레이어 객체
	layer : null,
	
	// 거리 (m)
	dist : 1,
	
	// 다각형 검색 적정 레벨
	zoom : 9,
	
	// 다각형 검색 최대 거리 
	// limitDist : 100,
	
	// 다각형 검색 최대 면적(십만 제곱 미터) 
	limitArea : 100000,
	
	// 정보보기 타이블 
	title : "정보보기-",
	ringFeatures : [],
	// ETE_LINK 컬럼 정보 목록
	eteLinkColumns : [[
	    {field:"upStaMgno",title:"상위국관리번호", width:100, halign:"center", align:"left", sortable: true},
	    {field:"upStaName",title:"상위국이름", width:100, halign:"center", align:"left", sortable: true},
	    {field:"upStaRack",title:"상위국랙", width:100, halign:"center", align:"left", sortable: true},
	    {field:"upStaShelf",title:"상위국쉘프", width:100, halign:"center", align:"left", sortable: true},
	    {field:"upStaPort",title:"상위국포트", width:100, halign:"center", align:"left", sortable: true},
	    {field:"toTp",title:"하위국관리번호", width:100, halign:"center", align:"left", sortable: true},
	    {field:"toTpName",title:"하위국이름", width:100, halign:"center", align:"left", sortable: true},
	    {field:"dnStaRack",title:"하위국랙", width:100, halign:"center", align:"left", sortable: true},
	    {field:"dnStaShelf",title:"하위국쉘프", width:100, halign:"center", align:"left", sortable: true},
	    {field:"dnStaPort",title:"하위국포트", width:100, halign:"center", align:"left", sortable: true},
	    {field:"maxSeq",title:"피스수", width:100, halign:"center", align:"left", sortable: true},
	    {field:"useYn",title:"사용유무", width:100, halign:"center", align:"left", sortable: true}
	]],
		
	/**********************************************************************
	설명 : 초기화
	파라메터 : map - 지도 객체
	리턴값 :
	***********************************************************************/ 
	init : function(map) {
		var that  = this;
		that.map = map;
		
		that.initUi();
		that.initGis();
		
	},
	
	/**********************************************************************
	설명 : UI 초기화 (jeasyui - propertygrid 생성)
	파라메터 :
	리턴값 :
	***********************************************************************/ 
	initUi : function() {
		$("#table_info").propertygrid({
			scrolbarSize : 0,
			fitColumns : true,
			nowrap : false,
			showGroup : true,
			showHeader : true,
			columns:[[{field:'name',title:'항목명', width: 10},{field:'value',title:'값', width: 20}]],
			onSelect : function(rowIndex, rowData) {
				// 선택 해제
				// ("#table_info").propertygrid("unselectRow", rowIndex); 
			}
		});
	},
	
	/**********************************************************************
	설명 : GIS 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 
	initGis : function() {
		var that = this;
		that.layer = new OpenLayers.Layer.Vector("spatial_layer");
		that.map.addLayer(that.layer);
		
		var infoControl = new OpenLayers.Control.DrawFeature(that.layer, OpenLayers.Handler.Point, { id : "spatialInfo" });
		that.map.addControl(infoControl);
		
		var polygonControl = new OpenLayers.Control.DrawFeature(that.layer, BiesPolygonMeasure, { 
			id : "spatialPoly",
			handlerOptions: {
        		multiLine : false,
        		movePopup : true,
        		layerName : "spatial_layer",
        		persistControl : true
    		}
		});
		that.map.addControl(polygonControl);	
		
		that.layer.events.on({
			"beforefeaturesadded" : function() {
				$("#btn_pan img").trigger("click");
				that.layer.removeAllFeatures();
			},
			"featureadded" : function(evt) {
				that.selectByDWithin(evt.feature);
			}
		});		
	},
	
	/**********************************************************************
	설명 : 선택한 지점을 중심으로 반경 검색
	파라메터 : feature 	- 선택한 도형
			distance 	- 거리
	리턴값 :
	***********************************************************************/
	selectByDWithin : function(feature, callback) {
		var that = this;
		
		var limitArea = that.limitArea;
		
		/*
		
		// 2015.08.03 --> 지도레벨별 선택된 레이어 선택항목만 조회 기능으로 인해 주석처리
		if(feature.geometry.getArea() > limitArea) {
			message.getAlert("MSG1702", gfnFormatNumber(limitArea));
			that.layer.removeAllFeatures();
			return false;
		}
*/
	   var selLayers = [];
		   
	   var nodes = $(ul_layer_tree).tree('getChecked');
//	   check 된 트리 노드를 순회하면서 json 에 layerName 들 push
	   $(nodes).each(function() {
		   if (this.attributes && this.attributes.layerName) {
			   selLayers.push(this.attributes.symbolizer).toString();
//			   jsonLayerNames.push(this.attributes.layerName);
//			   jsonLayerTreePk.push(this.attributes.layerTreePk);
//			   jsonKorNames.push(this.text);
		   }
		});

	   var params = {};
		if(feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
			var centeroid = feature.geometry.getCentroid();
			params = {
				lon : centeroid.x,
				lat : centeroid.y,
				dist : that.dist	
			}
		}
		else {
			params = {
				'mapLevel' : map.getZoom(),
				'selLayers' : JSON.stringify(selLayers),
				'polyGeom' : feature.geometry.toString()
			}
		}

//		jQuery.ajaxSettings.traditional = true;


		$.get(
			"/gis/mapsv/selectSpatialInfo",
			params,
			function(res) {
				if(res && res.data) {
					var isExist = false;
					for(var i in res.data) {
						var tableObj = res.data[i];
						// 검색 결과가 있는 시설물만 확인
						if(tableObj.datas.length > 0) {
							var datas = {
								total : tableObj.datas.length,
								rows : tableObj.datas
							};
							var title = that.title + tableObj.korName;
							var gridId = "";
							if(i.toUpperCase() == "GNET_RING_MAP") {
								gridId = datagrid.showResult(title, i, datas, ring.gridColumns, false, function(rowIndex, rowData, tableName) {
					    			gfnGetFeatureByEquals(prefix+tableName.toLowerCase(), "net_no", [rowData.netNo],  false, false, false, function(response) {
					    				var layer = gfnGetLayer("searchLayer");
					    				layer.removeAllFeatures();
					    				var features = [];
					    				for(var i in response.features) {
					    					var attrs = response.features[i].attributes;
					    					var netNo = parseInt(attrs["net_no"]);
					    					var sysClf = attrs["sys_clf"];
					    					var ungrLoc = attrs["ungr_loc"];
					    					attrs.strokeWidth = 6;
					    					if(sysClf == "SK") {
					    						attrs.strokeColor = "#ffff00";
					    					}
					    					else {
					    						attrs.strokeColor = "#abf200";
					    					}
					    					if(ungrLoc == "D") {
					    						attrs.strokeDashstyle = "dot";
					    					}
					    					features.push(response.features[i].clone());
					    				}
					    				layer.addFeatures(features);
					    				that.ringFeatures.push(features);
					    				
					    				map.zoomToExtent(layer.getDataExtent());
					    			});
					    		});
								if(tabObj[gridId]){
									tabObj[gridId].push(that.ringFeatures[0]);
								}
								else{
									tabObj[gridId] = that.ringFeatures[0];
								}
							}
							else if(i.toUpperCase() == "ETE_LINK") {
								datagrid.showResult(title, i, datas, that.eteLinkColumns, false, function(rowIndex, rowData) {
									var eteFields = [];
									var eleValues = [];
									//debugger;
									if(rowData["upStaMgno"]) {
										eteFields.push("up_sta_mgno");
										eleValues.push(rowData["upStaMgno"]);	
									}
									if(rowData["upStaRack"]) {
										eteFields.push("up_sta_rack");
										eleValues.push(rowData["upStaRack"]);
									}
									if(rowData["upStaShelf"]) {
										eleValues.push(rowData["upStaShelf"]);
										eteFields.push("up_sta_shelf");
									}
									if(rowData["upStaPort"]) {
										eleValues.push(rowData["upStaPort"]);
										eteFields.push("up_sta_port");
									}
									if(rowData["toTp"]) {
										eleValues.push(rowData["toTp"]);
										eteFields.push("to_tp");
									}
									if(rowData["dnStaRack"]) {
										eleValues.push(rowData["dnStaRack"]);
										eteFields.push("dn_sta_rack");
									}
									if(rowData["dnStaShelf"]) {
										eleValues.push(rowData["dnStaShelf"]);
										eteFields.push("dn_sta_shelf");
									}
									if(rowData["dnStaPort"]) {
										eleValues.push(rowData["dnStaPort"]);
										eteFields.push("dn_sta_port");
									}
									if(rowData["useYn"]) {
										eleValues.push(rowData["useYn"]);
										eteFields.push("use_yn");
									}
									eteFields.push("gis_code");
									eleValues.push("ETE02");
									
									gfnGetFeatureByComparison(prefix+"ete_link", OpenLayers.Filter.Comparison.EQUAL_TO, eteFields, eleValues,  true, true, true, function(res) {
										var eteFeatures = res.features;
										var tableArrs = [{
											tableName : "ETE_LINK",
											gids : []
										}];
										for(var eteIdx in eteFeatures) {
											tableArrs[0].gids.push(eteFeatures[eteIdx].fid.replace("ete_link.", ""));
										}
										spatialInfo.selectDetailInfo(tableArrs);
									}, OpenLayers.Filter.Logical.AND);
								});
							}
							else {
								// 동적 스타일 적용
								//dynamicSld.showResult(i, datas);
								datagrid.showResult(title, i, datas, null, false, callback);
							}
							isExist = true;
						}
						
					}
					
					if(!isExist) {
						$.messager.alert("알림", "검색결과가 없습니다.");
					}
				}
				else {
					$.messager.alert("알림", "속성검색에 실패했습니다.", "OK")
				}
			},
			"json"
		);
		
	},
	
	/**********************************************************************
	설명 : 선택한 시설물 상세 검색
	파라메터 : tableName 	- 테이블명
			gid 		- 일련번호 (PK값)
	리턴값 :
	***********************************************************************/
	selectDetailInfo : function(tableArrs) {
//		debugger;
		$.get(
			"/gis/mapsv/selectSpatialDetailInfo",
			{ params : JSON.stringify(tableArrs) },
			function(res) {
				if(res && res.data && res.data.length > 0) {
					var tableInfo = {};
					for(var i=0, len=res.tableInfo.length; i < len; i++) {
						tableInfo[res.tableInfo[i].tableName] = res.tableInfo[i].korName;
					}
					
					var rows = [];
					for(var i=0, len=res.data.length; i < len; i++) {
						var columns = res.data[i].columns;
						var datas = res.data[i].datas;
						for(var j=0, jLen = datas.length; j < jLen; j++) {
//							for(var k in columns) {
							for(var k=0; k < columns.length; k++) {
								var obj = {};
								obj.name = columns[k].title;
								// 숫자형
								if(columns[k].type == 2) {
									obj.value = gfnFormatNumber(datas[j][columns[k].alias]);
								}
								else {
									obj.value = datas[j][columns[k].alias];
								}
								obj.group = tableInfo[res.data[i].tableName] + "[" + datas[j]["gid"] + "]";
								rows.push(obj);
							}
						}
					}
					var data = {
						total : rows.length,
						rows : rows
					};
					if($("#div_east").css("display") == "none") 
			    		$('#div_layout').layout('expand', 'east');
					$("#table_info").propertygrid("loadData", data);
				}
				else {
					console.log("1","데이터 없음");
					$.messager.alert("상세속성", "상세속성 검색에 실패했습니다.")
				}
			},
			"json"
		);
	}
		
}