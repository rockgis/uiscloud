/**
 * 파일명 : openLayersCustom.js
 * 설명 : OpenLayer 의 기능을 BIES에 맞게 확장
 * 
 * 수정일       수정자   수정내용
 *----------   -------  --------------------------------------------------
 */

/**********************************************************************
설명 : 인덱스 맵  - 기본 지도 창과 인덱스 맵의 영역 연동
***********************************************************************/
BiesIndexZoomBox = OpenLayers.Class(OpenLayers.Control.ZoomBox, {
	
	/**********************************************************************
 	설명 : 영역박스 그리기
 	파라메터 : 
 	리턴값 :  
 	***********************************************************************/
	draw: function() {
        this.handler = new BiesIndexBox( this,
                            {done: this.zoomBox}, {keyMask: this.keyMask} );
    },
	
    /**********************************************************************
 	설명 : 지정된 영역으로 기본 지도 객체 이동
 	파라메터 : position - 공간영역 또는 선택 지점
 	리턴값 :  
 	***********************************************************************/
	zoomBox: function (position) {
        if (position instanceof OpenLayers.Bounds) {
            var bounds;
            if (!this.out) {
                var minXY = this.map.getLonLatFromPixel({
                    x: position.left,
                    y: position.bottom
                });
                var maxXY = this.map.getLonLatFromPixel({
                    x: position.right,
                    y: position.top
                });
                bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                                               maxXY.lon, maxXY.lat);
            } else {
                var pixWidth = Math.abs(position.right-position.left);
                var pixHeight = Math.abs(position.top-position.bottom);
                var zoomFactor = Math.min((this.map.size.h / pixHeight),
                    (this.map.size.w / pixWidth));
                var extent = this.map.getExtent();
                var center = this.map.getLonLatFromPixel(
                    position.getCenterPixel());
                var xmin = center.lon - (extent.getWidth()/2)*zoomFactor;
                var xmax = center.lon + (extent.getWidth()/2)*zoomFactor;
                var ymin = center.lat - (extent.getHeight()/2)*zoomFactor;
                var ymax = center.lat + (extent.getHeight()/2)*zoomFactor;
                bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);
            }
            this.baseMap.zoomToExtent(bounds);
        } else { // it's a pixel
        	this.baseMap.setCenter(this.map.getLonLatFromPixel(position), this.baseMap.numZoomLevels-2);
        }
    },
    
    CLASS_NAME: "BiesIndexZoomBox"
});

/**********************************************************************
설명 : 인덱스 맵에서 사용하는 Box Handler
***********************************************************************/
BiesIndexBox = OpenLayers.Class(OpenLayers.Handler.Box, {
	
	/**********************************************************************
 	설명 : 사각 박스 그리기 시작 - 시작 시 이전 박스 삭제
 	파라메터 : xy - 화면 좌표
 	리턴값 :  
 	***********************************************************************/
	startBox: function (xy) {
		if(this.zoomBox) this.removeBox();
        this.callback("start", []);
        this.zoomBox = OpenLayers.Util.createDiv('zoomBox', {
            x: -9999, y: -9999
        });
        this.zoomBox.className = this.boxDivClassName;                                         
        this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
        this.map.viewPortDiv.appendChild(this.zoomBox);
        OpenLayers.Element.addClass(
            this.map.viewPortDiv, "olDrawBox"
        );
    },
	
	/**********************************************************************
 	설명 : 지정된 영역으로 사각 박스 그리기
 	파라메터 : bounds - 지도 영역
 	리턴값 :  
 	***********************************************************************/
	applyBox: function (bounds) {
		if(this.zoomBox) this.removeBox();
		
		this.dragHandler.start = this.map.getPixelFromLonLat(new OpenLayers.LonLat(bounds.left, bounds.top));
		var endPixel = this.map.getPixelFromLonLat(new OpenLayers.LonLat(bounds.right, bounds.bottom));
		var width = endPixel.x - this.dragHandler.start.x;
		var height = endPixel.y - this.dragHandler.start.y;
		
		this.zoomBox = OpenLayers.Util.createDiv('zoomBox', this.dragHandler.start);
		this.zoomBox.className = this.boxDivClassName;
		this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
		this.map.viewPortDiv.appendChild(this.zoomBox);
		this.zoomBox.style.width = width + "px";
		this.zoomBox.style.height = height + "px";
		
		$(this.zoomBox).draggable();
		$(this.zoomBox).mousedown(function(evt) {
			evt.stopPropagation();
		});
    },
	
	CLASS_NAME: "BiesIndexBox"
});

/**********************************************************************
설명 : 축척레벨바 
***********************************************************************/
BiesPanZoomBar = OpenLayers.Class(OpenLayers.Control.PanZoomBar, {

	/**********************************************************************
 	설명 : 축척바 그리기 - 그리는 위치를 오른쪽으로 변경
 	파라메터 : px - 화면 좌표 
 	리턴값 : div 
 	***********************************************************************/
	draw: function(px) {
		OpenLayers.Control.PanZoomBar.prototype.draw.apply(this, arguments);
		this.div.style.left = "";
		this.div.style.top = "44px";
		this.div.style.right = "50px";
		return this.div;
	},
	
	moveZoomBar:function() {
		var newTop = 
            ((this.map.getNumZoomLevels()-1) - this.map.getZoom()) * 
            this.zoomStopHeight + this.startTop + 1;
        this.slider.style.top = newTop + "px";
        
        // 축척레벨바 옆에 축척레벨 표시
		$("#tooltip span").html(map.getZoom() + "레벨");
		$("#tooltip").css("top", (newTop+38) + "px");
		if(this.map.getZoom() < 10) {
			$("#tooltip span").css("left", "10px");
		}
		else {
			$("#tooltip span").css("left", "6px");
		}
    },  
	
	CLASS_NAME: "BiesPanZoomBar"
});

