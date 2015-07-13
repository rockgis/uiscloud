/**
 * 
 * @Script Name  : layerTree.js
 * @Description : 레이어 트리
 * @Modification Information  
 * @
 * @   수정일       수정자수정  내용
 * @ -------------  ----------  ---------------------------
 * @  2014. 01. 23.  김종민      최초생성
 */

"use strict";

var layerTree = {
	// EasyUI checkbox tree 의 onCheck 이벤트가 트리 생성 시 발생하지 않도록 처리
	treeLoadingCounter: 0,
	// EasyUI checkbox tree 갯수
	treeCount: 1,
	// EasyUI checkbox tree 생성을 위해 최상위 root 정보를 보관 json
	root: null,
	// EasyUI checkbox tree 의 depth 를 맞추기 위해 각 레벨별 마지막 노드 정보 를 저장할 array
	depth: null,
		
	/**********************************************************************
	설명 : 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 	
	init: function() {
		var that = this;
		
		that.initUi();
	},	
	
	/**********************************************************************
	설명 : 화면 Ui 작업 jeasyui (validatebox, datagrid)
	파라메터 :
	리턴값 :
	***********************************************************************/
	initUi: function() {
		var that = this;
		
		that.loadLayerTree();
	},
	
	/**********************************************************************
	설명 : 왼쪽메뉴 - EasyUI checkbox tree 생성 - Ajax 이용
	파라메터 :
	리턴값 :
	***********************************************************************/
	loadLayerTree: function () {
		// easyUI checkboxTree
		// 레이어 트리
		var that = this;
		
		var url = "/bies/selectLayerTreeList";
		
		$.ajax({
	        type: "GET",
	        //url: "/bies/xml/THEMA.json",
	        url: url,
	        dataType: "json",
	        contentType: "charset=UTF-8",
	        success: function(jsonData){
	        	// 서버로부터 받은 BIES DB 레이어 정보(jsonData)로부터 Tree 생성
	        	that.makeTree(jsonData, $("#ul_layer_tree"));
	            
	            // 레이어 트리 체크 박스 onCheck 이벤트 등록
	            $("#ul_layer_tree").tree({
	            	onCheck: function(node) {
	            		that.bindEventLayersCheck(this);
	            	}, 
	                onLoadSuccess: function(node,data){
	                	// EasyUI checkbox tree 의 onCheck 이벤트가 트리 생성 시 발생하지 않도록 처리
	    	            that.treeLoadingCounter++;
	                }
	        	});
	            
	            // 초기 레이어 표시
	            that.bindEventLayersCheck($("#ul_layer_tree")[0], true);
	        }
	    });    
	},
	
	/**********************************************************************
	설명 : 왼쪽메뉴 - EasyUI checkbox tree onCheck 이벤트 핸들러
	파라메터 : 트리 id
	리턴값 : 선택된 트리의 LayerName 들(json)
	***********************************************************************/
	bindEventLayersCheck: function (tree, isInit) {
		var that = this;
		
		var layerName;
		
		// EasyUI checkbox tree 의 onCheck 이벤트가 트리 생성 시 발생하지 않도록 처리
		 if (this.treeLoadingCounter < this.treeCount) {
		        return;
		 }
	
	   var jsonLayerNames = [];
	   var jsonLayerStyles = [];
	   var jsonKorNames = [];
	
	   var nodes = $(tree).tree('getChecked');
	   
//	   console.dir(nodes);
	   
	   // check 된 트리 노드를 순회하면서 json 에 layerName 들 push
	   $(nodes).each(function() {
	        if (this.attributes && this.attributes.layerName) {
	           jsonLayerNames.push(this.attributes.layerName);
	           jsonLayerStyles.push(this.attributes.symbolizer);
	           jsonKorNames.push(this.text);
	       }
	   });
	   
	   // 레이어 순서를 반대로 변경
	   jsonLayerNames.reverse();
	   jsonLayerStyles.reverse();
	   
	   // 레이어 on/off 에 보낼 레이어 리스트
	   var layerList = jsonLayerNames.join();
	   var layerSymbolizer = jsonLayerStyles.join();
	   
	   // 개발시에만 사용할 소스 (IE7 에서는 2000자 기준 - 레이어 명을 제외한 문자열이 300 정도 됨)
		if(layerList.length > 1700) {
			$.messager.alert("알림", "레이어 목록이 너무 깁니다.\n레이어 명 : " + layerName);
		}
		if (tree.id == "ul_layer_tree") {
			layerName = "biesLayer";
		}
		else {
			$.messager.alert("알림", "존재하지 않는 트리 아이디 입니다.");
		}
		
		// 레이어 on/off
		gfnMergeNewParams(layerName, layerList,layerSymbolizer);
		
		// 레벨 이동 확인
//		if(!isInit && map.getZoom() < 10) {
//			message.getConfirm("MSG1010", function(isTrue) {
//				if(isTrue) {
//					map.zoomTo(10);	
//				}
//			});	
//		}
	},
	
	/**********************************************************************
	설명 : 왼쪽메뉴 - EasyUI checkbox tree 생성
	파라메터 : 서버에서 받은 Layer 목록 json, tree id
	리턴값 :
	***********************************************************************/
	makeTree: function (jsonData, target) {
		var that = this;
		
	    that.root = [];
	    that.depth = {};
	    
	    that.depth[0] = that.root;
	    
	    var jsonLength = jsonData.layerList.length;
	    
	    // 재귀 호출을 통해 서버에서 받은 jsonData 를 EasyUI tree 용 json 으로 변환
	    that.makeLayerTree(that.root, jsonData.layerList, 0, jsonLength - 1);
	    
	    // target Ul 요소에 트리 생성
	    target.tree({
	    	checkbox : true,
	        data: that.root
	    });
	},
	
	/**********************************************************************
	설명 : 재귀 호출을 통해 서버에서 받은 jsonData 를 EasyUI tree 용 json 으로 변환
	파라메터 : StringBuffer, layerList, currentIndex, size
	리턴값 : json 형식의 문자열
	***********************************************************************/
	makeLayerTree: function (targetNode, layerList, currentIndex, maxIndex){
		var that = this;
		
		// 서버로 부터 받은 레이어 json 객체로부터 로우 하나 취득
		var currentTree = layerList[currentIndex];
		
		// tree 에 장착할 node 생성
	    var currentNode = {
	        "id": currentTree.layerTreePk,
	        "text": currentTree.korNameForLayerTree,
	        "iconCls": currentTree.condition,
	        "state": (currentTree.opened === true) ? "open": "closed",
	        "checked": currentTree.checked,
	        "attributes": {
	            "layerName": currentTree.layerName,
	            "symbolizer": currentTree.symbolizer
	        }
	    };
		
	    // tree 에 노드 장착
		targetNode.push(currentNode);
		
		// 자신을 현재 depth 의 최종으로 등록
		that.depth[currentTree.treeDepth] = currentNode;
		
		if (currentIndex < maxIndex) { 
			// 자신과 다음 노드를 비교
			var curretTreeDepth = currentTree.treeDepth;
	        var nextTreeDepth = layerList[currentIndex + 1].treeDepth;
	        
	        if (curretTreeDepth == nextTreeDepth) {
	        // 다음 노드가 자신과 같은 depth 인 경우 같은 부모 노드 사용
	        	
	        } else if (curretTreeDepth < nextTreeDepth) {
	        // 다음 노드가 자신보다 depth 가 높은 경우 다음 노드는 자식 노드임으로
	        // 다음 노드를 자식노드로 등록하기 위해 준비
	            currentNode.children = [];
				targetNode = currentNode.children;
	        } else if (curretTreeDepth > nextTreeDepth) {
	        // 다음 노드가 자신보다 depth 가 낮은 경우 조상 depth 임
				if (nextTreeDepth == 1) {
	            // 다음 노드의 depth 가 1 인 경우 최상위 노드임으로 tree root 에 등록하기 위해 준비		
					targetNode = that.root
				} else {
				// 다음 노드의 depth 가 1 아닌 경우 부모 노드의 children 속성에 배열 형태로 등록하기 위해 준비
					targetNode = that.depth[nextTreeDepth - 1].children;
				}
	        }
			
	        // 마지막 노드 까지 재귀 호출을 통해 json 객체 완성
	        // targetNode 을 선정하는 알고리즘에 주의해서 볼 껏
			that.makeLayerTree(targetNode, layerList, currentIndex + 1, maxIndex);
	    }
	}
};