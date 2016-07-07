/**
파일명 : map.js
설명 : 지도 공통 함수 
 
 수정일       수정자   수정내용
 ----------   -------  --------------------------------------------------
 2013.09.27 최원석	최초생성
*/

/**********************************************************************
설명 :지도 객체 생성 및 반환
파라메터 :
리턴값 : mapObj - 지도 객체
***********************************************************************/
function gfnInitMap(div) {
	 
	// 지도 객체 생성 및 초기 설정
	var mapObj = new OpenLayers.Map(div, {
		allOverlays : true,
		displayProjection : new OpenLayers.Projection("EPSG:5181"),
		projection : new OpenLayers.Projection("EPSG:5181"),
		//resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
		maxResolution : 2048,
		maxExtent :  new OpenLayers.Bounds(196510.078125, 450462.65625,199296.203125, 452437.34375), // new OpenLayers.Bounds(-30000, -60000, 494288, 988576),
		numZoomLevels : 18,
		unit : "m",
		controls : [],
		moveByPx: function(dx, dy) {
	        var hw = this.size.w / 2;
	        var hh = this.size.h / 2;
	        var x = hw + dx;
	        var y = hh + dy;
	        var wrapDateLine = this.baseLayer.wrapDateLine;
	        var xRestriction = 0;
	        var yRestriction = 0;
	        if (this.restrictedExtent) {
	            xRestriction = hw;
	            yRestriction = hh;
	            // wrapping the date line makes no sense for restricted extents
	            wrapDateLine = false;
	        }
	        dx = Math.round(dx);
	        dy = Math.round(dy);
	        if (dx || dy) {
	            if (!this.dragging) {
	                this.dragging = true;
	                this.events.triggerEvent("movestart");
	            }
	            this.center = null;
	            if (dx) {
	                this.layerContainerDiv.style.left =
	                    parseInt(this.layerContainerDiv.style.left) - dx + "px";
	                this.minPx.x -= dx;
	                this.maxPx.x -= dx;
	            }
	            if (dy) {
	                this.layerContainerDiv.style.top =
	                    parseInt(this.layerContainerDiv.style.top) - dy + "px";
	                this.minPx.y -= dy;
	                this.maxPx.y -= dy;
	            }
	            var layer, i, len;
	            for (i=0, len=this.layers.length; i<len; ++i) {
	                layer = this.layers[i];
	                if (layer.visibility &&
	                    (layer === this.baseLayer || layer.inRange)) {
	                    layer.moveByPx(dx, dy);
	                    layer.events.triggerEvent("move");
	                }
	            }
	            this.events.triggerEvent("move");
	        }
	    },
		isValidLonLat: function(lonlat) {
			if(lonlat!=null) return true;
			else return false;
	    }
	});
	
	// 7 축척 이하는 서비스 안함 
	mapObj.events.register("zoomend", this, function() {
		if(mapObj.getZoom() < 1) {
			gfnMoveMaxExtent(mapObj);
			$.messager.alert("알림", "지도를 더 이상 축소 하실 수 없습니다.");
		}
	});
	
	return mapObj;
}

/**********************************************************************
설명 : 지도 기능 전환
파라메터 : controls - 활성할 컨트롤 목록
			 mapObj - 지도 객체 (null 일 경우 메인 지도 객체 사용)
리턴값 :
***********************************************************************/
function gfnActiveControl(controls, mapObj) {
	
	if(mapObj == null) {
		mapObj = map;
	}
	
	for(var i in mapObj.controls) {
		if(mapObj.controls[i].type != OpenLayers.Control.TYPE_TOGGLE && mapObj.controls[i].active) {
			mapObj.controls[i].deactivate();	
		}
	}
	
	if(typeof controls === "object") {
		if(controls.length && controls.length > 0) {
			for(var i = 0; i < controls.length; i++) {
				mapObj.getControl(controls[i]).activate();
			}
		}
	}
	else {
		mapObj.getControl(controls).activate();
	}
}

/**********************************************************************
설명 : 배경 맵  레이어 추가
파라메터 : mapObj - 레이어를 등록할 Map 객체
리턴값 :
***********************************************************************/
function gfnAppendBaseLayer(mapObj) {
	gfnAppendDaumStreetLayer(mapObj);
	gfnAppendDaumSatelliteLayer(mapObj);
	gfnAppendDaumHybridLayer(mapObj);
}