/**********************************************************************
설명 : 거리 측정 기능에 사용하는 Handler - 이벤트 반응속도 & 팝업 UI 로 인해 수정
***********************************************************************/
BiesPathMeasure = OpenLayers.Class(OpenLayers.Handler.Path, {
	popup : null,		// 외부에서 사용하던 팝업을 내부로 이동
	partDist : [],			// 중간 거리
	
	/**********************************************************************
 	설명 : 측정 완료 시 수행
 	파라메터 : cancel - 취소 이벤트 여부
 	리턴값 :
 	***********************************************************************/
	finalize: function(cancel) {
        var key = cancel ? "cancel" : "done";
        this.drawing = false;
        this.mouseDown = false;
        this.lastDown = null;
        this.lastUp = null;
        this.lastTouchPx = null;
        this.callback(key, [this.geometryClone()]);
        if(cancel || !this.persist) {
        	this.destroyFeature(cancel);
        }
    },

	/**********************************************************************
 	설명 :지도에서 그린 선의 거리를 계산
 	파라메터 : geometry - 공간객체
 	리턴값 : 거리 값과 단위
 	***********************************************************************/
	measureDistance : function(geometry) {
		//geometry = geometry.transform(EPSG900913, SRORG6640);
		var subLength = geometry.getLength();
    	var tempLength = subLength;
    	var unit = "";
    	tempLength *= (OpenLayers.INCHES_PER_UNIT["m"] / OpenLayers.INCHES_PER_UNIT['km']);
        if(tempLength > 1) {
        	subLength = tempLength.toFixed(2);
        	unit = "km";
        }
        else {
        	subLength = subLength.toFixed(2);
        	unit = "m";
        }
        subLength = gfnFormatNumberFloat(subLength);
		return [subLength, unit];
	},
	
	 /**********************************************************************
 	설명 :지도에서 그린 마지막 선의 거리를 계산
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	measureDistancePart : function() {
		var geometry = this.geometryClone();
		var vertices = geometry.getVertices();
		var points = [
		    new OpenLayers.Geometry.Point(vertices[vertices.length-2].x, vertices[vertices.length-2].y),
		    new OpenLayers.Geometry.Point(vertices[vertices.length-1].x, vertices[vertices.length-1].y)
		];
		var lineString = new OpenLayers.Geometry.LineString(points);
		return this.measureDistance(lineString);		
	},
	
	 /**********************************************************************
 	설명 :지도에서 그린 전체 선의 거리를 계산
 	파라메터 : 
 	리턴값 : 거리 값과 단위
 	***********************************************************************/
	measureDistanceAll : function() {
		var geometry = this.geometryClone();
		return this.measureDistance(geometry);		
	},
	
	 /**********************************************************************
 	설명 :지도에서 마우스 다운 이벤트가 발생할 때 실행되는 함수
 	파라메터 : evt (이벤트 객체)
 	리턴값 : 거리 값과 단위
 	***********************************************************************/
	mousedown: function(evt) {
		if (this.lastDown && this.lastDown.equals(evt.xy)) {
	        return false;
	    }
		if(this.lastDown == null) {
			if(!this.multiLine) {
				this.destroyFeature("cancel");
				this.removePopup();
			}
	        this.createFeature(evt.xy);
	    } else if((this.lastUp == null) || !this.lastUp.equals(evt.xy)) {
	        this.addPoint(evt.xy);
	    }
	    this.lastDown = evt.xy;
	    this.drawing = true;
		
        if(this.freehandMode(evt)) {
            this.removePoint();
            this.finalize();
        } else {
            if(this.lastUp == null) {
               this.addPoint(evt.xy);
            }
            this.lastUp = evt.xy;
        }
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
    	var pointFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat));
    	pointFeature.type = "measure";
    	this.layer.addFeatures(pointFeature);
		var popup;
        if(!this.count) {
			var contentHtml = "<div id='measureStart' class='olControlMeasurePopup olControlMeasurePopupStart'>시작</div>";
			popup = new BiesPopup("measurePopup", lonlat, this.getBrowserSize(38, 22), contentHtml, new OpenLayers.Pixel(5,5));
			popup.attributes = {
				print : true,
				contentHtml : "시작",
				offsetX : 5,
				offsetY : 5
			};
			if(this.movePopup) {
				contentHtml = '<div class="olControlMeasureContent">'
					/*
					+ '<div class="measureDist" >'
					+ '<span class="measureResTit">구간거리</span>'
					+ '<span class="measureResCon"></span>'
					+ '<span class="measureResUnit"></span>'
					+ '</div>'
					*/
					+ '<div class="MeasureAllDist" >'
					+ '<span class="measureResTit">총거리</span>'
					+ '<span class="measureResCon"></span>'
					+ '<span class="measureResUnit"></span>'
					+ '</div>'
					+ '<div class="MeasureEndDescript">마우스 오른쪽 버튼을 누르시면 끝마칩니다</div>'
					+ '</div>';
	        	this.popup = new BiesPopup("measurePopup", lonlat, new this.getBrowserSize(152, 57, true), contentHtml, new OpenLayers.Pixel(5,5));
	        	this.map.addPopup(this.popup);
				this.popup.type = "measure";
			}
            this.count = 1;
	    }
	    else {
	    	var distance = this.measureDistanceAll();
	    	contentHtml = "<div class='olControlMeasurePopup olControlMeasurePopupDefault'><span class='MeasureColorRed'>"+ distance[0] + "</span> " + distance[1] + "</div>";
	    	popup = new BiesPopup("measurePopup", lonlat, new this.getBrowserSize(92, 22), contentHtml, new OpenLayers.Pixel(5,5));
	    	popup.attributes = {
				print : true,
				contentHtml : distance[0] + distance[1],
				offsetX : 5,
				offsetY : 5
			};
	    }
		if (popup) {
			this.map.addPopup(popup);
			popup.type = "measure";
		}
        if(evt.button == "2") {
			this.rightclick(evt);
	        return true;
		}
        return false;
	},
	
	 /**********************************************************************
 	설명 :마우스 이동 이벤트
 	파라메터 : evt (이벤트 객체)
 	리턴값 :
 	***********************************************************************/
	mousemove: function (evt) {
		if(this.drawing) { 
            if(this.mouseDown && this.freehandMode(evt)) {
                this.addPoint(evt.xy);
            } else {
                this.modifyFeature(evt.xy);
				if(this.popup) {
					//var resDist = this.measureDistancePart();
					var allDist = this.measureDistanceAll();
					//$(this.popup.contentDiv).find(".measureDist .measureResCon").text(resDist[0]);
					//$(this.popup.contentDiv).find(".measureDist .measureResUnit").text(" " + resDist[1]);
					$(this.popup.contentDiv).find(".MeasureAllDist .measureResCon").text(allDist[0]);
					$(this.popup.contentDiv).find(".MeasureAllDist .measureResUnit").text(" " + allDist[1]);
	                this.popup.moveTo(evt.xy);	
				}
            }
        }
        return true;
    },
    
    /**********************************************************************
 	설명 :마우스 우 클릭 시 거리 측정 종료
 	파라메터 : evt (이벤트 객체)
 	리턴값 :
 	***********************************************************************/
    rightclick: function(evt) {
    	this.dblclick(evt);
    	return false;
    },
    
    /**********************************************************************
 	설명 :더블 클릭 시 거리 측정 종료.
 	파라메터 : evt (이벤트 객체)
 	리턴값 :
 	***********************************************************************/
    dblclick: function(evt) {
    	if(this.map.popups[this.map.popups.length-1].type == "measure") {
			this.map.removePopup(this.map.popups[this.map.popups.length-1]);
		}
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        var allDist = this.measureDistanceAll();
		var contentHtml = "<div class='olControlMeasurePopup olControlMeasurePopupEnd'>총거리 : <span class='MeasureColorRed'>"+ allDist[0] + "</span> " + allDist[1] + "</div>";
	    var popup = new BiesPopup("measurePopup", lonlat, new this.getBrowserSize(132, 22), contentHtml, new OpenLayers.Pixel(5,5));
		this.map.addPopup(popup);
		popup.type = "measure";
		popup.attributes = {
			print : true,
			contentHtml : "총거리 : " + allDist[0] + allDist[1],
			offsetX : 5,
			offsetY : 5
		};
		this.count = 0;
        if(!this.freehandMode(evt)) {
            this.removePoint();
            this.finalize();
        }
		if(this.popup) {
			this.map.removePopup(this.popup);
			this.popup = null;
		}
        return false;
    },
    
    /**********************************************************************
 	설명 :컨트롤 활성화
 	파라메터 : geometry - 공간객체
 	리턴값 :
 	***********************************************************************/
    activate: function() {
    	this.removeFeature();
        if(!OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            return false;
        }
        var options = OpenLayers.Util.extend({
            displayInLayerSwitcher: false,
            calculateInRange: OpenLayers.Function.True,
            wrapDateLine: this.citeCompliant
        }, this.layerOptions);
        this.layer = new BiesVector(this.CLASS_NAME, options);
        this.map.addLayer(this.layer);
        return true;
    },
    
    /**********************************************************************
 	설명 :컨트롤 비 활성화
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
    deactivate: function() {
        if(!OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            return false;
        }
        if(this.drawing) {
        	this.removePopup();
            this.cancel();
        }
        if(!this.persistControl) {
        	this.layer.destroy(false);
			this.removePopup();
        }
        this.layer = null;
        return true;
    },
    
    /**********************************************************************
 	설명 : 도형, 팝업 삭제
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
    cleanFeature : function() {
		this.removeFeature();
		this.removePopup();
	},
	
	/**********************************************************************
 	설명 : 도형 삭제
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	removeFeature : function() {
		var layers = this.map.getLayersByName("BiesPathMeasure");
    	if(layers && layers.length > 0) {
    		this.map.removeLayer(layers[0]);
    		this.removePopup();
    	}
	},
    
    /**********************************************************************
 	설명 : 팝업 삭제
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
    removePopup : function() {
    	var len = this.map.popups.length;
		for(var i=len-1; i >= 0; i--) {
			if(this.map.popups[i].type == "measure") {
				this.map.removePopup(this.map.popups[i]);
			}
		}
	},
	
	/**********************************************************************
 	설명 :브라우저에 따라 화면 크기 픽셀 반환 - msie 의 경우 크기에 테두리 까지 포함 하므로 테두리 크기 2 제외 
 	파라메터 : width - 너비
 				 width - 높이
 	리턴값 : 브라우저에 따라 변환된 크기
 	***********************************************************************/
	getBrowserSize : function(width, height, move) {
		if(OpenLayers.BROWSER_NAME == "msie") {
			return new OpenLayers.Size(width-2, height-2);
		}
		else {
			if(move) {
				if(OpenLayers.BROWSER_NAME == "firefox") 
					return new OpenLayers.Size(width, height+10);
				else
					return new OpenLayers.Size(width, height+6);
			}
			else {
				return new OpenLayers.Size(width, height);	
			}
		}
	},
	
	CLASS_NAME: "BiesPathMeasure"
});

