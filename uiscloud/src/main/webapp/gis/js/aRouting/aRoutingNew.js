"use strict";

var aRoutingNew = {
	// 시설물 종류
	cableType: $("#frmARoutingNew :radio[name='cableType']"),
		
	// 그리기 버튼
	drawLineButton: $("#frmARoutingNew .drawLine"),
	
	// 지우기 버튼
	removeLineButton: $("#frmARoutingNew .removeLine"),
	
	// 엑셀 다운로드 
	downloadExcelButton: $("#frmARoutingNew .downloadExcel"),
	
	// 신규 포설 레이어
	layer : null,
	
	// 이동 중에 표시할 팝업
	popup: null,

	// 신규 포설 속성
	attributes : {
		strokeColor : "#008000",
		strokeWidth : 10,
		strokeDashstyle : "solid",
		cableTypeName : "가공 288C"
	},
	
	/**********************************************************************
	설명 : 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 	
	init: function() {
		var that = this;
		that.initGis();
		that.bindEvents();
	},
	
	/**********************************************************************
	설명 : 지도기능 - Layer, Control 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 
	initGis: function() {
		var that = this;
		
		// 레이어 추가 
		that.layer = new BiesVector("aRoutingNew", {
			styleMap : new OpenLayers.StyleMap({
				'default': new OpenLayers.Style({
					strokeWidth: "\${strokeWidth}",
					strokeOpacity: 1,
					strokeColor: "\${strokeColor}",
					strokeDashstyle: "\${strokeDashstyle}",
					strokeLinecap : "round"
				})
			})
		});
		map.addLayer(that.layer);
		
		// 컨트롤 추가 
		var control = new OpenLayers.Control.DrawFeature(that.layer, OpenLayers.Handler.Path, {
			id : "aRoutingNew",
			deactivate: function () {
		        if (this.active) {
		            if (this.handler) {
		                this.handler.deactivate();
		            }
		            this.active = false;
		            if(this.map) {
		                OpenLayers.Element.removeClass(
		                    this.map.viewPortDiv,
		                    this.displayClass.replace(/ /g, "") + "Active"
		                );
		            }
		            this.events.triggerEvent("deactivate");
		            return true;
		        }
		        if(that.popup) {
		        	map.removePopup(that.popup);
		        	that.popup = null;
		        }
		        return false;
		    }
		});
		map.addControl(control);
		
		// 레이어 이벤트 등록 
		that.layer.events.on({
			// 그리기 시작 
			sketchstarted : function(evt) {
				if(that.popup == null) {
					var contentHtml = '<div class="olControlMeasureContent">'
						+ '<div class="cableTypeName"></div>'
						+ '<div class="MeasureAllDist" >'
						+ '<span class="measureResTit">총거리 :</span>'
						+ '<span class="measureResCon"></span>'
						+ '<span class="measureResUnit"></span>'
						+ '</div>'
						+ '</div>';
					
					var lonlat = map.getLonLatFromPixel(evt.xy);
			    	that.popup = new BiesPopup("measurePopup", lonlat, new that.getBrowserSize(120, 28, true), contentHtml, new OpenLayers.Pixel(5,5));
			    	map.addPopup(that.popup);
				}
			},
			featureadded : function(evt) {
				var feature = evt.feature;
				feature.attributes = {
					strokeColor : that.attributes.strokeColor,
					strokeWidth : that.attributes.strokeWidth,
					strokeDashstyle : that.attributes.strokeDashstyle,
					cableTypeName : that.attributes.cableTypeName
				}
				that.layer.redraw();
			},
			sketchmodified: function(evt) {
				var feature = evt.feature;
				if(that.popup) {
					var allDist = that.measureDistance(feature.geometry);
					$(that.popup.contentDiv).find(".cableTypeName").text(that.attributes.cableTypeName);
					$(that.popup.contentDiv).find(".MeasureAllDist .measureResCon").text(allDist[0]);
					$(that.popup.contentDiv).find(".MeasureAllDist .measureResUnit").text(" " + allDist[1]);
				}
            },
            sketchcomplete: function(evt) {
				var feature = evt.feature;
				var contentHtml = '<div class="olControlMeasureContent">'
					+ '<div class="measureClose"><img src="/gis/images/btn/close.png" alt="닫기" /></div>'
					+ '<div class="cableTypeName"></div>'
					+ '<div class="MeasureAllDist" >'
					+ '<span class="measureResTit">총거리 :</span>'
					+ '<span class="measureResCon"></span>'
					+ '<span class="measureResUnit"></span>'
					+ '</div>'
					+ '</div>';
				
				var n = feature.id + ".Popup";
				
				var allDist = that.measureDistance(feature.geometry);
				
				var point = feature.geometry.components[feature.geometry.components.length-1];
				var lonlat = new OpenLayers.LonLat(point.x, point.y);
            	var popup = new BiesPopup(n, lonlat, new that.getBrowserSize(120, 28, true), contentHtml, new OpenLayers.Pixel(5,5));
            	popup.attributes = {
            		print : true,
            		fontFamily : "",
            		contentHtml : that.attributes.cableTypeName + "\r\n" + "총거리 : " + allDist[0] + allDist[1],
        			offsetX : 5,
        			offsetY : 5
            	};
            	feature.popup = popup;
		    	map.addPopup(popup);
		    	
				$(popup.contentDiv).find(".cableTypeName").text(that.attributes.cableTypeName);
				$(popup.contentDiv).find(".MeasureAllDist .measureResCon").text(allDist[0]);
				$(popup.contentDiv).find(".MeasureAllDist .measureResUnit").text(" " + allDist[1]);
				
				popup.type = "aRoutingNew";
				popup.attributes.cableTypeName = that.attributes.cableTypeName;
				popup.attributes.measureDist = allDist[0];
				popup.attributes.measureUnit = allDist[1];
				
				$(".measureClose", popup.div).click(function() {
					var remove = confirm("삭제하시겠습니까?");
                    if (remove == true) {
						if(feature.popup) {
	                    	map.removePopup(feature.popup);
	                    }
						that.layer.removeFeatures(feature);
                    }
				});
            }
		});
		
		map.events.register("mousemove", map, function (evt) {
			if(that.popup) {
                that.popup.moveTo(evt.xy);
			}
		});
	},
	
	/**********************************************************************
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
		// 시설물 종류 변경
		that.cableType.change(function() {
			that.drawLine();
		});
		
		// 그리기 버튼 클릭 이벤트
		that.drawLineButton.click(function() {
			that.drawLine();
		});
		
		// 다운로드 버튼 클릭 이벤트
		that.downloadExcelButton.click(function() {
			that.downloadExcel();
		});
	},
	
	/**********************************************************************
	설명 : 그리기
	파라메터 :
	리턴값 :
	***********************************************************************/
	drawLine: function() {
		var that = this;

		var cableType = that.cableType.filter(":checked").val();
		
		if(cableType == "A288C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 10;
			that.attributes.cableTypeName = "가공 288C";
			that.attributes.strokeDashstyle = "solid"
		} else if(cableType == "A144C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 10;
			that.attributes.cableTypeName = "가공 144C";
			that.attributes.strokeDashstyle = "solid"
		} else if(cableType == "A72C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 8;
			that.attributes.cableTypeName = "가공 72C";
			that.attributes.strokeDashstyle = "solid"
		} else if(cableType == "A48C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 8;
			that.attributes.cableTypeName = "가공 48C";
			that.attributes.strokeDashstyle = "solid"
		} else if(cableType == "A24C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 6;
			that.attributes.cableTypeName = "가공 24C";
			that.attributes.strokeDashstyle = "solid"
		} else if(cableType == "A12C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 6;
			that.attributes.cableTypeName = "가공 12C";
			that.attributes.strokeDashstyle = "solid"
		} else if(cableType == "D288C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 10;
			that.attributes.strokeDashstyle = "dash";
			that.attributes.cableTypeName = "지중 288C";
		} else if(cableType == "D144C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 10;
			that.attributes.strokeDashstyle = "dash";
			that.attributes.cableTypeName = "지중 144C";
		} else if(cableType == "D72C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 8;
			that.attributes.strokeDashstyle = "dash";
			that.attributes.cableTypeName = "지중 72C";
		} else if(cableType == "D48C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 8;
			that.attributes.strokeDashstyle = "dash";
			that.attributes.cableTypeName = "지중 48C";
		} else if(cableType == "D24C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 6;
			that.attributes.strokeDashstyle = "dash";
			that.attributes.cableTypeName = "지중 24C";
		} else if(cableType == "D12C") {
			that.attributes.strokeColor = "#008000";
			that.attributes.strokeWidth = 6;
			that.attributes.strokeDashstyle = "dash";
			that.attributes.cableTypeName = "지중 12C";
		}
		
		gfnActiveControl(["pan" , "aRoutingNew"]);
	}, 

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
	
	measureDistance : function(geometry) {
//		var subLength = geometry.getLength();
//    	var tempLength = subLength;
//    	var unit = "";
//    	tempLength *= (OpenLayers.INCHES_PER_UNIT["m"] / OpenLayers.INCHES_PER_UNIT['km']);
//        if(tempLength > 1) {
//        	subLength = tempLength.toFixed(2);
//        	unit = "km";
//        }
//        else {
//        	subLength = subLength.toFixed(2);
//        	unit = "m";
//        }
//        subLength = gfnFormatNumberFloat(subLength);
//		return [subLength, unit];
		
		
		//고객 요청으로 모든 길이는 미터로 표시
		var subLength = geometry.getLength();
		var unit = "m";
		subLength = subLength.toFixed(2);
		subLength = gfnFormatNumberFloat(subLength);
		return [subLength, unit];
	},

	partLength: function(obj) {
        var length = 0.0;
        if ( obj.components && (obj.components.length > 2)) {
            for(var i=1, len=obj.components.length; i<len-1; i++) {
                length += obj.components[i-1].distanceTo(obj.components[i]);
            }
        }
        return length;
    },
	
	/**********************************************************************
	설명 : 지도&엑셀 출력
	파라메터 :
	리턴값 :
	***********************************************************************/
	downloadExcel: function() {
		var popups = map.popups;
		
		var newLines = [];
		for(var i=0, len=popups.length; i < len; i++) {
			if(popups[i].type == "aRoutingNew" && popups[i].attributes) {
				var isPush = false;
				
				// 같은 라인은 길이만 더한다.
				for(var k = 0, lenNewLines = newLines.length; k < lenNewLines; k++) {
					if(popups[i].attributes.cableTypeName == newLines[k].cableTypeName) {
						// 천단위 콤마(,) 없애고 합치기
						newLines[k].measureDist = 
							Number(String(newLines[k].measureDist).replace(/,/gi, "")) + Number(String(popups[i].attributes.measureDist).replace(/,/gi, ""));						
						newLines[k].measureDist = newLines[k].measureDist.toFixed(2);
						
						isPush = true;
						break;
					}
				}
				
				if(isPush == false) {
					var obj = {};
					obj.cableTypeName = popups[i].attributes.cableTypeName;
					obj.measureDist = Number(String(popups[i].attributes.measureDist).replace(/,/gi, ""));
					obj.measureUnit = popups[i].attributes.measureUnit;
					newLines.push(obj);
				}
			}
		}

		// 케이블별 신규 포설 거리 SUM 값 Round 처리 
		for(i = 0, len = newLines.length; i < len; i++) {
			newLines[i].measureDist = Math.round(newLines[i].measureDist);
		}
		
		aRoutingSearch.downloadExcel(newLines);
	}
};

function handleMeasurements(event) {
//    var geometry = event.geometry;
    var units = event.units;
    var order = event.order;
    var measure = event.measure;
//    var element = document.getElementById('output');
    var out = "";
    if(order == 1) {
        out += "measure: " + measure.toFixed(3) + " " + units;
    } else {
        out += "measure: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
    }
    //element.innerHTML = out;
}