/**********************************************************************
설명 : 다음 DaumHybrid 레이어 추가
파라메터 : mapObj - 레이어를 등록할 Map 객체
리턴값 :
***********************************************************************/
function gfnAppendDaumHybridLayer(mapObj) {
	
	var layer  = new OpenLayers.Layer.DaumHybrid();	
	layer.setVisibility(false);
	mapObj.addLayer(layer);
}

/**********************************************************************
설명 : DaumSatellite 레이어 추가
파라메터 : mapObj - 레이어를 등록할 Map 객체
리턴값 :
***********************************************************************/
function gfnAppendDaumSatelliteLayer(mapObj) {
	var layer = new OpenLayers.Layer.DaumSatellite();
	layer.setVisibility(false);
	mapObj.addLayer(layer);
}

/**********************************************************************
설명 : DaumPhysical 레이어 추가
파라메터 : mapObj - 레이어를 등록할 Map 객체
리턴값 :
***********************************************************************/
function gfnAppendDaumPhysicalLayer(mapObj) {
	var layer = new OpenLayers.Layer.DaumPhysical();
	layer.setVisibility(false);
	mapObj.addLayer(layer);
}

/**********************************************************************
설명 : DaumStreet 레이어 추가
파라메터 : mapObj - 레이어를 등록할 Map 객체
리턴값 :
***********************************************************************/
function gfnAppendDaumStreetLayer(mapObj) {
	var layer = new OpenLayers.Layer.DaumStreet();
	mapObj.addLayer(layer);
}

/**********************************************************************
설명 : 기본지도 레이어 추가 (행정구역, 지번, 건물)
파라메터 : mapObj - 레이어를 등록할 Map 객체
			 name - WMS 레이어 명칭 (임의로 지정)
			 layers - 초기에 띄울 레이어 목록
리턴값 :
***********************************************************************/
function gfnAppendWmsLayer(mapObj, name, layers) {
	// 레이어명이 존재 하지 않으면 빈 레이어 추가 (초반에 빨간 창 뜨는 것을 막기위해서)
	if(layers == null || layers =="") {
		layers = blankLayer;
	}
	
	var layer = new OpenLayers.Layer.WMS(
			name,
			gisUrl,
			{
				layers : layers,
				styles : "",
				format : "image/png",
				exceptions : "text/xml",
				version : "1.3.0",
				crs : "EPSG:5181",
				transparent : true
			},
			{
				singleTile : true,
				transitionEffect: 'resize',
				ratio : 1,
				yx : {'EPSG:5181' : true},
				displayOutsideMaxExtent : true
			}
	);
	mapObj.addLayer(layer);
	
	// 레이어 loading 시작 시 로딩바 표시
	layer.events.register("loadstart", this, function() {
		$('#loadingBar').show();
	});
	// 레이어 loading 종료 시 로딩바 표시
	layer.events.register("loadend", this, function() {
		$('#loadingBar').hide();
	});
}


/**********************************************************************
설명 : 검색 결과용 벡터 레이어 추가
파라메터 : mapObj - 레이어를 등록할 Map 객체
리턴값 :
***********************************************************************/
function gfnSearchLayer(mapObj) {
	var layer = new BiesVector("searchLayer", {
		styleMap : new OpenLayers.StyleMap({
			'default': new OpenLayers.Style(null, {
				rules: [new OpenLayers.Rule({
					symbolizer : {
						"Point": {
							pointRadius: 4,
							graphicName: "circle",
							fillColor: "\${fillColor}",
							fillOpacity: "\${fillOpacity}",
							strokeWidth: 3,
							strokeOpacity: 1,
							strokeColor: "\${strokeColor}"
						},
						"Line": {
							strokeWidth: "\${strokeWidth}",
							strokeOpacity: 1,
							strokeColor: "\${strokeColor}",
							strokeDashstyle : "\${strokeDashstyle}"
						},
						"Polygon": {
							strokeWidth: 3,
							strokeOpacity: 1,
							strokeColor: "#ffff00",
							fillColor: "#ffff00",
							fillOpacity: 0
						}
					}
				})]
			})
		})
	});
	mapObj.addLayer(layer);
}