/**********************************************************************
설명 : 면적 측정 기능에 사용하는 Handler - 이벤트 반응속도 & 팝업 UI 로 인해 수정
***********************************************************************/
BiesPolygonMeasure = OpenLayers.Class(OpenLayers.Handler.Polygon, {
	popup : null,		// 외부에서 사용하던 팝업을 내부로 이동
	
	layerName : null,
	
	/**********************************************************************
 	설명 : 측정 완료 시 수행
 	파라메터 : cancel - 취소 이벤트 여부
 	리턴값 :
 	***********************************************************************/
	finalize: function(cancel) {
        var key = cancel ? "cancel" : "done";
        this.drawing = false;
        this.mouseDown = false;
        this.lastDown = null;
        this.lastUp = null;
        this.lastTouchPx = null;
        this.callback(key, [this.geometryClone()]);
        if(cancel || !this.persist) {
        	this.destroyFeature(cancel);
        }
    },
	
	/**********************************************************************
 	설명 : 면적 계산
 	파라메터 :
 	리턴값 : 면적값과 단위
 	***********************************************************************/
	measureArea : function() {
		var geometry = this.geometryClone();
		//geometry = geometry.transform(EPSG900913, SRORG6640);
		var subLength = geometry.getArea();
		var tempLength = subLength;
    	var unit = "";
		tempLength *= Math.pow(OpenLayers.INCHES_PER_UNIT["m"] / OpenLayers.INCHES_PER_UNIT['km'], 2);
	    if(tempLength > 1) {
	    	subLength = tempLength.toFixed(2);
	    	unit = "km<sup>2</sup>";
	    }
	    else {
	    	subLength = subLength.toFixed(2);
	    	unit = "m<sup>2</sup>";
	    }
	    subLength = gfnFormatNumberFloat(subLength);
		return [subLength, unit];
	},
	
	/**********************************************************************
 	설명 :지도에서 마우스 다운 이벤트가 발생할 때 실행되는 함수
 	파라메터 : evt (이벤트 객체)
 	리턴값 : 거리 값과 단위
 	***********************************************************************/
	mousedown: function(evt) {
		if (this.lastDown && this.lastDown.equals(evt.xy)) {
	        return false;
	    }
		if(this.lastDown == null) {
			if(!this.multiLine) {
				this.destroyFeature("cancel");
				this.removePopup();
			}
	        this.createFeature(evt.xy);
	    } else if((this.lastUp == null) || !this.lastUp.equals(evt.xy)) {
	        this.addPoint(evt.xy);
	    }
	    this.lastDown = evt.xy;
	    this.drawing = true;
		
        if(this.freehandMode(evt)) {
            this.removePoint();
            this.finalize();
        } else {
            if(this.lastUp == null) {
               this.addPoint(evt.xy);
            }
            this.lastUp = evt.xy;
        }
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
    	var pointFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat));
    	pointFeature.type = this.layerName;
    	this.layer.addFeatures(pointFeature);
		var popup = null;
        if(!this.count) {
			var contentHtml = "<div id='measureStart' class='olControlMeasurePopup olControlMeasurePopupStart'><span class='MeasureColorRed'>시작</span></div>";
			popup = new BiesPopup("measurePopup", lonlat, this.getBrowserSize(38, 22), contentHtml, new OpenLayers.Pixel(5,5));
			if(this.movePopup) {
				contentHtml = '<div class="olControlMeasureContent">'
					+ '<div class="MeasureAllArea" >'
					+ '<span class="measureResTit">총면적</span>'
					+ '<span class="measureResCon"></span>'
					+ '<span class="measureResUnit"></span>'
					+ '</div>'
					+ '<div class="MeasureEndDescript">마우스 오른쪽 버튼을 누르시면 끝마칩니다</div>'
					+ '</div>';
	        	this.popup = new BiesPopup("measurePopup", lonlat, new this.getBrowserSize(152, 60, true), contentHtml, new OpenLayers.Pixel(5,5));
	        	this.popup.attributes = {
        			print : true,
        			contentHtml : "시작",
        			offsetX : 5,
        			offsetY : 5
        		};
	        	this.map.addPopup(this.popup);
				this.popup.type = this.layerName;
			}
            this.count = 1;
	    }
	    else {
	    	/*
	    	contentHtml = "<div class='olControlMeasurePopup olControlMeasurePopupDefault'><span class='MeasureColor'>"+ this.measureArea()[0] +"</span> "+ this.measureArea()[1] +"</div>";
	    	popup = new BiesPopup("measurePopup", lonlat, new this.getBrowserSize(92, 22), contentHtml, new OpenLayers.Pixel(5,5));
	    	*/
	    	this.count += 1;
	    }
		if (popup) {
			this.map.addPopup(popup);
			popup.type = this.layerName;
		}
        if(evt.button == "2") {
			this.rightclick(evt);
	        return true;
		}
        return false;
	},
	
	/**********************************************************************
 	설명 :마우스 이동 이벤트
 	파라메터 : evt (이벤트 객체)
 	리턴값 :
 	***********************************************************************/
	mousemove: function (evt) {
		if(this.drawing) { 
            if(this.mouseDown && this.freehandMode(evt)) {
                this.addPoint(evt.xy);
            } else {
                this.modifyFeature(evt.xy);
				if(this.popup) {
					var allArea = this.measureArea();
					$(this.popup.contentDiv).find(".MeasureAllArea .measureResCon").text(allArea[0]);
					$(this.popup.contentDiv).find(".MeasureAllArea .measureResUnit").html(allArea[1]);
	                this.popup.moveTo(evt.xy);	
				}
            }
        }
        return true;
    },
    
    /**********************************************************************
 	설명 :마우스 우 클릭 시 거리 측정 종료
 	파라메터 : evt (이벤트 객체)
 	리턴값 :
 	***********************************************************************/
    rightclick: function(evt) {
    	this.dblclick(evt);
    	return false;
    },
    
    /**********************************************************************
 	설명 :더블 클릭 시 거리 측정 종료.
 	파라메터 : evt (이벤트 객체)
 	리턴값 :
 	***********************************************************************/
    dblclick: function(evt) {
    	if(this.count < 3) {
			alert('면적은 3개 이상의 지점을 선택해야 합니다.');
			return false;
		}
    	if(this.map.popups[this.map.popups.length-1].type == this.layerName) {
			this.map.removePopup(this.map.popups[this.map.popups.length-1]);
		}
        var lonlat = this.map.getLonLatFromPixel(evt.xy);
        var measureArea = this.measureArea();
        var contentHtml = "<div class='olControlMeasurePopup olControlMeasurePopupEndPoly' >총면적 : <span class='MeasureColor'>"+ measureArea[0] +"</span>" + measureArea[1] + "</div>";
	    var popup = new BiesPopup("measurePopup", lonlat, new this.getBrowserSize(152, 22), contentHtml, new OpenLayers.Pixel(5,5));
		this.map.addPopup(popup);
		popup.type = this.layerName;
		popup.attributes = {
			print : true,
			contentHtml : "총면적 : " + measureArea[0] + measureArea[1],
			offsetX : 5,
			offsetY : 5
		};
		this.count = 0;
        if(!this.freehandMode(evt)) {
            this.removePoint();
            this.finalize();
        }
		if(this.popup) {
			this.map.removePopup(this.popup);
			this.popup = null;
		}
        return false;
    },
    
    /**********************************************************************
 	설명 :컨트롤 활성화
 	파라메터 : geometry - 공간객체
 	리턴값 :
 	***********************************************************************/
    activate: function() {
    	this.removeFeature();
        if(!OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            return false;
        }
        var options = OpenLayers.Util.extend({
            displayInLayerSwitcher: false,
            calculateInRange: OpenLayers.Function.True,
            wrapDateLine: this.citeCompliant
        }, this.layerOptions);
        this.layer = new BiesVector(this.layerName, options);
        this.map.addLayer(this.layer);
        return true;
    },
    
    /**********************************************************************
 	설명 :컨트롤 비 활성화
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
    deactivate: function() {
        if(!OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            return false;
        }
        if(this.drawing) {
        	this.count = 0;
        	this.removePopup();
            this.cancel();
        }
        if(!this.persistControl) {
        	this.layer.destroy(false);
			this.removePopup();
        }
        this.layer = null;
        return true;
    },
    
    /**********************************************************************
 	설명 : 도형, 팝업 삭제
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
    cleanFeature : function() {
		this.removeFeature();
		this.removePopup();
	},
	
	/**********************************************************************
 	설명 : 도형 삭제
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	removeFeature : function() {
		var layers = this.map.getLayersByName(this.layerName);
    	if(layers && layers.length > 0) {
    		this.map.removeLayer(layers[0]);
    		this.removePopup();
    	}
	},
    
    /**********************************************************************
 	설명 : 팝업 삭제
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
    removePopup : function() {
    	var len = this.map.popups.length;
		for(var i=len-1; i >= 0; i--) {
			if(this.map.popups[i].type == this.layerName) {
				this.map.removePopup(this.map.popups[i]);
			}
		}
	},
	
	/**********************************************************************
 	설명 :브라우저에 따라 화면 크기 픽셀 반환 - msie 의 경우 크기에 테두리 까지 포함 하므로 테두리 크기 2 제외 
 	파라메터 : width - 너비
 				 width - 높이
 	리턴값 : 브라우저에 따라 변환된 크기
 	***********************************************************************/
	getBrowserSize : function(width, height, move) {
		if(OpenLayers.BROWSER_NAME == "msie") {
			return new OpenLayers.Size(width-2, height-2);
		}
		else {
			if(move) {
				if(OpenLayers.BROWSER_NAME == "firefox") 
					return new OpenLayers.Size(width, height+9);
				else
					return new OpenLayers.Size(width, height+4);
			}
			else {
				return new OpenLayers.Size(width, height);	
			}
		}
	},
	
	
	
	CLASS_NAME: "BiesPolygonMeasure"
});

/**********************************************************************************
 * 설 명 : Popup 클래스
**********************************************************************************/
BiesPopup = OpenLayers.Class(OpenLayers.Popup, {
	
	/**
	 * 팝업을 거리를 두고 그림
	 */
	offsetPixel : null,
	
	 /**********************************************************************
 	설명 : BiesPopup 생성자
 	파라메터 : id - 팝업 아이디
 				 lonlat - 팝업을 표시할 좌표 객체
 				 contentSize - 팝업 크기
 				 contentHtml - 팝업 내용
 				 offsetPixel - 지정된 좌표로 부터 팝업을 표시할 픽셀 거리
 	리턴값 :
 	***********************************************************************/
	initialize:function(id, lonlat, contentSize, contentHTML, offsetPixel) {
		if(offsetPixel) {
			this.offsetPixel = offsetPixel;
		}
        if (id == null) {
            id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");
        }
        this.id = id;
        this.lonlat = lonlat;
        this.contentSize = (contentSize != null) ? contentSize 
                                  : new OpenLayers.Size(
                                                   OpenLayers.Popup.WIDTH,
                                                   OpenLayers.Popup.HEIGHT);
        if (contentHTML != null) { 
             this.contentHTML = contentHTML;
        }
        this.backgroundColor = OpenLayers.Popup.COLOR;
        this.opacity = OpenLayers.Popup.OPACITY;
        this.border = OpenLayers.Popup.BORDER;
        this.div = OpenLayers.Util.createDiv(this.id, null, null, 
                                             null, null, null, "hidden");
        this.div.className = this.displayClass;
        var groupDivId = this.id + "_GroupDiv";
        this.groupDiv = OpenLayers.Util.createDiv(groupDivId, null, null, 
                                                    null, "relative", null,
                                                    "hidden");
        var id = this.div.id + "_contentDiv";
        this.contentDiv = OpenLayers.Util.createDiv(id, null, this.contentSize.clone(), 
                                                    null, "relative");
        this.contentDiv.className = this.contentDisplayClass;
        this.groupDiv.appendChild(this.contentDiv);
        this.div.appendChild(this.groupDiv);
        this.registerEvents();
    },
	
    /**********************************************************************
 	설명 :팝업의 위치 반환
 	파라메터 : 
 	리턴값 : 팝업의 위치 (지도 좌표)
 	***********************************************************************/
	getLonLat : function() {
		return this.lonlat;
	},

	/**********************************************************************
 	설명 :offset 을 고려한 팝업 생성
 	파라메터 : px (화면 좌표)
 	리턴값 : 
 	***********************************************************************/
    moveTo: function(px) {
        if ((px != null) && (this.div != null)) {
			// x, y 좌표의 픽셀을 offset으로 지정한 값만큼 증가 시킴
	    	if(this.offsetPixel) {
				px = px.add(this.offsetPixel.x, this.offsetPixel.y);
	    	}
			
			this.div.style.left = px.x + "px";
        	this.div.style.top = px.y + "px";
        }
    },
		
	CLASS_NAME: "BiesPopup"
});

