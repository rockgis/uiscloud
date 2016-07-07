/**
 * editTool.js
 */

var editTool = {
	editLayer : null,
	
	source : null,
	
	selectInteraction : null,
	
	map : null,
	
	mode : null,
	
	copyFeature : null,
	
	divideFeature : null,
	
	pointPropertyRows : [
	    {field:"gid",name:"gid",value:""},
	    {field:"bulManNo",name:"bul_man_no",value:"9999"},
	    {field:"entrcSe",name:"entrc_se",value:"RM"},
	    {field:"entManNo",name:"ent_man_no",value:"8240"},
	    {field:"eqbManSn",name:"eqb_man_sn",value:"0"},
	    {field:"opertDe",name:"opert_de",value:"20160527000000"},
	    {field:"sigCd",name:"sig_cd",value:"11380"}
	],
	
	linePropertyRows : [
 	    {field:"gid",name:"gid",value:""},
 	    {field:"bsiIntSn",name:"bsi_int_sn",value:"99999"},
 	    {field:"cntDrcLn",name:"cnt_drc_ln",value:"R"},
 	    {field:"cntDstLn",name:"cnt_dst_ln",value:"1.245"}
 	],
 	
 	polygonPropertyRows : [
	    {field:"gid",name:"gid",value:""},
	    {field:"bdtypCd",name:"bdtyp_cd",value:"99999"},
	    {field:"bdMgtSn",name:"bdMgt_sn",value:"1144011100101150017"}
	],
		
	init : function(map){
		var that = this;
		that.map = map;
		
		that.fn_init_editLayer();
		that.fn_init_editInteractions();
		that.fn_init_event();
	},
	
	fn_init_editLayer : function(){
		var that = this;
		
		that.source = new ol.source.Vector();
		that.editLayer = new ol.layer.Vector({
			id : "editLayer",
			source : that.source,
			style : new ol.style.Style({
				fill: new ol.style.Fill({
			      color: 'rgba(255, 255, 255, 0.2)'
			    }),
			    stroke: new ol.style.Stroke({
			      color: 'rgba(255, 204, 51, 1)',
			      width: 2
			    }),
			    image: new ol.style.Circle({
			      radius: 7,
			      fill: new ol.style.Fill({
			        color: 'rgba(255, 204, 51, 1)'
			      })
			    })
			})
		});
		
		that.map.addLayer(that.editLayer);
		that.editLayer.getSource().on('addfeature', function(evt){
			// "이동" 컨트롤 활성화
			$("#btn_pan img").trigger("click");
			
			// evt.feature에 테이블명 속성값 넣기
			var layerName = $('#ul_map_editTool .targetEditLyr option:selected').val();
			evt.feature.setProperties({layerName: layerName});
			
			// 우측 속성수정 및 저장버튼이 있는 메뉴 활성화
			$("#div_layout").layout("expand", "east");
			
			// 속성수정 메뉴 초기화
			$("#table_info").propertygrid({
				scrolbarSize : 0,
				fitColumns : true,
				nowrap : false,
				showGroup : true,
				showHeader : true,
				columns:[[{field:'name',title:'항목명', width: 10},{field:'value',title:'값', width: 20}]]
				/*onSelect : function(rowIndex, rowData) {
					// 선택 해제
					// ("#table_info").propertygrid("unselectRow", rowIndex); 
				}*/
			});
			
			// 버튼 show/hide 
			if(that.mode == "insert"){
				$('#a_save_feature').show();
				$('#a_update_feature').hide();
				
				// 속성수정 메뉴 값 셋팅
				var layerType = $('#ul_map_editTool .targetEditLyr option:selected').attr("lyrType");
				var propertyRows;
				if(layerType == "point"){
					propertyRows = that.pointPropertyRows;
				}
				else if(layerType == "line"){
					propertyRows = that.linePropertyRows;
				}
				else if(layerType == "polygon"){
					propertyRows = that.polygonPropertyRows;
				}
				$("#table_info").propertygrid("loadData", propertyRows);
				
			}
			else if(that.mode == "update"){
				$('#a_save_feature').hide();
				$('#a_update_feature').show();
				
				// 속성수정 메뉴 값 셋팅
				var layerType = $('#ul_map_editTool .targetEditLyr option:selected').attr("lyrType");
				var params = {};
				var feature = evt.feature;
				var geometry = feature.getGeometry();
				//geometry = geometry.transform('EPSG:900913', 'EPSG:5179');
				
				var callback = function(features){
					that.mode = "";
					var editLayerSource = that.editLayer.getSource();
					editLayerSource.clear(true);
					editLayerSource.addFeature(features[0]);
					that.mode = "update";
					var featureProperties = features[0].getProperties();
					var propertyRows;
					if(layerType == "point"){
						propertyRows = that.pointPropertyRows;
					}
					else if(layerType == "line"){
						propertyRows = that.linePropertyRows;
					}
					else if(layerType == "polygon"){
						propertyRows = that.polygonPropertyRows;
					}
					
					for(var i in propertyRows){
						if(propertyRows[i].name == "gid"){
							propertyRows[i].value = features[0].getId().split(".")[1];
						}
						if(featureProperties[propertyRows[i].name] != null && featureProperties[propertyRows[i].name] != ''){
							propertyRows[i].value = featureProperties[propertyRows[i].name];
						}
						propertyRows[i].editor = "text";
					}
					
					$("#table_info").propertygrid("loadData", propertyRows);
					map.getInteractions().forEach(function(interaction){
						if(interaction.get("name") == "modifyFeature2"){
							interaction.features_.push(features[0]);
						}
					});
					gfnActiveInteraction(["defaultInteraction", "modifyFeature2"]);
				}
				gfnGetFeatureByDWithin(prefix+layerName.toLowerCase(), geometry, 1, true, true, true, callback);
			}
			else if(that.mode == "delete"){
				var layerType = $('#ul_map_editTool .targetEditLyr option:selected').attr("lyrType");
				var params = {};
				var feature = evt.feature;
				var geometry = feature.getGeometry();
				//geometry = geometry.transform('EPSG:900913', 'EPSG:5179');
				
				var callback = function(features){
					that.editLayer.getSource().clear(true);
					if(features.length > 0){
						$.messager.confirm("시설물 삭제", "선택한 시설물을 삭제 하시겠습니까?", function(){
							var params = {};
							var featureProperties = feature.getProperties();
							
							params["gid"] = features[0].getId().split(".")[1];
							
							if(featureProperties.layerName == "tl_spbd_entrc_11000"){
								url = "/gis/mapInfo/spbdEntrc/delete";
							}
							else if(featureProperties.layerName == "tl_spot_cntc_11000"){
								url = "/gis/mapInfo/spotCntc/delete";
							}
							else if(featureProperties.layerName == "tl_spbd_buld_11000"){
								url = "/gis/mapInfo/spbdBuld/delete";
							}
							
							$.post(
								url,
								params,
								function(res) {
									if(res && res.rows && res.rows == 1) {
										var wmsLayerSource = gfnGetLayer("biesLayer").getSource();
										var params = wmsLayerSource.getParams();
										params.nocache = Math.random();
										wmsLayerSource.updateParams(params);
										$.messager.alert("시설물 삭제", "삭제 완료");
									}
									else {
										$.messager.alert("시설물 삭제", "삭제 실패");
									}
								}
							);
						});
					}
					else{
						$.messager.alert("시설물 삭제", "선택한 지점에 삭제할 시설물이 없습니다.");
					}
				}
				gfnGetFeatureByDWithin(prefix+layerName.toLowerCase(), geometry, 1, true, true, true, callback);
			}
			else if(that.mode == "copy"){
				var layerType = $('#ul_map_editTool .targetEditLyr option:selected').attr("lyrType");
				var params = {};
				var feature = evt.feature;
				var geometry = feature.getGeometry();
				that.mode = '';
				//geometry = geometry.transform('EPSG:900913', 'EPSG:5179');
				var callback = function(features){
					that.editLayer.getSource().clear(true);
					if(features.length > 0){
						var geom = features[0].getGeometry();
						var featureProperties = features[0].getProperties();
						geom.translate(20,20);
						that.editLayer.getSource().addFeature(features[0]);
						gfnActiveInteraction(["defaultInteraction", "dragFeature"]);
						
						$('#a_save_feature').show();
						$('#a_update_feature').hide();
						
						// 속성수정 메뉴 값 셋팅
						var layerType = $('#ul_map_editTool .targetEditLyr option:selected').attr("lyrType");
						var propertyRows;
						if(layerType == "point"){
							propertyRows = that.pointPropertyRows;
						}
						else if(layerType == "line"){
							propertyRows = that.linePropertyRows;
						}
						else if(layerType == "polygon"){
							propertyRows = that.polygonPropertyRows;
						}
						$("#table_info").propertygrid("loadData", propertyRows);
					}
					else{
						$.messager.alert("시설물 복사", "선택한 지점에 복사할 시설물이 없습니다.");
					}
				}
				gfnGetFeatureByDWithin(prefix+layerName.toLowerCase(), geometry, 1, true, true, true, callback);
			}
			else if(that.mode == "divide"){
				// 속성수정 메뉴 값 셋팅
				var layerType = $('#ul_map_editTool .targetEditLyr option:selected').attr("lyrType");
				var params = {};
				var feature = evt.feature;
				var geometry = feature.getGeometry();
				//geometry = geometry.transform('EPSG:900913', 'EPSG:5179');
				
				var callback = function(features){
					that.mode = "";
					var editLayerSource = that.editLayer.getSource();
					editLayerSource.clear(true);
					editLayerSource.addFeature(features[0]);
					that.divideFeature = features[0];
					that.mode = "divideFinish";
					map.getInteractions().forEach(function(interaction){
						if(interaction.get("name") == "modifyFeature2"){
							interaction.features_.push(features[0]);
						}
					});
					gfnActiveInteraction(["defaultInteraction", "snapEdit", "getFeatureByPoint"]);
				}
				gfnGetFeatureByDWithin(prefix+layerName.toLowerCase(), geometry, 1, true, true, true, callback);
			}
			else if(that.mode == "divideFinish"){
				// TODO : 진행필요..
				var targetFeature = evt.feature;
				
				// 선택한 지점을 기준으로 기설케이블 2등분하여 저장
				// 1. 케이블 형태 판단 : MultiLineStrring인지 LineString인지 
				var geom = that.divideFeature.getGeometry();
				if(geom instanceof ol.geom.MultiLineString){
					geom = that.divideFeature.getGeometry().components[0];
				}
				
				// 2. 사용자가 입력한 접속함체가 케이블 어느 위치에 있는지 판단
				that.addNewJp.attributes.divideNewCaSeq = -1;
				
				for(var i=0 ; i<geom.components.length-1 ; i++){
					var tmpLine = new OpenLayers.Geometry.LineString([geom.components[i], geom.components[i+1]]);
					var jpPolygon = new OpenLayers.Geometry.Polygon.createRegularPolygon(that.addNewJp.geometry,1,20,0);
					
					if(geom.components[i].x == that.addNewJp.geometry.x && geom.components[i].y == that.addNewJp.geometry.y){
						that.addNewJp.attributes.divideNewCaSeq = i;
					}
					else if(geom.components[i+1].x == that.addNewJp.geometry.x && geom.components[i+1].y == that.addNewJp.geometry.y){
						that.addNewJp.attributes.divideNewCaSeq = i+1;
					}
					else{
						if(tmpLine.intersects(jpPolygon)){
							that.addNewJp.attributes.divideNewCaSeq = i;
						}
					}
				}
				if(!(that.addNewJp.attributes.divideNewCaSeq >= 0)){
					alert('케이블 위에 접속함체를 선택하셔야 합니다.');
					that.mode = "addNewJp";
					fac.editLayer.removeAllFeatures();
					
					return false;
				}
				
				// 3. that.addNewJp 기준으로 왼쪽, 오른쪽 기설 케이블 Feature를 구한다.
				var newLeftCa, newRightCa;
				newLeftCaComp = [];
				for(var i=0 ; i<=that.addNewJp.attributes.divideNewCaSeq ; i++){
					newLeftCaComp.push(geom.components[i]);
				}
				newLeftCaComp.push(that.addNewJp.geometry);
				newLeftCaGeom = new OpenLayers.Geometry.LineString(newLeftCaComp);
				newLeftCaGeomMultiLineString = new OpenLayers.Geometry.MultiLineString([newLeftCaGeom]);
				newLeftCa = new OpenLayers.Feature.Vector(newLeftCaGeomMultiLineString);
				
				newRightCaComp = [];
				newRightCaComp.push(that.addNewJp.geometry);
				for(var i=that.addNewJp.attributes.divideNewCaSeq+1 ; i<geom.components.length ; i++){
					newRightCaComp.push(geom.components[i]);
				}
				newRightCaGeom = new OpenLayers.Geometry.LineString(newRightCaComp);
				newRightCaGeomMultiLineString = new OpenLayers.Geometry.MultiLineString([newRightCaGeom]);
				newRightCa = new OpenLayers.Feature.Vector(newRightCaGeomMultiLineString);
				
				newLeftCa.attributes.divideType = "left";
				newRightCa.attributes.divideType = "right";
				
				newLeftCa.attributes.gisCode = 'CA001';
				newRightCa.attributes.gisCode = 'CA001';
				
				// 4. 3번으로 구한 2개의 케이블(왼쪽 기설, 오른쪽 기설)을 각자 알맞은 Layer에 add한다. 
				routing.layer.addFeatures([newLeftCa, newRightCa]);
				
				// 5. 경로결과분석(케이블) grid에 왼쪽 기설, 오른쪽 기설 내용을 갱신 및 db에도 입력 
				var tblResultRouting = $("#tbl_result_routing").datagrid("acceptChanges").datagrid("getData").rows;
				var caIdx;
				for(var i in tblResultRouting){
					if(tblResultRouting[i].feature == that.targetCa.id){
						caIdx = $('#tbl_result_routing').datagrid("getRowIndex", tblResultRouting[i]);
					}
				}
				
				if(caIdx != undefined){
					// $("#tbl_result_routing") grid의 i번째에 있는 내용을 지우고 왼쪽기설, 오른쪽 기설을 추가한다.
					var str = JSON.stringify(tblResultRouting[caIdx]);
					var clone = jQuery.parseJSON(str);
					
					var str2 = JSON.stringify(tblResultRouting[caIdx]);
					var clone2 = jQuery.parseJSON(str2);
					
					var tmpObj = {};
					for(var i in clone){
						tmpObj[i] = clone[i];
					}
					
					var tmpObj2 = {};
					for(var i in clone2){
						tmpObj2[i] = clone2[i];
					}
					
					tmpObj["seq"] = clone["seq"];
					tmpObj["useCoreCnt"] = 0;
					tmpObj["feature"] = newRightCa.id;
					tmpObj["wkt"] = newRightCa.geometry.toString();
					tmpObj["mngNo"] = tmpObj["mngNo"] + "/분기1";
					tmpObj["fctsNm"] = tmpObj["fctsNm"] + "/분기1";
					
					$("#tbl_result_routing").datagrid("deleteRow", caIdx);
					$("#tbl_result_routing").datagrid("acceptChanges");
					
					$("#tbl_result_routing").datagrid("insertRow",{
						index : parseInt(caIdx),
						row : tmpObj
					});
					
					$("#tbl_result_routing").datagrid("acceptChanges");
					
					tmpObj2["seq"] = parseInt(tmpObj2["seq"] + 1);
					tmpObj2["useCoreCnt"] = 0;
					tmpObj2["feature"] = newLeftCa.id;
					tmpObj2["wkt"] = newLeftCa.geometry.toString();
					tmpObj2["mngNo"] = tmpObj2["mngNo"] + "/분기2";
					tmpObj2["fctsNm"] = tmpObj2["fctsNm"] + "/분기2";
					
					$("#tbl_result_routing").datagrid("insertRow",{
						index : parseInt(caIdx+1),
						row : tmpObj2
					});
					$("#tbl_result_routing").datagrid("acceptChanges");
					
					for(var i=parseInt(caIdx+2) ; i < tblResultRouting.length ; i++){
						tblResultRouting[i]["seq"]++;
						$("#tbl_result_routing").datagrid("updateRow", {index:i, row:tblResultRouting[i]});
					}
					
					$("#tbl_result_routing").datagrid("acceptChanges");
					
					// DB 저장
					routing.insert();
				}
				
				// 6. 사용자가 입력한 1개의 접속함체(addNewJp)를 기본속성값인 신규 접속함체로 등록
				that.saveJp('one');
				
				// 7. pan 컨트롤 활성화
				gfnActiveControl(["pan"]);
			}
		});
	},
	
	fn_init_editInteractions : function(){
		var that = this;
		
		var snapEdit = new ol.interaction.Snap({
			source: that.source,
		});
		snapEdit.set('id','snapEdit');
		snapEdit.set('name','snapEdit');
		
		var editPoint = new ol.interaction.Draw({
			source: that.source,
		    type: /** @type {ol.geom.GeometryType} */ ('Point')
		});
		editPoint.set('id','editPoint');
		editPoint.set('name','editPoint');
		
		var editLine = new ol.interaction.Draw({
			source: that.source,
		    type: /** @type {ol.geom.GeometryType} */ ('LineString')
		});
		editLine.set('id','editLine');
		editLine.set('name','editLine');
		
		var editPolygon = new ol.interaction.Draw({
			source: that.source,
		    type: /** @type {ol.geom.GeometryType} */ ('Polygon')
		});
		editPolygon.set('id','editPolygon');
		editPolygon.set('name','editPolygon');
		
		var getFeatureByPoint = new ol.interaction.Draw({
			source: that.source,
		    type: /** @type {ol.geom.GeometryType} */ ('Point')
		});
		getFeatureByPoint.set('id','getFeatureByPoint');
		getFeatureByPoint.set('name','getFeatureByPoint');
		
		// 편집 control
		// 1. 시설물 선택 + getFeature
		// 2. editLayer에 그려넣기
		// 3. modifyFeature control로 선택하여 편집 + 속성편집
		// 4. 편집저장
		// 5. 편집취소
		
		var selectFeature = new ol.interaction.Select();
		selectFeature.set('id','selectFeature2');
		selectFeature.set('name','selectFeature2');
		that.selectInteraction = selectFeature;
		
		var modifyFeature = new ol.interaction.Modify({
			features : selectFeature.getFeatures(),
			deleteCondition: function(event) {
				return ol.events.condition.shiftKeyOnly(event) &&
		        		ol.events.condition.singleClick(event);
			}
		});
		modifyFeature.set('id','modifyFeature2');
		modifyFeature.set('name','modifyFeature2');
		
		var dragFeature = new olCustom.DragFeature({});
		dragFeature.set('id','dragFeature');
		dragFeature.set('name','dragFeature');
		
		var interactions = [snapEdit, editPoint, editLine, editPolygon, selectFeature, modifyFeature, dragFeature, getFeatureByPoint];
		
		for(var i in interactions){
			that.map.addInteraction(interactions[i]);
		}
	},
	
	fn_init_event : function(){
		var that = this;
		
		$('#a_save_feature').click(function(){
			var data = $("#table_info").propertygrid("acceptChanges").propertygrid("getData");
			var params = gfnGetParamsFromPropertyGridData(data);
			var feature = that.editLayer.getSource().getFeatures()[0];
			var featureProperties = feature.getProperties();
			params["wkt"] = gfnGetWktFromFeature(feature);
			var url = "";
			if(featureProperties.layerName == "tl_spbd_entrc_11000"){
				url = "/gis/mapInfo/spbdEntrc/insert";
			}
			else if(featureProperties.layerName == "tl_spot_cntc_11000"){
				url = "/gis/mapInfo/spotCntc/insert";
			}
			else if(featureProperties.layerName == "tl_spbd_buld_11000"){
				url = "/gis/mapInfo/spbdBuld/insert";
			}
			
			$.post(
				url,
				params,
				function(res) {
					if(res && res.rows && res.rows == 1) {
						$("#div_layout").layout("collapse", "east");
						that.editLayer.getSource().clear(true);
						var wmsLayerSource = gfnGetLayer("biesLayer").getSource();
						var params = wmsLayerSource.getParams();
						params.nocache = Math.random();
						wmsLayerSource.updateParams(params);
						$.messager.alert("시설물 추가", "추가 완료");
					}
					else {
						$.messager.alert("시설물 추가", "추가 실패");
					}
				}
			);
		});
		
		$('#a_update_feature').click(function(){
			var data = $("#table_info").propertygrid("acceptChanges").propertygrid("getData");
			var params = gfnGetParamsFromPropertyGridData(data);
			var feature = that.editLayer.getSource().getFeatures()[0];
			var featureProperties = feature.getProperties();
			
			params["wkt"] = gfnGetWktFromFeature(feature);
			
			if(featureProperties.layerName == "tl_spbd_entrc_11000"){
				url = "/gis/mapInfo/spbdEntrc/update";
			}
			else if(featureProperties.layerName == "tl_spot_cntc_11000"){
				url = "/gis/mapInfo/spotCntc/update";
			}
			else if(featureProperties.layerName == "tl_spbd_buld_11000"){
				url = "/gis/mapInfo/spbdBuld/update";
			}
			
			$.post(
				url,
				params,
				function(res) {
					if(res && res.rows && res.rows == 1) {
						$("#div_layout").layout("collapse", "east");
						that.editLayer.getSource().clear(true);
						// Interaction의 Feature 제거
						var interactions = map.getInteractions();
					    interactions.forEach(function(interaction){
					    	if(interaction instanceof ol.interaction.Select){
					    		interaction.getFeatures().clear(1);
					    	}
					    });
					    
						var wmsLayerSource = gfnGetLayer("biesLayer").getSource();
						var params = wmsLayerSource.getParams();
						params.nocache = Math.random();
						wmsLayerSource.updateParams(params);
						$.messager.alert("시설물 수정", "수정 완료");
					}
					else {
						$.messager.alert("시설물 수정", "수정 실패");
					}
				}
			);
			
		});

		$('#a_cancel_feature').click(function(){
			// 우측 속성수정 및 저장버튼이 있는 메뉴 비활성화
			$("#div_layout").layout("collapse", "east");
			
			that.editLayer.getSource().clear(true);
		});
	}
};