function gfnSelectLayer(mapObj) {
	if(!mapObj) mapObj = map;
	var selectLayer = new BiesVector("selectLayer", {
		styleMap : new OpenLayers.StyleMap({
			"default" : new OpenLayers.Style(null, {
				rules: [new OpenLayers.Rule({
					symbolizer : {
						"Point": gfnExtendSymbolizer(),
						"Line": gfnExtendSymbolizer({
							strokeWidth : 7,
							strokeOpacity : 0.3
						}),
						"Polygon": gfnExtendSymbolizer()
					}
				})]
			})
		})
	});
	mapObj.addLayer(selectLayer);
}

function gfnGetFeatureJson(layer) {
	var jsonFormat = new OpenLayers.Format.GeoJSON();
	return jsonFormat.write(layer.features);
}

/**********************************************************************
설명 : 전체 영역으로 이동 
파라메터 : mapObj - 지도 객체 (null 일 경우 메인 지도 객체 사용)
리턴값 :
***********************************************************************/
function gfnMoveMaxExtent(mapObj) {
	
	 
	if(mapObj == null) {
		mapObj = map;
	}
	
	//mapObj.setCenter(new OpenLayers.LonLat(266205, 308490), 10);
	mapObj.setCenter(new OpenLayers.LonLat(197855.42096, 451512.03556), 10);
}

/**********************************************************************
설명 : Layer 객체를 반환 - map 객체의 getLayersByName 을 사용할 경우 배열로 반환되므로 별도 함수로 추출 (메소드 추출)
파라메터 : name - Layer 객체의 이름
			 mapObj - 지도 객체 (null 일 경우 메인 지도 객체 사용)
리턴값 : layer - 검색된 Layer 객체 (없으면 null 반환)
***********************************************************************/
function gfnGetLayer(name, mapObj) {
	if(mapObj == null) {
		mapObj = map;
	}
	var layer = null;
	var layers = mapObj.getLayersByName(name);
	if(layers && layers.length > 0) {
		layer =  layers[0];
	}
	return layer;
}

/**********************************************************************
설명 : OpenLayers WMS 레이어에 지도엔진에서 설정한 레이어 목록을 표시
파라메터 : layerName - Layer 객체의 이름
			 layerList - 지도엔진에서 설정한 레이어 목록
			 mapObj - 지도 객체 (null 일 경우 메인 지도 객체 사용)
리턴값 : layer - 검색된 Layer 객체 (없으면 null 반환)
***********************************************************************/
function gfnMergeNewParams(layerName, layerList, mapObj) {
	if(mapObj == null) {
		mapObj = map;
	}
	var layer = gfnGetLayer(layerName, mapObj);
	if(layer) {
		if(layerList == "") {
			layerList = blankLayer;
		}
		
		layer.mergeNewParams({
			layers : layerList
		});
	}
	else {
		$.messager.alert("알림", "지정한 이름의 레이어가 존재하지 않습니다.");
	}
	/** 범례 표시 안함.
	if(mapObj == map) {
		gfnLoadGetStyle();
	}*/
}

/**********************************************************************
설명 : OpenLayers WMS 레이어에 지도엔진에서 설정한 레이어 목록을 표시
파라메터 : layerName - Layer 객체의 이름
			 layerList - 지도엔진에서 설정한 레이어 목록
			  layerStyles - 지도엔진에서 설정한 레이어 스타일 목록
			 mapObj - 지도 객체 (null 일 경우 메인 지도 객체 사용)
리턴값 : layer - 검색된 Layer 객체 (없으면 null 반환)
***********************************************************************/
function gfnMergeNewParams(layerName, layerList,layerStyles, mapObj) {
	if(mapObj == null) {
		mapObj = map;
	}
	var layer = gfnGetLayer(layerName, mapObj);
	if(layer) {
		if(layerList == "") {
			layerList = blankLayer;
		}
		
		layer.mergeNewParams({
			layers : layerList,
			styles : layerStyles
		});
	}
	else {
		$.messager.alert("알림", "지정한 이름의 레이어가 존재하지 않습니다.");
	}
	
	/** 범례 표시 안함.
	if(mapObj == map) {
		gfnLoadGetStyle();
	}*/
}