/**********************************************************************************
 * 설 명 : 사용자주제도 그리기 컨트롤
**********************************************************************************/
BiesDrawFeature = OpenLayers.Class(OpenLayers.Control.DrawFeature, {
	
	/**********************************************************************
 	설명 : 도형 그림
 	파라메터 : geometry - 공간객체
 				 attributes - 공간속성값
 	리턴값 : 
 	***********************************************************************/
	drawFeature: function(geometry, attributes) {
        var feature = new OpenLayers.Feature.Vector(geometry, attributes);
        var proceed = this.layer.events.triggerEvent(
            "sketchcomplete", {feature: feature}
        );
        if(proceed !== false) {
            feature.state = OpenLayers.State.INSERT;
            this.layer.addFeatures([feature]);
            this.featureAdded(feature);
            this.events.triggerEvent("featureadded",{feature : feature});
        }
    },
    CLASS_NAME: "BiesDrawFeature"
});

/**********************************************************************************
 * 설 명 : 사용자주제도 점 핸들러
**********************************************************************************/
BiesDrawPoint  = OpenLayers.Class(OpenLayers.Handler.Point, {
	/* 도형 속성 */
	attributes : null,
	
	/**********************************************************************
 	설명 : 도형그리기가 완료되었을 때 실행되는 함수
 	파라메터 : calcel - 취소여부
 	리턴값 : 
 	***********************************************************************/
	finalize: function(cancel) {
        var key = cancel ? "cancel" : "done";
        this.drawing = false;
        this.mouseDown = false;
        this.lastDown = null;
        this.lastUp = null;
        this.callback(key, [this.geometryClone(), this.attributes]);
        if(cancel || !this.persist) {
            this.destroyFeature();
        }
    },
	CLASS_NAME: "BiesDrawPoint"
});

/**********************************************************************************
 * 설 명 : 사용자주제도 선 핸들러
**********************************************************************************/
BiesDrawPath = OpenLayers.Class(OpenLayers.Handler.Path, {
	/* 도형 속성 */
	attributes : null,
	
	mousedown: function(evt) {
		OpenLayers.Handler.Path.prototype.mousedown.apply(this, [evt]);
        if(evt.button == "2") {
        	this.dblclick(evt);
	        return true;
		}
        return false;
	},
	
	/**********************************************************************
 	설명 : 도형그리기가 완료되었을 때 실행되는 함수
 	파라메터 : calcel - 취소여부
 	리턴값 : 
 	***********************************************************************/
	finalize : function(cancel) {
		var key = cancel ? "cancel" : "done";
		this.drawing = false;
		this.mouseDown = false;
		this.lastDown = null;
		this.lastUp = null;
		this.callback(key, [ this.geometryClone(), this.attributes ]);
		if (cancel || !this.persist) {
			this.destroyFeature();
		}
	},
	CLASS_NAME: "BiesDrawPath"
});

/**********************************************************************************
 * 설 명 : 사용자주제도 정규도형 핸들러
**********************************************************************************/
BiesDrawRegularPolygon = OpenLayers.Class(OpenLayers.Handler.RegularPolygon, {
	/* 도형 속성 */
	attributes : null,
	
	mousedown: function(evt) {
		OpenLayers.Handler.RegularPolygon.prototype.mousedown.apply(this, [evt]);
        if(evt.button == "2") {
        	this.dblclick(evt);
	        return true;
		}
        return false;
	},
	
	/**********************************************************************
 	설명 : 도형그리기가 완료되었을 때 실행되는 함수
 	파라메터 : name - 상태명
 				 args - 부가정보
 	리턴값 : 
 	***********************************************************************/
	callback: function (name, args) {
        // override the callback method to always send the polygon geometry
        if (this.callbacks[name]) {
            this.callbacks[name].apply(this.control,
                                       [this.feature.geometry.clone(), this.attributes]);
        }
        // since sketch features are added to the temporary layer
        // they must be cleared here if done or cancel
        if(!this.persist && (name == "done" || name == "cancel")) {
            this.clear();
        }
    },
	CLASS_NAME: "BiesDrawRegularPolygon"
});

/**********************************************************************************
 * 설 명 : 사용자주제도 다각형 핸들러
**********************************************************************************/
BiesDrawPolygon = OpenLayers.Class(OpenLayers.Handler.Polygon, {
	/* 도형 속성 */
	attributes : null,
	
	mousedown: function(evt) {
		OpenLayers.Handler.Polygon.prototype.mousedown.apply(this, [evt]);
        if(evt.button == "2") {
        	this.dblclick(evt);
	        return true;
		}
        return false;
	},
	
	/**********************************************************************
 	설명 : 도형그리기가 완료되었을 때 실행되는 함수
 	파라메터 : calcel - 취소여부
 	리턴값 : 
 	***********************************************************************/
	finalize: function(cancel) {
        var key = cancel ? "cancel" : "done";
        this.drawing = false;
        this.mouseDown = false;
        this.lastDown = null;
        this.lastUp = null;
        this.callback(key, [this.geometryClone(), this.attributes]);
        if(cancel || !this.persist) {
            this.destroyFeature();
        }
    },
	CLASS_NAME: "BiesDrawPolygon"
});
	
