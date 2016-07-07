var dynamicSld = {
		
	/** 레이어 객체 */
	layer : null,
		
	/** 점형 스타일 */	
	point : {
		graphicName: "circle",
		pointRadius: 4,
		strokeColor: "#000000",
		strokeWidth: 3,
		strokeDashstyle: "solid",
		strokeOpacity: 1,
		fillColor: "#000000",
		fillOpacity: 0.3
	}, 
	
	/** 선형 스타일 */
	line : {
		strokeColor: "#ff0000",
		strokeColor_D: "#0000ff",
		strokeWidth: 3,
		strokeDashstyle: "solid",
		strokeDashstyle_D: "solid",
		strokeOpacity: 1
	},
	SKTline : {
		strokeColor_CA01: "#e24900",
		strokeColor_CA02: "#980000",
		strokeColor_CA03: "#ff68ff",
		strokeColor_CA04: "#990000",
		strokeWidth_CA01: 1,
		strokeWidth_CA02: 1,
		strokeWidth_CA03: 1,
		strokeWidth_CA04: 1,
		strokeDashstyle_CA01: "solid",
		strokeDashstyle_CA02: "solid",
		strokeDashstyle_CA03: "solid",
		strokeDashstyle_CA04: "solid",
		strokeOpacity_CA01: 1,
		strokeOpacity_CA02: 1,
		strokeOpacity_CA03: 1,
		strokeOpacity_CA04: 1
	},
	SKBline : {
		strokeColor_CA05: "#0134ac",
		strokeColor_CA06: "#002266",
		strokeColor_CA07: "#4781b9",
		strokeColor_CA08: "#70a0cf",
		strokeWidth_CA05: 1,
		strokeWidth_CA06: 1,
		strokeWidth_CA07: 1,
		strokeWidth_CA08: 1,
		strokeDashstyle_CA05: "solid",
		strokeDashstyle_CA06: "solid",
		strokeDashstyle_CA07: "solid",
		strokeDashstyle_CA08: "solid",
		strokeOpacity_CA05: 1,
		strokeOpacity_CA06: 1,
		strokeOpacity_CA07: 1,
		strokeOpacity_CA08: 1
	},
	/** 면형 스타일 */
	polygon : {
		strokeColor: "#000000",
		strokeWidth: 3,
		strokeDashstyle: "solid",
		strokeOpacity: 1,
		fillColor: "#000000",
		fillOpacity: 0.3
	},
	showSld: $("#chkShowSld"),
	/**********************************************************************
	설명 : 동적 SLD 초기화 함수
	파라메터 :
	리턴값 :
	***********************************************************************/
	init : function() {
		var that = this;
		that.initGis();
		that.initUi();
		that.initSld();
		that.bindEvents();
	},
	
	/**********************************************************************
	설명 : 동적 SLD 레이어 등록
	파라메터 :
	리턴값 :
	***********************************************************************/
	initGis : function() {
		var that = this;
		that.layer = new BiesVector("sldLayer", {
			styleMap : new OpenLayers.StyleMap({
				'default': new OpenLayers.Style(null, {
					rules: [new OpenLayers.Rule({
						symbolizer : {
							"Point": {
								graphicName: "\${graphicName}",
								pointRadius: "\${pointRadius}",
								strokeColor: "\${strokeColor}",
								strokeWidth: "\${strokeWidth}",
								strokeDashstyle: "\${strokeDashstyle}",
								strokeOpacity: "\${strokeOpacity}",
								fillColor: "\${fillColor}",
								fillOpacity: "\${fillOpacity}"
							},
							"Line": {
								strokeColor: "\${strokeColor}",
								strokeWidth: "\${strokeWidth}",
								strokeDashstyle: "\${strokeDashstyle}",
								strokeOpacity: "\${strokeOpacity}"
							},
							"Polygon": {
								strokeColor: "\${strokeColor}",
								strokeWidth: "\${strokeWidth}",
								strokeDashstyle: "\${strokeDashstyle}",
								strokeOpacity: "\${strokeOpacity}",
								fillColor: "\${fillColor}",
								fillOpacity: "\${fillOpacity}"
							} 
						}
					})]
				})
			})
		});
		map.addLayer(that.layer);
	},
	
	/**********************************************************************
	설명 : 초기 화면 UI 설정
	파라메터 :
	리턴값 :
	***********************************************************************/
	initUi : function() {
		// 동적스타일 적용 윈도우
		$("#dynamicSldWindow").show();
		$("#dynamicSldWindow").window({
			width:340,
			height:330,
			title:"동적스타일 적용",
			model:true,
			minimizable:false,
			maximizable:false,
			resizable:false,
			closed:true
		});
		
		// 선색상
		$(".sldOpac").slider({
			min : 0,
			max : 100,
			step : 1,
			width:150,
			showTip:true
		});
	},
	
	/**********************************************************************
	설명 : 초기 스타일 설정
	파라메터 :
	리턴값 :
	***********************************************************************/
	initSld : function() {
		var that = this;
		$("#divPointTab .pointStyle").combobox("setValue", that.point.graphicName);
		$("#divPointTab .pointSize").val(that.point.pointRadius);
		$("#divPointTab .lineColor").val(that.point.strokeColor);
		$("#divPointTab .lineSize").val(that.point.strokeWidth);
		$("#divPointTab .lineStyle").combobox("setValue", that.point.strokeDashstyle);
		$("#divPointTab .lineOpac").slider("setValue", 100 - (that.point.strokeOpacity*100));
		$("#divPointTab .polyColor").val(that.point.fillColor);
		$("#divPointTab .polyOpac").slider("setValue", 100 - (that.point.fillOpacity*100));

		$("#divLineTab .lineColor").val(that.line.strokeColor);
		$("#divLineTab .lineSize").val(that.line.strokeWidth);
		$("#divLineTab .lineStyle").combobox("setValue", that.line.strokeDashstyle);
		$("#divLineTab .lineOpac").slider("setValue", 100 - (that.line.strokeOpacity*100));
		
		$("#divLineTab .lineColor_D").val(that.line.strokeColor_D);
		$("#divLineTab .lineSize_D").val(that.line.strokeWidth);
		$("#divLineTab .lineStyle_D").combobox("setValue", that.line.strokeDashstyle_D);
		$("#divLineTab .lineOpac_D").slider("setValue", 100 - (that.line.strokeOpacity*100));
		
		
		$("#divRoutingLineSKTTab .line_ca01Color").val(that.SKTline.strokeColor_CA01);
		$("#divRoutingLineSKTTab .line_ca01Size").val(that.SKTline.strokeWidth_CA01);
		$("#divRoutingLineSKTTab .line_ca01Style").combobox("setValue", that.SKTline.strokeDashstyle_CA01);
		$("#divRoutingLineSKTTab .line_ca01Opac").slider("setValue", 100 - (that.SKTline.strokeOpacity_CA01*100));
		
		$("#divRoutingLineSKTTab .line_ca02Color").val(that.SKTline.strokeColor_CA02);
		$("#divRoutingLineSKTTab .line_ca02Size").val(that.SKTline.strokeWidth_CA02);
		$("#divRoutingLineSKTTab .line_ca02Style").combobox("setValue", that.SKTline.strokeDashstyle_CA02);
		$("#divRoutingLineSKTTab .line_ca02Opac").slider("setValue", 100 - (that.SKTline.strokeOpacity_CA02*100));
		
		$("#divRoutingLineSKTTab .line_ca03Color").val(that.SKTline.strokeColor_CA03);
		$("#divRoutingLineSKTTab .line_ca03Size").val(that.SKTline.strokeWidth_CA03);
		$("#divRoutingLineSKTTab .line_ca03Style").combobox("setValue", that.SKTline.strokeDashstyle_CA03);
		$("#divRoutingLineSKTTab .line_ca03Opac").slider("setValue", 100 - (that.SKTline.strokeOpacity_CA03*100));
		
		$("#divRoutingLineSKTTab .line_ca04Color").val(that.SKTline.strokeColor_CA04);
		$("#divRoutingLineSKTTab .line_ca04Size").val(that.SKTline.strokeWidth_CA04);
		$("#divRoutingLineSKTTab .line_ca04Style").combobox("setValue", that.SKTline.strokeDashstyle_CA04);
		$("#divRoutingLineSKTTab .line_ca04Opac").slider("setValue", 100 - (that.SKTline.strokeOpacity_CA04*100));
		
		
		$("#divRoutingLineSKBTab .line_ca05Color").val(that.SKBline.strokeColor_CA05);
		$("#divRoutingLineSKBTab .line_ca05Size").val(that.SKBline.strokeWidth_CA05);
		$("#divRoutingLineSKBTab .line_ca05Style").combobox("setValue", that.SKBline.strokeDashstyle_CA05);
		$("#divRoutingLineSKBTab .line_ca05Opac").slider("setValue", 100 - (that.SKBline.strokeOpacity_CA05*100));
		
		$("#divRoutingLineSKBTab .line_ca06Color").val(that.SKBline.strokeColor_CA06);
		$("#divRoutingLineSKBTab .line_ca06Size").val(that.SKBline.strokeWidth_CA06);
		$("#divRoutingLineSKBTab .line_ca06Style").combobox("setValue", that.SKBline.strokeDashstyle_CA06);
		$("#divRoutingLineSKBTab .line_ca06Opac").slider("setValue", 100 - (that.SKBline.strokeOpacity_CA06*100));
		
		$("#divRoutingLineSKBTab .line_ca07Color").val(that.SKBline.strokeColor_CA07);
		$("#divRoutingLineSKBTab .line_ca07Size").val(that.SKBline.strokeWidth_CA07);
		$("#divRoutingLineSKBTab .line_ca07Style").combobox("setValue", that.SKBline.strokeDashstyle_CA07);
		$("#divRoutingLineSKBTab .line_ca07Opac").slider("setValue", 100 - (that.SKBline.strokeOpacity_CA07*100));
		
		$("#divRoutingLineSKBTab .line_ca08Color").val(that.SKBline.strokeColor_CA08);
		$("#divRoutingLineSKBTab .line_ca08Size").val(that.SKBline.strokeWidth_CA08);
		$("#divRoutingLineSKBTab .line_ca08Style").combobox("setValue", that.SKBline.strokeDashstyle_CA08);
		$("#divRoutingLineSKBTab .line_ca08Opac").slider("setValue", 100 - (that.SKBline.strokeOpacity_CA08*100));
		
		/*$("#divPolygonTab .lineColor").val(that.polygon.strokeColor);
		$("#divPolygonTab .lineSize").val(that.polygon.strokeWidth);
		$("#divPolygonTab .lineStyle").combobox("setValue", that.polygon.strokeDashstyle);
		$("#divPolygonTab .lineOpac").slider("setValue", 100 - (that.polygon.strokeOpacity*100));
		$("#divPolygonTab .polyColor").val(that.polygon.fillColor);
		$("#divPolygonTab .polyOpac").slider("setValue", 100 - (that.polygon.fillOpacity*100));*/
	},
	
	/**********************************************************************
	설명 : 스타일 적용
	파라메터 :
	리턴값 :
	***********************************************************************/
	/*submitSld : function() {
		var that = this;

		that.point.graphicName = $("#divPointTab .pointStyle").combobox("getValue");
		that.point.pointRadius = $("#divPointTab .pointSize").val();
		that.point.strokeColor = $("#divPointTab .lineColor").val();
		that.point.strokeWidth = $("#divPointTab .lineSize").val(); 
		that.point.strokeDashstyle = $("#divPointTab .lineStyle").combobox("getValue"); 
		that.point.strokeOpacity = 1 - $("#divPointTab .lineOpac").slider("getValue")/100;
		that.point.fillColor = $("#divPointTab .polyColor").val();
		that.point.fillOpacity = 1 - $("#divPointTab .polyOpac").slider("getValue")/100;
		
		that.line.strokeColor = $("#divLineTab .lineColor").val();
		that.line.strokeWidth = $("#divLineTab .lineSize").val();
		that.line.strokeDashstyle = $("#divLineTab .lineStyle").combobox("getValue");
		that.line.strokeOpacity = 1 - $("#divLineTab .lineOpac").slider("getValue")/100;
		
		that.polygon.strokeColor = $("#divPolygonTab .lineColor").val();
		that.polygon.strokeWidth = $("#divPolygonTab .lineSize").val(); 
		that.polygon.strokeDashstyle = $("#divPolygonTab .lineStyle").combobox("getValue"); 
		that.polygon.strokeOpacity = 1 - $("#divPolygonTab .lineOpac").slider("getValue")/100;
		that.polygon.fillColor = $("#divPolygonTab .polyColor").val();
		that.polygon.fillOpacity = 1 - $("#divPolygonTab .polyOpac").slider("getValue")/100;
		
		that.layer.redraw();
	},*/
	
	/**********************************************************************
	설명 : 라인 스타일 적용
	파라메터 :
	리턴값 :
	***********************************************************************/
	getSldLine : function() {
		var strokeColor = $("#divLineTab .lineColor").val();
		var strokeWidth = $("#divLineTab .lineSize").val();
		var strokeDashstyle = $("#divLineTab .lineStyle").combobox("getValue");
		var strokeOpacity = 1 - $("#divLineTab .lineOpac").slider("getValue")/100;
		
		var attrs = {
			strokeColor : strokeColor,
			strokeWidth : strokeWidth,
			strokeDashstyle : strokeDashstyle,
			strokeOpacity : strokeOpacity
		};
		
		return attrs;
	},
	
	/**********************************************************************
	설명 : 지중 라인 스타일 적용
	파라메터 :
	리턴값 :
	***********************************************************************/
	getSldLineUngr : function() {
		var strokeColor = $("#divLineTab .lineColor_D").val();
		var strokeWidth = $("#divLineTab .lineSize_D").val();
		var strokeDashstyle = $("#divLineTab .lineStyle_D").combobox("getValue");
		var strokeOpacity = 1 - $("#divLineTab .lineOpac_D").slider("getValue")/100;
		
		var attrs = {
			strokeColor : strokeColor,
			strokeWidth: strokeWidth,
			strokeDashstyle : strokeDashstyle,
			strokeOpacity : strokeOpacity
		};
		
		return attrs;
	},
	
	/**********************************************************************
	설명 : 점 스타일 적용
	파라메터 :
	리턴값 :
	***********************************************************************/
	getSldPoint : function() {
		var graphicName = $("#divPointTab .pointStyle").combobox("getValue");
		var pointRadius = $("#divPointTab .pointSize").val();
		var strokeColor = $("#divPointTab .lineColor").val();
		var strokeWidth = $("#divPointTab .lineSize").val(); 
		var strokeDashstyle = $("#divPointTab .lineStyle").combobox("getValue"); 
		var strokeOpacity = 1 - $("#divPointTab .lineOpac").slider("getValue")/100;
		var fillColor = $("#divPointTab .polyColor").val();
		var fillOpacity = 1 - $("#divPointTab .polyOpac").slider("getValue")/100;
		
		var attrs = {
			graphicName : graphicName,
			pointRadius : pointRadius,
			strokeColor : strokeColor,
			strokeWidth : strokeWidth,
			strokeDashstyle : strokeDashstyle,
			strokeOpacity : strokeOpacity,
			fillColor : fillColor,
			fillOpacity : fillOpacity
		};
		 
		return attrs;
	},
	
	/**********************************************************************
	설명 : 이벤트 등록
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents : function() {
		var that = this;
		$(".a_menu_sld").click(function() {
			$("#dynamicSldWindow").window("open");
		});
		/*$("#sldSubmit").click(function() {
			that.submitSld();
		});*/
	},
	
	/**********************************************************************
	설명 : 결과 표시 
	파라메터 :
	리턴값 :
	***********************************************************************/
	showResult : function(tableName, datas, gridId) {
		var that = this;
		
		var gids = [];
		for(var i in datas.rows) {
			gids.push(datas.rows[i].gid);
		}
		if($("#chkShowSld").is(":checked") == true) {
			gfnGetFeatureById(prefix+tableName.toLowerCase(), gids, false, false, false, function(res) {
				that.showFeatures(res.features, gridId);				
				
				for(var a in res.features) {
	    			if(!tabObj[gridId]){
	    				tabObj[gridId] = res.features[a];
	    			}
//	    			else{
//	    				tabObj[index] = res.features[a];
//	    			}
				}
			});
		}
	},
	
	/**********************************************************************
	설명 : 도형 표시 
	파라메터 :
	리턴값 :
	***********************************************************************/
	showFeatures : function(features, gridId) {
		var that = this;			

		var list = [];
		for(var i in features) {
			var feature = features[i].clone(); 
			if(feature.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
				if(feature.attributes.isUngr) {
					feature.attributes = that.getSldLineUngr();
				}
				else {
					feature.attributes = that.getSldLine();
				}
			}
			else if(feature.geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString") {
				if(feature.attributes.isUngr) {
					feature.attributes = that.getSldLineUngr();
				}
				else {
					feature.attributes = that.getSldLine();
				}
			}
			else {
				feature.attributes = that.getSldPoint();
			}
			list.push(feature);
			
		}
		console.log(list);
		that.layer.addFeatures(list);
		that.layer.redraw();
	}
};