/**********************************************************************
설명 :  기본지도 레이어 리스트 목록 반환
파라메터 : isBase - 기본도(true), 항공사진(false)
리턴값 : layers - 레이어목록문자열
***********************************************************************/
function gfnGetBaseLayerList(isBase) {
	var layers = [];
	for(var i in baseLayers) {
		if(baseLayers[i].visibility) {
			if(!isBase && baseLayers[i].air) {
				layers.push(baseLayers[i].air);
			}
			else {
				layers.push(baseLayers[i].layer);
			}
		}
	}
	return layers.join();
}

/**********************************************************************
설명 : WFS - GetFeature 서비스 호출
파라메터 : featureType - 검색할 도형타입 (테이블명)
			 filter - 검색할 조건 필터 객체
			 callback - 검색 수행 후 결과를 받을 함수
리턴값 : 
***********************************************************************/
function gfnWFSGetFeature(featureType, filter, callback, options) {
	
	var params = {
			url: "/gis/proxy?Service=WFS",
	        geometryName: "the_geom",
	        featureType: featureType,
	        featurePrefix: "",
	        srsName: "EPSG:5181"
		};
		
		if(options && options.geometryName) {
			params["geometryName"] = options.geometryName;
		}
		
		$('#loadingBar').show();
		 // 토지 검색
	    var protocol = new OpenLayers.Protocol.WFS.v1_1_0(params);
	    protocol.read({
	    	maxFeatures : 9999,
	        filter: filter,
	        callback: function(response) {
	        	$('#loadingBar').hide();
	            if(response && response.features) {
	                if(callback) {
	                	callback(response);
	                }
	            }
	            else {
	            	$.messager.alert("알림", "WFS 호출에 실패했습니다.");
	            }
	        }
	    });
}

/**********************************************************************
설명 : 공간 좌표를 검색조건으로 검색
파라메터 : featureType - 검색할 도형타입 (테이블명)
			 geometry - 검색할 공간 좌표 or 공간 좌표
			 bShow - 도형 표시 여부 
			 bClean - 이전 도형 삭제 여부
			 bMove - 이동 여부
			 callback - 함수 호출 후 실행할 함수 
리턴값 : 
***********************************************************************/
function gfnGetFeatureByIntersects(featureType, geometry, bShow, bClean, bMove, callback) {
	var filter = new OpenLayers.Filter.Spatial({
        type: OpenLayers.Filter.Spatial.INTERSECTS,
        value:geometry
    });
	
    gfnWFSGetFeature(featureType, filter, function(response) {
    	if(response && response.features && response.features.length > 0) {
    		if(bShow) {
    			gfnHighlightFeature(response.features, bClean, bMove);	
    		}
    	}
    	if(callback) {
    		callback(response);
	    }
    });
}

function gfnGetFeatureByDWithin(featureType, geometry, dist, bShow, bClean, bMove, callback, options) {
	var filter = new OpenLayers.Filter.Spatial({
        type: OpenLayers.Filter.Spatial.DWITHIN,
        value:geometry,
        distance : dist
    });
	
    gfnWFSGetFeature(featureType, filter, function(response) {
    	if(response && response.features && response.features.length > 0) {
    		if(bShow) {
    			gfnHighlightFeature(response.features, bClean, bMove);	
    		}
    	}
    	if(callback) {
    		callback(response);
	    }
    }, options);	
}

/**********************************************************************
설명 : 속성 비교연산(==)을 검색조건으로 검색
파라메터 : featureType - 검색할 도형타입 (테이블명)
			 fields - 검색할 필드명 or 검색할 필드명의 목록
			 values - 검색할 값 or 검색할 필드값의 목록
			 bShow - 도형 표시 여부 
			 bClean - 이전 도형 삭제 여부
			 bMove - 이동 여부
			 callback - 함수 호출 후 실행할 함수 
리턴값 : 
***********************************************************************/
function gfnGetFeatureByEquals(featureType, fields, values,  bShow, bClean, bMove, callback) {
	var type = OpenLayers.Filter.Comparison.EQUAL_TO;
	gfnGetFeatureByComparison(featureType, type, fields, values,  bShow, bClean, bMove, callback);
}