/**********************************************************************************
 * 설 명 : 사용자주제도 선택&편집 컨트롤
**********************************************************************************/
BiesModifyFeature = OpenLayers.Class(OpenLayers.Control.ModifyFeature, {
	
	/* 편집 시 도형스타일 */
	virtualStyle : {
		pointRadius: 4,
        graphicName: "square",
        fillColor: "#ffffff",
        fillOpacity: 0.5,
        strokeWidth: 1,
        strokeOpacity: 0.8,
        strokeColor: "#333333"
	},
	
	/* 점 편집 시 도형스타일 */
	vertexStyle : {
		pointRadius: 4,
        graphicName: "square",
        fillColor: "#ffffff",
        fillOpacity: 1,
        strokeWidth: 1,
        strokeOpacity: 1,
        strokeColor: "#333333"
    },
	
    /* 이동 스타일 */
	dragStyle : {
		graphicOpacity : 1,
		externalGraphic : "/gis/images/userlayer/move.png",
		graphicWidth : 16,
		graphicHeight :  16
	},
	
	/* 크기변환 스타일 */
	resizeStyle : {
		graphicOpacity : 1,
		externalGraphic : "/gis/images/userlayer/resize.png",
		graphicWidth : 16,
		graphicHeight :  16
    },
	
    /* 회전 스타일 */
	rotateStyle : {
		graphicOpacity : 1,
		externalGraphic : "/gis/images/userlayer/rotate.png",
		graphicWidth : 16,
		graphicHeight :  16
    },
	
    /**********************************************************************
 	설명 : 편집 클래스 초기화 함수
 	파라메터 : layer - 레이어명
 				 options - 레이어옵션들
 	리턴값 : 
 	***********************************************************************/
    initialize: function(layer, options) {
        options = options || {};
        this.layer = layer;
        this.vertices = [];
        this.virtualVertices = [];
        
        this.deleteCodes = [46, 68];
        this.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        if(!(OpenLayers.Util.isArray(this.deleteCodes))) {
            this.deleteCodes = [this.deleteCodes];
        }
        var control = this;

        // configure the select control
        var selectOptions = {
            geometryTypes: this.geometryTypes,
            clickout: this.clickout,
            toggle: this.toggle,
            onBeforeSelect: this.beforeSelectFeature,
            onSelect: this.selectFeature,
            onUnselect: this.unselectFeature,
            scope: this
        };
        if(this.standalone === false) {
            this.selectControl = new OpenLayers.Control.SelectFeature(
                layer, selectOptions
            );
        }

        // configure the drag control
        var dragOptions = {
            geometryTypes: ["OpenLayers.Geometry.Point"],
            onStart: function(feature, pixel) {
                control.dragStart.apply(control, [feature, pixel]);
            },
            onDrag: function(feature, pixel) {
                control.dragVertex.apply(control, [feature, pixel]);
            },
            onComplete: function(feature) {
                control.dragComplete.apply(control, [feature]);
            },
            featureCallbacks: {
                over: function(feature) {
                    /**
                     * In normal mode, the feature handler is set up to allow
                     * dragging of all points.  In standalone mode, we only
                     * want to allow dragging of sketch vertices and virtual
                     * vertices - or, in the case of a modifiable point, the
                     * point itself.
                     */
                    if(control.standalone !== true || feature._sketch ||
                       control.feature === feature) {
                        control.dragControl.overFeature.apply(
                            control.dragControl, [feature]);
                    }
                }
            }
        };
        this.dragControl = new OpenLayers.Control.DragFeature(
            layer, dragOptions
        );

        // configure the keyboard handler
        var keyboardOptions = {
            keydown: this.handleKeypress
        };
        this.handlers = {
            keyboard: new OpenLayers.Handler.Keyboard(this, keyboardOptions)
        };
    },
    
    /**********************************************************************
 	설명 : 점 편집 심볼 스타일 변경
 	파라메터 :
 	리턴값 : 
 	***********************************************************************/
    collectVertices: function() {
        this.vertices = [];
        this.virtualVertices = [];        
        var control = this;
        function collectComponentVertices(geometry) {
            var i, vertex, component, len;
            if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                vertex = new OpenLayers.Feature.Vector(geometry);
                vertex._sketch = true;
                vertex.renderIntent = control.vertexRenderIntent;
                control.vertices.push(vertex);
            } else {
                var numVert = geometry.components.length;
                if(geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
                    numVert -= 1;
                }
                for(i=0; i<numVert; ++i) {
                    component = geometry.components[i];
                    if(component.CLASS_NAME == "OpenLayers.Geometry.Point") {
                    	// 편집 점 스타일 적용
                        //vertex = new OpenLayers.Feature.Vector(component);
                    	vertex = new OpenLayers.Feature.Vector(component, null, control.vertexStyle);
                        vertex._sketch = true;
                        vertex.renderIntent = control.vertexRenderIntent;
                        control.vertices.push(vertex);
                    } else {
                        collectComponentVertices(component);
                    }
                }
                
                // add virtual vertices in the middle of each edge
                if (control.createVertices && geometry.CLASS_NAME != "OpenLayers.Geometry.MultiPoint") {
                    for(i=0, len=geometry.components.length; i<len-1; ++i) {
                        var prevVertex = geometry.components[i];
                        var nextVertex = geometry.components[i + 1];
                        if(prevVertex.CLASS_NAME == "OpenLayers.Geometry.Point" &&
                           nextVertex.CLASS_NAME == "OpenLayers.Geometry.Point") {
                            var x = (prevVertex.x + nextVertex.x) / 2;
                            var y = (prevVertex.y + nextVertex.y) / 2;
                            var point = new OpenLayers.Feature.Vector(
                                new OpenLayers.Geometry.Point(x, y),
                                null, control.virtualStyle
                            );
                            // set the virtual parent and intended index
                            point.geometry.parent = geometry;
                            point._index = i + 1;
                            point._sketch = true;
                            control.virtualVertices.push(point);
                        }
                    }
                }
            }
        }
        collectComponentVertices.call(this, this.feature.geometry);
        this.layer.addFeatures(this.virtualVertices, {silent: true});
        this.layer.addFeatures(this.vertices, {silent: true});
    },
    
    /**********************************************************************
 	설명 : 이동 심볼 스타일 변경
 	파라메터 :
 	리턴값 : 
 	***********************************************************************/
    collectDragHandle: function() {
        var geometry = this.feature.geometry;
        var center = geometry.getBounds().getCenterLonLat();
        var originGeometry = new OpenLayers.Geometry.Point(
            center.lon, center.lat
        );
        
        // 이동 심볼 스타일 변경
        //var origin = new OpenLayers.Feature.Vector(originGeometry);
        var origin = new OpenLayers.Feature.Vector(originGeometry, null, this.dragStyle);
        originGeometry.move = function(x, y) {
            OpenLayers.Geometry.Point.prototype.move.call(this, x, y);
            geometry.move(x, y);
        };
        origin._sketch = true;
        this.dragHandle = origin;
        this.dragHandle.renderIntent = this.vertexRenderIntent;
        this.layer.addFeatures([this.dragHandle], {silent: true});
    },
    
    /**********************************************************************
 	설명 : 회전, 크기 심볼 스타일 변경
 	파라메터 :
 	리턴값 : 
 	***********************************************************************/
    collectRadiusHandle: function() {
        var geometry = this.feature.geometry;
        var bounds = geometry.getBounds();
        var center = bounds.getCenterLonLat();
        var originGeometry = new OpenLayers.Geometry.Point(
            center.lon, center.lat
        );
        var radiusGeometry = new OpenLayers.Geometry.Point(
            bounds.right, bounds.bottom
        );
        var radius;
		//회전 일 경우 rotateStyle 적용
        if((this.mode & OpenLayers.Control.ModifyFeature.ROTATE)) {
        	radius = new OpenLayers.Feature.Vector(radiusGeometry, null, this.rotateStyle);
        }
        //크기조절 일 경우 resizeStyle 적용
        else {
        	radius = new OpenLayers.Feature.Vector(radiusGeometry, null, this.resizeStyle);
        }
		
        var resize = (this.mode & OpenLayers.Control.ModifyFeature.RESIZE);
        var reshape = (this.mode & OpenLayers.Control.ModifyFeature.RESHAPE);
        var rotate = (this.mode & OpenLayers.Control.ModifyFeature.ROTATE);

        radiusGeometry.move = function(x, y) {
            OpenLayers.Geometry.Point.prototype.move.call(this, x, y);
            var dx1 = this.x - originGeometry.x;
            var dy1 = this.y - originGeometry.y;
            var dx0 = dx1 - x;
            var dy0 = dy1 - y;
            if(rotate) {
                var a0 = Math.atan2(dy0, dx0);
                var a1 = Math.atan2(dy1, dx1);
                var angle = a1 - a0;
                angle *= 180 / Math.PI;
                geometry.rotate(angle, originGeometry);
            }
            if(resize) {
                var scale, ratio = null;
                // 'resize' together with 'reshape' implies that the aspect 
                // ratio of the geometry will not be preserved whilst resizing 
                if (reshape) {
                    scale = dy1 / dy0;
                    ratio = (dx1 / dx0) / scale;
                } else {
                    var l0 = Math.sqrt((dx0 * dx0) + (dy0 * dy0));
                    var l1 = Math.sqrt((dx1 * dx1) + (dy1 * dy1));
                    scale = l1 / l0;
                }
                geometry.resize(scale, originGeometry, ratio);
            }
        };
        radius._sketch = true;
        this.radiusHandle = radius;
        this.layer.addFeatures([this.radiusHandle], {silent: true});
    },
	
	CLASS_NAME: "BiesModifyFeature"
});

