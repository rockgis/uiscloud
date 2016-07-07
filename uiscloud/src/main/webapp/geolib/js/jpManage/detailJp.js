var detailJpCanvas = null;
var drawCanvas = {
	init : function(id){
		//div창 기준으로 동적 크기 구해서 초기화해주기
		return new draw2d.Canvas(id);
	}
};

var detailJp = {
	// 엔터키 코드
	KEY_ENTER: 13
	
	, init : function(){
		var that = this;
		
		that.initUI();
	}	
	, initUI : function(){
		var that = this;
		var canvas = detailJpCanvas;
		
		
    	$("#zoomIn").on("click", function(){
    		canvas.setZoom(canvas.getZoom()*0.7,true);
    	});
    	$("#zoomOut").on("click", function(){
    		canvas.setZoom(canvas.getZoom()*1.3, true);
    	});
    	$("#zoomReset").on("click", function(){
    		canvas.setZoom(1.0, true);
    	});
		that.drawDetailJp();
	}	
	//접속상세도그리기
	, drawDetailJp : function(){
		var that = this;

		var searchFilters = {
				searchKeyword : $("#jpMgno").val()
		};
		
		 $.get(
	        	"/titan/jpManage/selectDetailJp"
				, searchFilters
	        	,function(response) {
	        		if(response) {
	        			var boxList = response.boxList;
	        			var cableList = response.cableList;

	        			console.log(boxList);
	        			console.log(cableList);

	        			//박스 그리기
	        			if(boxList && boxList.length >0)
	        				that.drawBackBox(detailJpCanvas, boxList);
	        			if(cableList && cableList.length >0){
		        			//케이블 박스, 버텍스 박스, 포트 그리기
	        				that.drawCableBox(detailJpCanvas, cableList);
	        				//케이블 커넥션 그리기
	        				that.drawCableConn(detailJpCanvas, cableList);
	        			}
	        			
	        		}
	        		else {
	        			alert("drawDetailJp error code");
	        		}
	        	},
	        	"json"
	    );
	}
	//백박스 그리기
	, drawBackBox : function(canvas, boxList){
		var that = this;
		var boxCoordinate =  { X : 10, Y : 30};
		
		for(var i = 0; i < boxList.length; i++){
			 var box = draw.createRectangle(boxCoordinate, 1820, 350, boxList[i].BOX_SNO);
			box.add(new draw2d.shape.basic.Label({text:boxList[i].BOX_NM}), new draw2d.layout.locator.TopLocator(box));
			canvas.add(box);
			
			boxCoordinate.Y += 400;
		}
	}
	, drawCableBox : function(canvas, cableList){
		var that = this;

		var boxSno = "B1";

		var tempCoordinate = {X : 0, Y : 0};
		var coordinate = null; 
		
		//왼쪽오른쪽 방향 정하는 변수
		var direction = 0; 

		var box = null;
		var vertexBox = null;
		var canvasData = canvas.figures.data;
		
		for(var i = 0; i < cableList.length; i++){
			
			
			//해당 백(Back)박스의 좌표 가져오기
			for(var j = 0; j < canvasData.length; j++){
				if(cableList[i].boxSno == canvasData[j].getId()){
					tempCoordinate.X = canvasData[j].getX();
					tempCoordinate.Y = canvasData[j].getY(); 
				}
			}

			//그리던 박스와 현재 케이블 박스가 다르다면
			if(boxSno != cableList[i].boxSno){
				direction = 0;
			}
			
			
			//박스그리기
			coordinate = draw.makeDirection(direction, "box", tempCoordinate);
			box = draw.createRectangle(coordinate, 5, 130, cableList[i].lineMgno); 
			canvas.add(box);
	 		
			//버텍스박스 그리기
			coordinate = draw.makeDirection(direction, "vertexBox", tempCoordinate);
			vertexBox = draw.createVertexBox(canvas, coordinate, "vertex_" + cableList[i].lineMgno);	
			canvas.add(vertexBox);
			
			//포트 그리기
			var cableConnInfo = cableList[i].cableConnInfoVO;
			for(var j = 0; j < cableConnInfo.length; j++){
				//포트 생성
				box.createPort("hybrid", draw.makePortLocator(direction), cableConnInfo[j].lineMgno + cableConnInfo[j].cableConnCore);

				//버텍스박스와 케이블박스의 커넥션
			    var connection = draw.createConnFromVertex(vertexBox.getHybridPort(0), box.getHybridPort(j), vertexBox.getId() + cableConnInfo[j].port);
			    canvas.add(connection);
			}

			boxSno = cableList[i].boxSno;
			direction ++;
		}
	}
	, drawCableConn : function(canvas, cableList){
		var that = this;

		var sourceBox = null;
		var sourcePort = null;
		var targetBox = null;
		var targetPort = null;
		var connection = null;
		var connId = null;
		var label = null;
		
		//케이블정보에서 연결 정보를 가져온다.
		for(var cableCnt = 0; cableCnt < cableList.length; cableCnt ++){
			var cableConnList = cableList[cableCnt].cableConnInfoVO;
			

			//단일의 연결 정보를 가져온다
			for(var cableConnCnt = 0; cableConnCnt < cableConnList.length; cableConnCnt++){
				var cableConnInfo = cableConnList[cableConnCnt];

				//포트 구하기
				sourceBox = draw.getBoxById(canvas, cableConnInfo.lineMgno);
				sourcePort = draw.getPortById(sourceBox, cableConnInfo.lineMgno + cableConnInfo.cableConnCore);
				targetBox = draw.getBoxById(canvas, cableConnInfo.connLingMgno);
				targetPort = draw.getPortById(targetBox, cableConnInfo.connLingMgno + cableConnInfo.cableConnCore);
				
				
				//소스포트가 타겟으로 쓰인 적이 있다면
				if(sourcePort && targetPort){
					//포트 연결!!!!!!!!!
					connInfo = {
							connId : cableConnInfo.lineMgno + cableConnInfo.cableConnCore + cableConnInfo.connLingMgno
							, lineMgno : cableConnInfo.lineMgno
							, cableConnCore : cableConnInfo.cableConnCore
							, ConnLingMgno : cableConnInfo.connLingMgno
					}
				    draw.createConnection(canvas, sourcePort, targetPort, connInfo );
				}
			}
		}
		
		//커넥션이 있다면 클릭 이벤트 적용
		if(sourcePort && targetPort){
			//2015.11.13 이주연
			//이벤트 먹는 순서 : 캔버스->피규어(도형->라인)->폴리시
			//이벤트 순서때문에 커넥션라인에 클릭이벤트보다 백박스의 클릭이 실행됨
			//그렇기 때문에 캔버스에 라인클릭 이벤트를 걸어준다
			canvas.on("dblclick", function(event, args){
				var line = detailJpCanvas.getBestLine(args.x, args.y);
				var lineId = null;
				var connInfo = {source : null, target : null, core1 : null, core2 : null};
				if(line){
					console.log(line.getId());
					lineId = line.getId();
					draw.selectConnLine(detailJpCanvas, lineId);
					connInfo = line.getUserData();
					console.log(connInfo);
					
					//광코어 접속편집 관련 정보 셋팅
					opticalFiberManage.dblClickConn(connInfo);
				}
			}); 
		}
		
	}
};