/**********************************************************************
설명 : 속성 비교연산(Like)을 검색조건으로 검색
파라메터 : featureType - 검색할 도형타입 (테이블명)
			 fields - 검색할 필드명 or 검색할 필드명의 목록
			 values - 검색할 값 or 검색할 필드값의 목록
			 bShow - 도형 표시 여부 
			 bClean - 이전 도형 삭제 여부
			 bMove - 이동 여부
			 callback - 함수 호출 후 실행할 함수 
리턴값 : 
***********************************************************************/
function gfnGetFeatureByLikes(featureType, fields, values,  bShow, bClean, bMove, callback) {
	var type = OpenLayers.Filter.Comparison.LIKE;
	gfnGetFeatureByComparison(featureType, type, fields, values,  bShow, bClean, bMove, callback);
}

/**********************************************************************
설명 : 속성 비교연산(Like)을 검색조건으로 검색
파라메터 : featureType - 검색할 도형타입 (테이블명)
			type 	- 검색할 연산식 타입
			 fields - 검색할 필드명 or 검색할 필드명의 목록
			 values - 검색할 값 or 검색할 필드값의 목록
			 bShow - 도형 표시 여부 
			 bClean - 이전 도형 삭제 여부
			 bMove - 이동 여부
			 callback - 함수 호출 후 실행할 함수 
리턴값 : 
***********************************************************************/
function gfnGetFeatureByComparison(featureType, type, fields, values,  bShow, bClean, bMove, callback, logicalType) {
	var filter = null;
	if(typeof values === "object" && values.length > 1) {
		var filters = [];
		for(var i=0, len=values.length; i < len; i++) {
			var field = null;
			if(typeof fields === "object") {
				field = fields[i];
			}
			else {
				field = fields;
			}
			
			filters.push(new OpenLayers.Filter.Comparison({
		        type: type,
		        property : field,
		        value: values[i]
		    }));
		}
		
		if(!logicalType) logicalType = OpenLayers.Filter.Logical.OR;
	    filter = new OpenLayers.Filter.Logical({
	    	filters : filters,
	    	type : logicalType
	    });
	}
	else {
	    filter = new OpenLayers.Filter.Comparison({
	        type: type,
	        property : fields,
	        value: values
	    });
	}
    
    // WFS GetFeature 호출 후 하이라이팅
    gfnWFSGetFeature(featureType, filter, function(response) {
    	if(response && response.features) {
    		if(response.features.length > 0 && bShow) {
    			gfnHighlightFeature(response.features, bClean, bMove);	
        	}	
    	}
    	else {
    		$.messager.alert("알림", "WFS GetFeature 실패");
    	}
    	
    	if(callback) {
    		callback(response);
    	}
    });
}

function gfnGetFeatureById(featureType, values, bShow, bClean, bMove, callback, options) {
	var filter = new OpenLayers.Filter.FeatureId({
		fids : values
	});

	// WFS GetFeature 호출 후 하이라이팅
    gfnWFSGetFeature(featureType, filter, function(response) {
    	if(response && response.features) {
    		if(response.features.length > 0 && bShow) {
    			gfnHighlightFeature(response.features, bClean, bMove, options);	
    			
        	}	
    	}
    	else {
    		$.messager.alert("알림", "WFS GetFeature 실패");
    	}
    	
    	if(callback) {
    		callback(response);
    	}
    });
}

/**********************************************************************
설명 : LglCd 를 검색조건으로 연속지적 도형을 지도에 표시 
파라메터 : lglCd - LglCd 번호 or LglCd 번호의 배열
			 bClean - 검색할 LglCd 번호
			 bMove - 이동 여부
			 bInfo - 상세속성 검색 여부
			 callback - 함수 호출 후 실행할 함수 
리턴값 : 
***********************************************************************/
function gfnHighlightFeatureByLglCd(lglCds, bClean, bMove, bInfo, callback) {
	gfnGetFeatureByEquals("Z_KLIS_LP_PA_CBND", "lglCd", lglCds, true, bClean, bMove, function(response) {
		if(bInfo) {
			gfnShowInfo(response);
		}
		if(callback) {
			callback(response);	
		}
	});
}