/**********************************************************************************
 * 설 명 : 사용자주제도 클래스
**********************************************************************************/
UserContent = OpenLayers.Class({
	/* 객체 이름 */
	name : null, 
	/* 지도 객체 참조 변수 */
	map : null, 
	/* 레이어 객체 (Vector) */
	layer : null, 
	/* 임시 (추가중인) 도형 */
	feature : null, 
	/* 사용자이미지 파일명 */
	image : {
		externalGraphic : null,
		graphicWidth : null,
		graphicHeight : null
	},
	/* default style 객체 (스타일 변경 가능 하도록 변수로 정의) */
	style : new OpenLayers.Style(null, {
		rules : [
			//점 스타일
			new OpenLayers.Rule( {
				symbolizer : {
					pointRadius: "\${pointRadius}",		//크기
					//그래픽 이름  "circle", "square", "star", "x", "cross", "triangle" 지원
					//저장 기능에서는 circle, square 만 지원
					graphicName: "\${graphicName}",
					fillColor: "\${fillColor}",			//면 색상
					fillOpacity: "\${fillOpacity}",		//면 투명도
					strokeWidth: "\${strokeWidth}",		//선 굵기
					strokeOpacity: "\${strokeOpacity}",	//선 투명도
					strokeColor: "\${strokeColor}"		//선 색
				},
				filter : new OpenLayers.Filter.Comparison( {
					type : "==",
					property : "featureType",
					value : "point"
				})
			}),
			//선 스타일
			new OpenLayers.Rule( {
				symbolizer : {
					strokeColor : "\${strokeColor}", //색
					strokeWidth : "\${strokeWidth}", //굵기
					strokeOpacity : "\${strokeOpacity}" //투명도
				},
				filter : new OpenLayers.Filter.Comparison( {
					type : "==",
					property : "featureType",
					value : "line"
				})
			}),
			//도형 스타일
			new OpenLayers.Rule( {
				symbolizer : {
					fillColor : "\${fillColor}", //면 색
					fillOpacity : "\${fillOpacity}", //면 투명도
					strokeColor : "\${strokeColor}", //선 색
					strokeWidth : "\${strokeWidth}", //선 굵기
					strokeOpacity : "\${strokeOpacity}" //선 투명도
				},
				filter : new OpenLayers.Filter.Comparison( {
					type : "==",
					property : "featureType",
					value : "polygon"
				})
			}),
			//이미지 스타일
			new OpenLayers.Rule( {
				symbolizer : {
					graphicOpacity : "\${graphicOpacity}", //투명도
					externalGraphic : "\${externalGraphic}", //이미지
					graphicWidth : "\${graphicWidth}", //너비
					graphicHeight : "\${graphicHeight}", // 높이
					graphicRotate : "\${graphicRotate}" // 회전
				},
				filter : new OpenLayers.Filter.Comparison( {
					type : "==",
					property : "featureType",
					value : "marker"
				})
			}),
			//이미지 스타일
			new OpenLayers.Rule( {
				symbolizer : {
					graphicOpacity : "\${graphicOpacity}", //투명도
					externalGraphic : "\${externalGraphic}", //이미지
					graphicWidth : "\${graphicWidth}", //너비
					graphicHeight : "\${graphicHeight}" // 높이
				},
				filter : new OpenLayers.Filter.Comparison( {
					type : "==",
					property : "featureType",
					value : "image"
				})
			})
		]
	}),
	
	/* 편집 선택 시 보여줄 스타일 */
	selStyle : new OpenLayers.Style({
		fillColor: "#0000ff",
        fillOpacity: 0.4, 
        strokeColor: "#0000ff",
        strokeOpacity: 1,
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        pointRadius: 6,
        graphicName: "square",
        cursor: "pointer",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3
	}),
	
	/* 기본 스타일 리스트 (초기 스타일 값) */
	attributesList : {
		// 점형
		'point' : {
			featureType : "point",
			pointRadius : 6,
			graphicName: "square",
			fillColor : "#ffffff",
			fillOpacity : 1,
			strokeWidth : 1,
			strokeOpacity : 1,
			strokeColor : "#333333"
		},
		
		// 선형
		'line' : {
			featureType : "line",
			strokeColor : "#000000",
			strokeWidth : 5,
			strokeOpacity : 1
		},
		
		// 면형
		'polygon' : {
			featureType : "polygon",
			fillColor : "#ffffff",
			fillOpacity : 0.5,
			strokeColor : "#000000",
			strokeWidth : 2,
			strokeOpacity : 1
		},
		
		// 마커
		'marker' : {
			featureType : "marker",
			graphicOpacity : 1,
			externalGraphic : "http://uiscloud.iptime.org:8180/geoserver"+"/www/symbol/symbol.png",
			graphicWidth : 32,
			graphicHeight :  32
		},
		
		// 이미지
		'image' : {
			featureType : "image",
			graphicOpacity : 1,
			externalGraphicBase : null,
			externalGraphic : "/gis/images/etc/blank.gif",
			graphicWidth : 32,
			graphicHeight :  32,
			graphicRotate : 0
		}
	},
	
	/* 컨트롤 목록 */
	controls : {
		// 점형
		"point" : {
			name : "point",
			type : "draw",
			featureType : "point",
			handler : BiesDrawPoint
		}, 
		
		// 선형
		"line" : {
			name : "line",
			type : "draw",
			featureType : "line",
			handler : BiesDrawPath
		}, 
		
		// 면형
		"polygon" : {
			name : "polygon",
			type : "draw",
			featureType : "polygon",
			handler : BiesDrawPolygon
		},
		
		// 마커
		"marker" : {
			name : "marker",
			type : "draw",
			featureType : "marker",
			handler : BiesDrawPoint
		},
		
		// 사용자 이미지
		"userimage" : {
			name : "userimage",
			type : "draw",
			featureType : "image",
			handler : BiesDrawPoint
		},
		
		// 편집
		"edit" : {
			name : "edit",
			type : "edit",
			addControl : function(ctr, opt) {
				this.control = new BiesModifyFeature(ctr.layer, {
					id : ctr.name + "_" + this.name,
					vertexRenderIntent : "select",
					mode : OpenLayers.Control.ModifyFeature.DRAG | OpenLayers.Control.ModifyFeature.RESIZE | OpenLayers.Control.ModifyFeature.ROTATE
				});
				ctr.map.addControl(this.control);
				
				if(opt && opt.onModificationStart) {
					this.control.onModificationStart = function(feature) {
						ctr.feature = feature;
						opt.onModificationStart(feature);
					};
				}
				if(opt && opt.onModificationEnd) {
					this.control.onModificationEnd = opt.onModificationEnd;
				}
			}
		}
	},
	
	/**********************************************************************
 	설명 : 사용자주제도 (글상자 제외) 클래스
 	파라메터 : name - 사용자주제도 객체명
 				 map - 지도객체
 				 opt - 옵션
 	리턴값 : 
 	***********************************************************************/
	initialize : function(name, map, opt) {
		var ctr = this;
		ctr.name = name;
		ctr.map = map;
		
		// 레이어 등록
		ctr.layer = new BiesVector(
			name + "_layer",
			{
				styleMap : new OpenLayers.StyleMap({
					"default" : ctr.style,
					"select" : ctr.selStyle
				})
			}
		);
		map.addLayer(ctr.layer);
		for(var i in ctr.controls) {
			if(ctr.controls[i].type == "draw") {
				var control = ctr.controls[i];
				
				var drawControl = new BiesDrawFeature(ctr.layer, control.handler, {
					id : ctr.name + "_" + control.name,
					handlerOptions : {
						attributes : ctr.attributesList[control.featureType]
					}
				});
				map.addControl(drawControl);
				
				// 도형 추가 이벤트 등록
				if(opt && opt.featureAdded) {
					drawControl.featureAdded = function(feature) {
						opt.featureAdded(feature);
						ctr.feature = feature;
					};
				}
			}
			else if(ctr.controls[i].type == "edit") {
				ctr.controls[i].addControl(ctr, opt);
			}
		}
	},
	
	/**********************************************************************
 	설명 : 도형 그리기 중 취소 하였을때 실행되는 함수
 	파라메터 : 
 	리턴값 : 
 	***********************************************************************/
	cancel : function() {
		this.layer.removeAllFeatures();
		if(this.feature) {
			this.feature = null;
		}
	},
	
	/**********************************************************************
 	설명 : 현재 선택 중인 도형 반환
 	파라메터 : 
 	리턴값 : 
 	***********************************************************************/
	getFeature : function() {
		var result = null;
		if(this.feature) {
			result = this.feature;
		}
		return result;
	},
	
	/**********************************************************************
 	설명 : 현재 선택 중인 도형 삭제
 	파라메터 : 
 	리턴값 : 
 	***********************************************************************/
	deleteFeature : function() {
		if(this.feature) {
			this.map.getControl("usercontent_edit").unselectFeature(this.feature);
			this.layer.removeFeatures(this.feature);
			this.feature = null;
		}
	},
	
	/**********************************************************************
 	설명 : 현재 선택 중인 도형 해제
 	파라메터 : bShow - 화면에서 보이는 선택 효과만 제거
 	리턴값 : 
 	***********************************************************************/
	unSelectFeature : function(bShow) {
		if(this.feature) {
			this.map.getControl(this.name + "_edit").unselectFeature(this.feature);
			this.feature.renderIntent = "default";
			// 화면에서 보이는것만 지우는지 여부 
			if(!bShow) {
				this.feature = null;	
			}
		}
	},
	
	/**********************************************************************
 	설명 : 이미지 객체 설정
 	파라메터 : externalGraphic	- 이미지 주소
 			   graphicWidth		- 이미지 너비
 			   graphicHeight	- 이미지 높이
 	리턴값 : 
 	***********************************************************************/
	setImage : function(externalGraphic, graphicWidth, graphicHeight) {
		this.image = {
			externalGraphicBase : externalGraphic,
			externalGraphic : externalGraphic,
			graphicWidth : graphicWidth,
			graphicHeight : graphicHeight
		};
	},
	
	/**********************************************************************
 	설명 : 이미지 객체 설정
 	파라메터 : user - 사용자 아이디
 	리턴값 : 	externalGraphic	- 이미지 주소
 			 	graphicWidth		- 이미지 너비
 			   	graphicHeight	- 이미지 높이
 	***********************************************************************/
	getImage : function(user) {
		return {
			externalGraphicBase : "/gis/fileDownload?requestedFile=" + encodeURIComponent(this.image.externalGraphic) + "&userId=" + user,
			externalGraphic : "/gis/fileDownload?requestedFile=" + encodeURIComponent(this.image.externalGraphic) + "&userId=" + user,
			graphicWidth : this.image.graphicWidth,
			graphicHeight : this.image.graphicHeight
		};
	},
	
	/**********************************************************************
 	설명 : 이미지 객체 초기화
 	파라메터 : 
 	리턴값 : 
 	***********************************************************************/
	clearImage : function() {
		this.image = {
			externalGraphic : null,
			graphicWidth : null,
			graphicHeight : null
		};
	},
	
	CLASS_NAME: "UserContent"
});


/**********************************************************************************
 * 설 명 : 사용자 글상자 컨트롤
**********************************************************************************/
BiesTextBoxControl = OpenLayers.Class(OpenLayers.Control.DrawFeature, {
	
	/**********************************************************************
 	설명 : 도형 그림
 	파라메터 : geometry - 공간객체
 				 attributes - 공간속성값
 	리턴값 : 
 	***********************************************************************/
	drawFeature: function(geometry, attributes) {
        var feature = new OpenLayers.Feature.Vector(geometry, attributes);
        var proceed = this.layer.events.triggerEvent(
            "sketchcomplete", {feature: feature}
        );
        if(proceed !== false) {
            feature.state = OpenLayers.State.INSERT;
            this.layer.addFeatures([feature]);
            this.featureAdded(feature);
            this.events.triggerEvent("featureadded",{feature : feature});
        }
    },
    CLASS_NAME: "BiesTextBoxControl"
});