/**********************************************************************
설명 : 고유관리번호 unqMgno 를 검색조건으로 도형을 지도에 표시 
파라메터 : unqMgnos - the_geom 번호 or the_geom 번호의 배열
			 bClean - 검색할 LglCd 번호
			 bMove - 이동 여부
			 bInfo - 상세속성 검색 여부
			 callback - 함수 호출 후 실행할 함수 
리턴값 : 
***********************************************************************/
function gfnHighlightFeatureByUnqMgnos(layerName, unqMgnos, bClean, bMove, bInfo, callback) {
	gfnGetFeatureByEquals(layerName, "unq_mgno", unqMgnos, true, bClean, bMove, function(response) {
		if(bInfo) {
			gfnShowInfo(response);
		}
		if(callback) {
			callback(response);	
		}
	});
}

/**********************************************************************
설명 : 투자비정보를 위해 고유관리번호 unqMgno 를 검색조건으로 도형을 지도에 표시 
파라메터 : unqMgnos - the_geom 번호 or the_geom 번호의 배열
			 bClean - 검색할 LglCd 번호
			 bMove - 이동 여부
			 bInfo - 상세속성 검색 여부
			 callback - 함수 호출 후 실행할 함수 
리턴값 : 
***********************************************************************/
function gfnHighlightFeatureByUnqMgnosForInvestmentInfo(layerName, unqMgnos, bClean, bMove, bInfo, callback, row) {
	if(unqMgnos) {
		gfnGetFeatureByEquals(layerName, "unq_mgno", unqMgnos, true, bClean, bMove, function(response) {
			if(bInfo) {
				gfnShowInfoForInvestmentInfo(row);
			}
			if(callback) {
				callback(response);	
			}
		});
	} else {
		if(bInfo) {
			gfnShowInfoForInvestmentInfo(row);
		}
		if(callback) {
			callback(response);	
		}
	}
}


/**********************************************************************
설명 : 투자비정보 중복투자를 위해 고유관리번호 unqMgno 를 검색조건으로 도형을 지도에 표시 
파라메터 : unqMgnos - the_geom 번호 or the_geom 번호의 배열
			 bClean - 검색할 LglCd 번호
			 bMove - 이동 여부
			 bInfo - 상세속성 검색 여부
			 callback - 함수 호출 후 실행할 함수 
리턴값 : 
***********************************************************************/
function gfnHighlightFeatureByUnqMgnosForInvestmentInfoDup(layerName, unqMgnos, bClean, bMove, bInfo, callback) {
	if(unqMgnos) {
		gfnGetFeatureByEquals(layerName, "unq_mgno", unqMgnos, true, bClean, bMove, function(response) {
			if(callback) {
				callback(response);	
			}
		});
	} else {
//		if(bInfo) {
//			gfnShowInfoForInvestmentInfo(row);
//		}
		if(callback) {
			callback(response);	
		}
	}
}

/**********************************************************************
설명 : 지도에 도형 표시 
파라메터 : features - 표시할 도형들
			 bClean - 이전 도형 삭제 여부
			 bMove - 이동 여부
리턴값 : 
***********************************************************************/
function gfnHighlightFeature(features, bClean, bMove, options) {
	var layer = gfnGetLayer("searchLayer");
	
	//var id =  $('#div_bottom_tab').tabs('getSelected').prop('id');	
	//if( $('#div_bottom_tab').tabs().length > 0 ){
	//	id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//		console.log(id)
	//}
	// 이전 도형 삭제
	if(bClean) {
		layer.removeAllFeatures();
	}
	// 좌표 변환 & 스타일 적용
	for(var i=0; i < features.length; i++) {
		
		//features[i].geometry.transform(SRORG6640, EPSG900913);
		
		if(!features[i].attributes["strokeWidth"]) {
			features[i].attributes["strokeWidth"] = searchLayerStyle["strokeWidth"];		
		}
		if(!features[i].attributes["fillColor"]) {
			features[i].attributes["fillColor"] = searchLayerStyle["fillColor"];
		}
		if(!features[i].attributes["strokeColor"]) {
			features[i].attributes["strokeColor"] = searchLayerStyle["strokeColor"];
		}
		if(!features[i].attributes["fillOpacity"]) {
			features[i].attributes["fillOpacity"] = searchLayerStyle["fillOpacity"];
		}
		if(!features[i].attributes["strokeDashstyle"]) {
			features[i].attributes["strokeDashstyle"] = searchLayerStyle["strokeDashstyle"];
		}	
		if(!features[i].attributes["strokeOpacity"]) {
			features[i].attributes["strokeOpacity"] = searchLayerStyle["strokeOpacity"];
		}

		
	} 
	// 도형 추가
	layer.addFeatures(features);
	
//	if(tabObj[id]){
//		for(var a=0;a < features.length; a++){
//			if(features[a].geometry != null){
//				tabObj[id].push(features[a]);
//			}
//		}
//	}
//	else{
//		
//		tabObj[id] = features;
//	}
	
	// 도형 위치로 이동
	if(bMove) {
		if(options && options.zoomLevel) {
			var center = layer.getDataExtent().getCenterLonLat();
			map.setCenter(center, options.zoomLevel);
		}
		else {
			var bounds = layer.getDataExtent();

			if((bounds.left == bounds.right) || (bounds.top == bounds.bottom)) {
				var center = layer.getDataExtent().getCenterLonLat();
				map.setCenter(center, 14);
			}
			else {
				map.zoomToExtent(bounds);	
			}
		}
		
	}
	
}

/**********************************************************************
설명 : KML 파일 다운로드
파라메터 : features - KML 로 다운로드할 도형들 (null일 경우 검색결과 레이어의 도형들)
리턴값 : 
***********************************************************************/
function gfnDownloadKML(features) {
	// 레이어가 없으면 검색 결과 레이어로 설정
	if(!features) {
		layer = gfnGetLayer("searchLayer");
		features = layer.features;
	}
	if(features.length == 0) {
		$.messager.alert("알림", "다운로드할 도형이 없습니다.");
		return;
	}
	var format = new OpenLayers.Format.KML();
	var kmlStr = format.write(features);
	$("#hid_data").val(encodeURIComponent(kmlStr));
	$("#frm_file_download").attr("action", "/gis/KMLFileDownload");
	$("#frm_file_download").submit();
}



/**********************************************************************
설명 : WMS getStyles - 레이어의 스타일 정보를 반환
파라메터 : layers - 반환할 레이어명 목록 문자열
			 callback - 함수 호출 후 실행할 함수 
리턴값 : 
***********************************************************************/
function gfnWMSGetStyles(layers, callback) {
	if(layers == "") {
		return;
	}
	
	var params = {
		service : "WMS",
		version : "1.3.0",
		request : "GetStyles",
		layers : layers
	};
	
	$.get(
		"/gis/proxy",
		gfnConvertObjToStr(params),
		function(response) {
			callback(response);
		},
		"xml"
	);
}