/**********************************************************************************
 * 설 명 : 사용자주제도 클래스
**********************************************************************************/
BiesTextBox = OpenLayers.Class({
	
	/* 객체 이름 */
	name : null, 
	/* 지도 객체 참조 변수 */
	map : null, 
	/* 레이어 객체 (Vector) */
	layer : null,
	/* 옵션 */
	options : null,
	
	/* 글상자 도구 컨트롤 */
	control : null,

	/* 입력/수정 팝업 */
	popup : null,
	
	/* 글상자 팝업 리스트 */
	popups : [],
	
	/**********************************************************************
 	설명 : 사용자주제도 (글상자 제외) 클래스
 	파라메터 : name - 사용자주제도 객체명
 				 map - 지도객체
 				 opt - 옵션
 	리턴값 : 
 	***********************************************************************/
	initialize : function(name, map, opt) {
		var ntb = this;
		ntb.name = name;
		ntb.map = map;
		ntb.options = opt;
		
		ntb.layer = new OpenLayers.Layer.Vector(name + "_layer");
		map.addLayer(ntb.layer);
	
		ntb.control = new BiesTextBoxControl(ntb.layer, BiesDrawPoint, {
			id : ntb.name,
			featureAdded : function(feature) {
				var lonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
				ntb.addPopup(lonlat.lon, lonlat.lat, null, "#000000", "Dotum");
				ntb.layer.removeFeatures(feature);
				if(opt && opt.featureAdded) {
					opt.featureAdded(ntb.popup);
				}
			}
		});
		ntb.map.addControl(ntb.control);
	},
	
	/**********************************************************************
 	설명 : 속성 배열로 팝업 생성
 	파라메터 : attrs - 팝업 속성 배열
 	리턴값 : 
 	***********************************************************************/
	addPopupsByAttrs : function(attrs) {
		for(var i in attrs) {
			this.addPopup(attrs[i].lon, attrs[i].lat, attrs[i].contentHtml, attrs[i].fontColor, attrs[i].fontFamily);
		}
		this.popup = null;
		this.hide();
	},
	
	/**********************************************************************
 	설명 : 팝업 생성
 	파라메터 : 	lon 		- 경도
 				lat			- 위도
 				contentHtml	- 팝업내용
 				fontColor	- 색상
 				fontFamily	- 글꼴
 	리턴값 : 
 	***********************************************************************/
	addPopup : function(lon, lat, contentHtml, fontColor, fontFamily) {
		var ntb = this;
		
		var tagString = "글상자";
		if(contentHtml) {
			tagString = contentHtml;	
		}

		var contentHtmlTag = '<div class="divDrawShowBox">' + tagString + '</div>';
		var lonlat = new OpenLayers.LonLat(lon, lat);
		var popup = new OpenLayers.Popup(null, lonlat, null, contentHtmlTag);
		popup.type = ntb.name;
		popup.attributes = {
			contentHtml : contentHtml?contentHtml:"글상자",
			lon : lonlat.lon,
			lat : lonlat.lat,
			featureType : "textbox",
			fontColor : fontColor,
			fontSize : "12px",
			fontFamily : fontFamily,
			print : true
		};
		popup.autoSize = true;
		ntb.map.addPopup(popup);
		ntb.popup = popup;
		this.popups.push(popup);
		
		$(popup.div).click(function() {
			ntb.popup = popup;
			ntb.selectPopup();
		});
	},
	
	hide : function() {
		for(var i in this.popups) {
			if(this.popups[i] != this.popup) {
				this.popups[i].hide();
			}
		}
	},
	
	show : function() {
		for(var i in this.popups) {
			this.popups[i].show();
		}
	},
	
	/**********************************************************************
 	설명 : 선택중인 팝업 반환
 	파라메터 : 
 	리턴값 : 선택중인 팝업
 	***********************************************************************/
	getPopup : function() {
		if(this.popup) {
			return this.popup;	
		}
		return null;
	},
	
	/**********************************************************************
 	설명 : 선택중인 팝업 삭제
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	deletePopup : function() {
		if(this.popup) {
			this.map.removePopup(this.popup);
			this.popup = null;
		}
	},

	/**********************************************************************
 	설명 : 팝업 선택
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	selectPopup : function() {
		if(this.popup && this.options && this.options.onModificationStart) {
			$(".divDrawShowBox").css("border-color", "#cccccc");
			$(this.popup.div).find(".divDrawShowBox").css("border-color", "#0000ff");
			this.options.onModificationStart(this.popup);
		}
	},
	
	/**********************************************************************
 	설명 : 팝업 선택 해제
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	unSelectPopup : function(bShow) {
		if(this.popup) {
			$(".divDrawShowBox").css("border-color", "#cccccc");
			// 화면에서 보이는것만 지우는지 여부 
			if(!bShow) {
				this.popup = null;	
			}
		}
	},
	
	/**********************************************************************
 	설명 : 팝업 그리기 취소
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	cancel : function() {
		for(var i=this.popups.length-1; i >= 0; i--) {
			this.map.removePopup(this.popups[i]);
		}
		this.popups = [];
		if(this.popup) {
			this.popup = null;
		}
	},
	
	/**********************************************************************
 	설명 : 팝업 스타일 적용해서 다시 그림
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	redraw : function() {
		for(var i=0, len=this.popups.length; i < len; i++) {
			var attrs = this.popups[i].attributes;
			var content = attrs.contentHtml;
			content = content.replace(/\x20/gi, "&nbsp;");
			content = content.replace(/\x0D\x0A/gi, "<br/>");
			content = content.replace(/\x0D/gi, "<br/>");
			content = content.replace(/\n/gi, "<br/>");
			var contentHtml = '<div class="divDrawShowBox" style="';
			contentHtml += 'font-family' + ':' + attrs["fontFamily"] + ";";
			contentHtml += 'color' + ':' + attrs["fontColor"] + ";";
			contentHtml += '">';
			contentHtml += content;
			contentHtml += '</div>';
			this.popups[i].setContentHTML(contentHtml);
		}
	},

	CLASS_NAME: "BiesTextBox"
});

/**********************************************************************************
 * 설 명 : BiesVector 클래스
**********************************************************************************/
BiesVector = OpenLayers.Class(OpenLayers.Layer.Vector, {

	/**********************************************************************
 	설명 : 동적 변수를 적용한 도형 스타일의 실제 스타일을 반환
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	parseStyle : function(feature, style) {
		// don't try to draw the feature with the renderer if the layer is not 
	    // drawn itself

	    if (typeof style != "object") {
	        if(!style && feature.state === OpenLayers.State.DELETE) {
	            style = "delete";
	        }
	        var renderIntent = style || feature.renderIntent;
	        style = feature.style || this.style;
	        if (!style) {
	            style = this.styleMap.createSymbolizer(feature, renderIntent);
	        }
	    }

		return style;
	},
	
	CLASS_NAME: "BiesVector"
});

/**********************************************************************************
 * 설 명 : BiesSaveMap 클래스
**********************************************************************************/
BiesSaveMap =OpenLayers.Class( {
	
	/* 지도 객체 */
	map : null,
	
	/* 지도 XML */
	xml : null,

	/**********************************************************************
 	설명 : 지도 저장 초기화
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	initialize : function(map) {
		this.map = map;
	},
	
	/**********************************************************************
 	설명 : 지도를 표현한 XML 반환
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	getXML : function() {
		this.xml = "<ROOT>";
		
		this.parseMap();
		this.parseLayer();
		this.parsePopup();

		this.xml += "</ROOT>";
		
		return this.xml;
	},
	
	/**********************************************************************
 	설명 : 지도 객체 XML 생성
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	parseMap : function() {
		this.xml += "<MAP>";
		
		var params = {
			left : this.map.getExtent().left,
			bottom : this.map.getExtent().bottom,
			right : this.map.getExtent().right,
			top : this.map.getExtent().top,
			width : this.map.getSize().w,
			height : this.map.getSize().h,
			resolution : this.map.getResolution()
		};
		
		this.write(params);

		this.xml += "</MAP>";
	},
	
	/**********************************************************************
 	설명 : 레이어 객체 XML 생성
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	parseLayer : function() {
		for ( var i = 0; i < this.map.layers.length; i++) {
			// TMS 레이어
			if ((this.map.layers[i].CLASS_NAME == "OpenLayers.Layer.DaumHybrid"
					|| this.map.layers[i].CLASS_NAME == "OpenLayers.Layer.DaumStreet"
					|| this.map.layers[i].CLASS_NAME == "OpenLayers.Layer.DaumPhysical"
					|| this.map.layers[i].CLASS_NAME == "OpenLayers.Layer.DaumSatellite")
					&& this.map.layers[i].visibility) {
				this.xml += '<LAYER type="TMS">';
				var scaleLevel = this.map.numZoomLevels - this.map.layers[i].getServerZoom() - 4;
				if(this.map.getZoom() >= 14)
					scaleLevel = 0;
				var params = {
					url : this.map.layers[i].url[0],
					layername : this.map.layers[i].layername,
					scaleLevel : scaleLevel,
					maxLeft : this.map.layers[i].maxExtent.left,
					maxBottom : this.map.layers[i].maxExtent.bottom,
					maxRight : this.map.layers[i].maxExtent.right,
					maxTop : this.map.layers[i].maxExtent.top,
					extension : this.map.layers[i].extension,
					tileSizeW : this.map.layers[i].tileSize.w,
					tileSizeH : this.map.layers[i].tileSize.h
				};
				this.write(params);
				this.xml += "</LAYER>";
			}
			// WMS 레이어
			else if (this.map.layers[i].CLASS_NAME == "OpenLayers.Layer.WMS" && this.map.layers[i].visibility) {
				this.xml += '<LAYER type="WMS">';
				var params = {
					url : this.map.layers[i].url,
					layers : this.map.layers[i].params.LAYERS,
					styles : this.map.layers[i].params.STYLES,
					format : this.map.layers[i].params.FORMAT,
					version : this.map.layers[i].params.VERSION,
					crs : this.map.layers[i].params.CRS,
					service : this.map.layers[i].params.SERVICE,
					request : this.map.layers[i].params.REQUEST,
					exceptions : this.map.layers[i].params.EXCEPTIONS
				};
				this.write(params);
				this.xml += "</LAYER>";
			}
			else if(this.map.layers[i].CLASS_NAME == "OpenLayers.Layer.Markers" && this.map.layers[i].visibility) {
				var layer = this.map.layers[i];
				if(layer.markers && layer.markers.length > 0) {
					this.xml += '<LAYER type="VECTOR">';
					for(var j=0, jLen=layer.markers.length; j < jLen; j++) {
						var offset = new OpenLayers.LonLat(parseInt(12*layer.map.getResolution()), parseInt(layer.markers[j].icon.size.h/2*layer.map.getResolution()));
						var params = {
							x : layer.markers[j].lonlat.lon + offset.lon,
							y : layer.markers[j].lonlat.lat + offset.lat,
							featureType : "image",
							opacity : 1,
							width : layer.markers[j].icon.size.w,
							height : layer.markers[j].icon.size.h,
							image : encodeURIComponent(layer.markers[j].icon.url)
						};
						this.xml += '<FEATURE type="point">';
						this.write(params);
						this.xml += "</FEATURE>";
					}
					this.xml += "</LAYER>";
				}
			}
			// Vector 레이어
			else if (this.map.layers[i].CLASS_NAME == "BiesVector" && this.map.layers[i].visibility) {
				this.xml += '<LAYER type="VECTOR">';
				
				for(var j=0; j < this.map.layers[i].features.length; j++) {
					if(this.map.layers[i].features[j].geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
						var params = null;
						var style = this.map.layers[i].parseStyle(this.map.layers[i].features[j]);
						
						if(this.map.layers[i].features[j].attributes.featureType == "image" || this.map.layers[i].features[j].attributes.featureType == "marker") {
							params = {
								x : this.map.layers[i].features[j].geometry.x,
								y : this.map.layers[i].features[j].geometry.y,
								featureType : "image",
								opacity : style.graphicOpacity,
								width : style.graphicWidth,
								height : style.graphicHeight,
								image : encodeURIComponent(style.externalGraphic)
							};
						}
						else {
							
							if(!(style.graphicName == "circle" || style.graphicName == "square")) {
								style.graphicName == "circle";
							}
							
							params = {
								x : this.map.layers[i].features[j].geometry.x,
								y : this.map.layers[i].features[j].geometry.y,
								featureType : "point",
								radius : style.pointRadius,
								graphicName : style.graphicName,
								stroke : style.strokeWidth,
								color : style.strokeColor,
								opacity : style.strokeOpacity,
								fillColor : style.fillColor,
								fillOpacity : style.fillOpacity
							};
						}
						
						this.xml += '<FEATURE type="point">';
						
						this.write(params);
						
						this.xml += "</FEATURE>";
					}
					else if(this.map.layers[i].features[j].geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
						
						var style = this.map.layers[i].parseStyle(this.map.layers[i].features[j]);

						if(this.map.layers[i].features[j].attributes.featureType == "arrow") {
							this.xml += '<FEATURE type="arrow">';
						}
						else {
							this.xml += '<FEATURE type="lineString">';
						}

						var x = [];
						var y = [];

						for(var k = 0; k < this.map.layers[i].features[j].geometry.components.length; k++) {
							x.push(this.map.layers[i].features[j].geometry.components[k].x);
							y.push(this.map.layers[i].features[j].geometry.components[k].y);
						}

						var params = {
							x : x,
							y : y,
							color : style.strokeColor,
							opacity : style.strokeOpacity,
							stroke : style.strokeWidth,
							strokeDashstyle : style.strokeDashstyle,
							strokeLinecap : style.strokeLinecap
						};

						this.write(params);

						this.xml += "</FEATURE>";
					}
					else if(this.map.layers[i].features[j].geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString") {
						var style = this.map.layers[i].parseStyle(this.map.layers[i].features[j]);
							
						var feature = this.map.layers[i].features[j];
						
						for(var k=0; k < feature.geometry.components.length; k++) {
							this.xml += '<FEATURE type="lineString">';
							
							var x = [];
							var y = [];
							
							var lineComponent = feature.geometry.components[k];
							
							for(var l=0; l < lineComponent.components.length; l++) {
								x.push(lineComponent.components[l].x);
								y.push(lineComponent.components[l].y);
							}
							
							var params = {
								x : x,
								y : y,
								color : style.strokeColor,
								opacity : style.strokeOpacity,
								stroke : style.strokeWidth,
								strokeDashstyle : style.strokeDashstyle,
								strokeLinecap : style.strokeLinecap
							};
							this.write(params);
							
							this.xml += "</FEATURE>";
						}
					}
					else if(this.map.layers[i].features[j].geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
						var style = this.map.layers[i].parseStyle(this.map.layers[i].features[j]);
						
						this.xml += '<FEATURE type="polygon">';

						var x = [];
						var y = [];

						for(var k = 0; k < this.map.layers[i].features[j].geometry.components[0].components.length; k++) {
							x.push(this.map.layers[i].features[j].geometry.components[0].components[k].x);
							y.push(this.map.layers[i].features[j].geometry.components[0].components[k].y);
						}
						
						var params = {
							x : x,
							y : y,
							color : style.strokeColor,
							opacity : style.strokeOpacity,
							stroke : style.strokeWidth,
							fillColor : style.fillColor,
							fillOpacity : style.fillOpacity,
							strokeDashstyle : style.strokeDashstyle,
							strokeLinecap : style.strokeLinecap
						};
						this.write(params);

						this.xml += "</FEATURE>";
					}
					else if(this.map.layers[i].features[j].geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon") {
						var style = this.map.layers[i].parseStyle(this.map.layers[i].features[j]);
						
						var feature = this.map.layers[i].features[j];
						
						for(var k=0; k < feature.geometry.components.length; k++) {
							this.xml += '<FEATURE type="polygon">';

							var x = [];
							var y = [];
							
							var polygonComponent = feature.geometry.components[k];
							
							for(var l=0; l < polygonComponent.components[0].components.length; l++) {
								x.push(polygonComponent.components[0].components[l].x);
								y.push(polygonComponent.components[0].components[l].y);
							}
							
							var params = {
								x : x,
								y : y,
								color : style.strokeColor,
								opacity : style.strokeOpacity,
								stroke : style.strokeWidth,
								fillColor : style.fillColor,
								fillOpacity : style.fillOpacity,
								strokeDashstyle : style.strokeDashstyle,
								strokeLinecap : style.strokeLinecap
							};
							
							this.write(params);
							
							this.xml += "</FEATURE>";
						}
					}
				}
				this.xml += "</LAYER>";
			}
		}
	},
	
	/**********************************************************************
 	설명 : 팝업 객체 XML 생성
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	parsePopup : function() {
		for(var i=0; i < this.map.popups.length; i++) {
			if(this.map.popups[i].attributes && this.map.popups[i].attributes.print) {
				this.xml += "<POPUP>";
				
				if(!this.map.popups[i].attributes.fontFamily) {
					this.map.popups[i].attributes.fontFamily = "굴림";
				}
				if(!this.map.popups[i].attributes.fontSize) {
					this.map.popups[i].attributes.fontSize = "12";
				}
				if(!this.map.popups[i].attributes.fontColor)
					this.map.popups[i].attributes.fontColor = "#000000";
				
				var params = {
					x : this.map.popups[i].lonlat.lon,
					y : this.map.popups[i].lonlat.lat,
					width : $(this.map.popups[i].contentDiv).css("width").replace("px",""),
					height : $(this.map.popups[i].contentDiv).css("height").replace("px",""),
					text : this.map.popups[i].attributes.contentHtml,
					fontFamily : this.map.popups[i].attributes.fontFamily,
					fontSize : this.map.popups[i].attributes.fontSize.replace("px", ""),
					fontColor : this.map.popups[i].attributes.fontColor,
					offsetX : this.map.popups[i].attributes.offsetX==null?0:this.map.popups[i].attributes.offsetX,
					offsetY : this.map.popups[i].attributes.offsetY==null?0:this.map.popups[i].attributes.offsetY,
					backgroundOpacity : this.map.popups[i].attributes.backgroundOpacity==null?1:this.map.popups[i].attributes.backgroundOpacity
				};
				this.write(params);
				
				this.xml += "</POPUP>";
			}
		}
	},
	
	/**********************************************************************
 	설명 : XML 노드 생성
 	파라메터 : 
 	리턴값 :
 	***********************************************************************/
	write : function(obj) {
		for ( var i in obj) {
			this.xml += "<" + i + ">" + obj[i] + "</" + i + ">";
		}
	},
	
	CLASS_NAME : "BiesSaveMap"
});

BiesInfoPolygon = OpenLayers.Class(OpenLayers.Handler.Polygon, {
	
	/*down: function(evt) {
        var stopDown = this.stopDown;
        if(this.freehandMode(evt)) {
            stopDown = true;
            if (this.touch) {
                this.modifyFeature(evt.xy, !!this.lastUp);
                OpenLayers.Event.stop(evt);
            }
        }
        if (!this.touch && (!this.lastDown ||
                            !this.passesTolerance(this.lastDown, evt.xy,
                                                  this.pixelTolerance))) {
            this.modifyFeature(evt.xy, !!this.lastUp);
        }
        this.mouseDown = true;
        this.lastDown = evt.xy;
        this.stoppedDown = stopDown;
        
        if(evt.button == "2") {
			this.dblclick(evt);
	        return true;
		}
        else {
        	return !stopDown;	
        }
        
    },*/
    
    up: function (evt) {
        if (this.mouseDown && (!this.lastUp || !this.lastUp.equals(evt.xy))) {
            if(this.stoppedDown && this.freehandMode(evt)) {
                if (this.persist) {
                    this.destroyPersistedFeature();
                }
                this.removePoint();
                this.finalize();
            } else {
                if (this.passesTolerance(this.lastDown, evt.xy,
                                         this.pixelTolerance)) {
                    if (this.touch) {
                        this.modifyFeature(evt.xy);
                    }
                    if(this.lastUp == null && this.persist) {
                        this.destroyPersistedFeature();
                    }
                    this.addPoint(evt.xy);
                    this.lastUp = evt.xy;
                    if(this.line.geometry.components.length === this.maxVertices + 1) {
                        this.finishGeometry();
                    }
                }
            }
        }
        this.stoppedDown = this.stopDown;
        this.mouseDown = false;
        
        if(evt.button == "2") {
			this.dblclick(evt);
	        return true;
		}
        return !this.stopUp;
    },
    
	CLASS_NAME: "BiesInfoPolygon"
});


BiesSelectFeature = OpenLayers.Class(OpenLayers.Control.SelectFeature, {
	
	/**
	 * 검색할 FeatureType
	 */
	featureType : null,
	
	/**
	 * 축척레벨 제한
	 */
	limitZoom : 11,
	
	/**
	 * 초기화 함수
	 */
	initialize : function(layer, options) {
		OpenLayers.Control.SelectFeature.prototype.initialize.apply(this, [layer, options]);		
	},
	
	/**
	 * 지도이동에 이벤트 등록
	 */
	register : function() {
		map.events.register("moveend", this, this.search);
		this.search();
	},
	
	/**
	 * 지도이동에 이벤트 해제
	 */
	unregister : function() {
		map.events.unregister("moveend", this, this.search);
		this.layer.removeAllFeatures();
	},
	
	/**
	 * 현재화면에 포함되는 네트워크 지점 검색 
	 */
	search : function() {
		var that = this;
		that.layer.removeAllFeatures();
		if(map.getZoom() >= this.limitZoom) {
			var geom = map.getExtent().toGeometry();
			gfnGetFeatureByIntersects(this.featureType, geom, false, false, false, function(response) {
				if(response && response.features && response.features.length > 0) {
					that.layer.addFeatures(response.features);
		    	}
			});
		}
	},
	
	activate : function() {
		this.register();
		return OpenLayers.Control.SelectFeature.prototype.activate.apply(this, arguments);
	},
	
	deactivate: function() {
		this.unregister();
		return OpenLayers.Control.SelectFeature.prototype.deactivate.apply(this, arguments);
	},
	
	CLASS_NAME: "BiesSelectFeature"
});