/**********************************************************************
설명 : 레이어의 테이블, 속성, 속성값을 반환
파라메터 : layers - 반환할 레이어명 목록 문자열
			 callback - 함수 호출 후 실행할 함수 
리턴값 : 
***********************************************************************/
function gfnGetStyles(layers, callback) {
	gfnWMSGetStyles(layers, function(response) {
		var data = {};
		
		var prefixSld = "";
		var prefixSe = "";
		var prefixOgc = "";
		
		// IE 외의 브라우저 호환성을 위해 추가
		if(OpenLayers.BROWSER_NAME == "msie") {
			prefixSld = "sld:";
			prefixSe = "se:";
			prefixOgc = "ogc:";
		}
		
		var eleLayers = response.getElementsByTagName(prefixSld + "NamedLayer");
		for(var i=0, len=eleLayers.length; i < len; i++) {
			// 레이어 명 추출
			var layerName = "";
			var eleLayerNames = eleLayers[i].getElementsByTagName(prefixSe + "Name");
			if(eleLayerNames.length > 0) layerName = $(eleLayerNames[0]).text();
			
			data[layerName]  = {
				table : null,
				rules : []
			};
			
			// 테이블 명 추출
			var featureTypeNames = eleLayers[i].getElementsByTagName(prefixSe + "FeatureTypeName");
			if(featureTypeNames.length > 0) data[layerName].table =  $(featureTypeNames[0]).text();
			
			// 룰 추출
			var eleRules = eleLayers[i].getElementsByTagName(prefixSe + "Rule");
			for(var k=0, kLen=eleRules.length; k < kLen; k++) {
				var rule = {
					name : null,
					fields : [],
					values : [],
					ops : []
				};
				
				// 룰 명 추출
				var eleRuleNames = eleRules[k].getElementsByTagName(prefixSe + "Name");
				if(eleRuleNames.length > 0) rule.name =  $(eleRuleNames[0]).text();
				
				// Equals 필터 추출
				var equalTos = eleRules[k].getElementsByTagName("PropertyIsEqualTo");
				for(var m=0, mLen=equalTos.length; m < mLen; m++) {
					var op = "=";
					var field = "";
					var value = "";
					var propertyName = equalTos[m].getElementsByTagName(prefixOgc + "PropertyName");
					if(propertyName.length > 0) field = $(propertyName[0]).text();
					
					var literal = equalTos[m].getElementsByTagName("Literal");
					if(literal.length > 0) value = $(literal[0]).text();
					
					if(op && field && value) {
						rule.ops.push(op);
						rule.fields.push(field);
						rule.values.push(value);
					}
				}
				
				// Like 필터 추출
				var likeTos = eleLayers[i].getElementsByTagName("PropertyIsLike");
				for(var m=0, mLen=likeTos.length; m < mLen; m++) {
					var op = "LIKE";
					var field = "";
					var value = "";
					var propertyName = likeTos[m].getElementsByTagName(prefixOgc + "PropertyName");
					if(propertyName.length > 0) field = $(propertyName[0]).text();
					
					var literal = likeTos[m].getElementsByTagName("Literal");
					if(literal.length > 0) value = $(literal[0]).text();
					
					if(op && field && value) {
						rule.ops.push(op);
						rule.fields.push(field);
						rule.values.push(value);
					}
				}
				data[layerName].rules.push(rule);
			}
		}
		
		if(callback) {
			callback(data);
		}
	});
}

/**********************************************************************
설명 : 공간영역 버퍼
파라메터 : geometry - 공간 객체
			 buffer - 버퍼할 거리 
리턴값 : 버퍼된 공간영역 반환
***********************************************************************/
function gfnBufferGeometry(geometry, distance, isEnvelope) {
	// Jsts Geometry 객체로 변환
	var parser = new jsts.io.OpenLayersParser();
	var jstsGeometry = parser.read(geometry);
	
	// 버퍼 연산
	jstsGeometry = jstsGeometry.buffer(distance); 
	
	// 포함하는 사각영역 
	if(isEnvelope) jstsGeometry = jstsGeometry.getEnvelope();
	
	// OpenLayers 객체로 변환 후 반환
	return parser.write(jstsGeometry);
}


/**********************************************************************
설명 : 공간영역의 교집합을 반환
파라메터 : geometry1 - 첫번째 공간영역
			 geometry2 - 두번째 공간영역
리턴값 : 두 공간영역의 교집합인 공간영역
***********************************************************************/
function gfnIntersectionGeometry(geometry1, geometry2) {
	// Jsts Geometry 객체로 변환
	var parser = new jsts.io.OpenLayersParser();
	var jstsGeometry1 = parser.read(geometry1);
	var jstsGeometry2 = parser.read(geometry2);
	
	// Intersection 연산
	var intersectionGeometry = jstsGeometry1.intersection(jstsGeometry2);

	// OpenLayers 객체로 변환 후 반환
	return parser.write(intersectionGeometry);
}

/**********************************************************************
설명 : 사용가능한 축척 레벨 확인
파라메터 : zoomLevel - 기준 축척레벨
리턴값 : 사용가능하면 true, 사용불가능하면 false 반환
***********************************************************************/
function gfnLimitZoomLevel(zoomLevel, limitDist, messageCode) {
	var zoom = map.getZoom();
	if(zoom < zoomLevel) {
		message.getConfirm(messageCode, limitDist, zoomLevel, function(isTrue) {
			if(isTrue) {
				map.zoomTo(zoomLevel);
			}
		});
	}
}


/**********************************************************************
설명 : 지도 화면 저장
파라메터 : 
리턴값 : 
***********************************************************************/
function gfnSaveMap() {
	$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
	$("#frm_file_download").attr("action", "/gis/saveMapDownload");
	$("#frm_file_download").submit();
}
