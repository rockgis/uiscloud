var gridInit = {
		// 페이징옵션
		pagingOptions : {
	        pageSizes: [20, 50, 100],
	        pageSize: 20,
	        currentPage: 1
	    },
	    // 필터옵션
		filterOptions : {
		        filterText: "",
		        useExternalFilter: true
	    },
	    infoData : null
};

var uiInit = {
	//접속함체 셋팅
	setJpCombobox : function(jpCombobox, jpMgno){
	  $.get(
	  	"/titan/jpManage/selectJp?jpMgno=" + jpMgno,
	  	function(response) {
	  		if(response && response.jpList) {
	  			var jpList = response.jpList;
	  			jpCombobox.combobox({
	  				data: jpList,
	  				valueField : 'CODE',
	  				textField : 'NAME',
	  				editable : false
	  			});
	  		}
	  		else {
	  			alert("setJpCombobox error code");
	  		}
	  	},
	  	"json"
	  );
	}
	//접속함체 케이블 셋팅
	, setJpCableCombobox : function(jpCableCombobox, jpCableList){
	  $.get(
	      	"/titan/jpManage/selectJpCableList?jpCableList=" + jpCableList,
	      	function(response) {
	      		if(response && response.jpCableList) {
	      			var jpCableList = response.jpCableList;
	      			jpCableCombobox.combobox({
	      				data: jpCableList,
	      				valueField : 'CODE',
	      				textField : 'NAME',
	      				editable : false
	      			});
	      		}
	      		else {
	      			alert("setJpCableCombobox error code");
	      		}
	      	},
	      	"json"
	  );
	}
	
	//접속함체 선번 셋팅
	, setJpInputOutputCombobox : function(jpInputCombobox, jpOutputCombobox, jpCableMgno){
	  $.get(
	      	"/titan/jpManage/selectJpCableInputOutput?jpCableMgno=" + jpCableMgno,
	      	function(response) {
	      		if(response && response.result) {
	      			var list = [];
	      			for(var i =0; i < response.result[0].CNT; i++){
	      				list.push({CODE : i+1});
	      			}
	      			
	      			jpInputCombobox.combobox({
	      				data: list,
	      				valueField : 'CODE',
	      				textField : 'CODE',
	      				editable : false
	      			});
	      			
	      			jpOutputCombobox.combobox({
	      				data: list,
	      				valueField : 'CODE',
	      				textField : 'CODE',
	      				editable : false
	      			});
	      		}
	      		else {
	      			alert("setJpInputOutputCombobox error code");
	      		}
	      	},
	      	"json"
	  );
	}
	//임시연결케이블 셋팅
	, setTempCableCombobox : function(tempCableCombobox, jpMgno){
	  $.get(
	      	"/titan/jpManage/selectTempCableList?jpMgno=" + jpMgno,
	      	function(response) {
	      		if(response && response.result) {
	      			var list = response.result;
	      			tempCableCombobox.combobox({
	      				data: list,
	      				valueField : 'CODE',
	      				textField : 'NAME',
	      				editable : false
	      			});
	      		}
	      		else {
	      			alert("setTempCableCombobox error code");
	      		}
	      	},
	      	"json"
	  );
	}
	//케이블 아이디로 지도이동하기
	, moveMapByCableMgno : function(cableMgno){
		console.log("함수완성해주세염..");
	}
};




//draw2d관련 커스텀
var draw = {
		
	//박스 그리기
	createRectangle : function(coordinate, width, height, id){
		var box = new draw2d.shape.basic.Rectangle({
			width : width, height : height
			, x : coordinate.X, y : coordinate.Y
	        , radius: 5
	        , selectable : false , resizeable : false//, visible : false
			, bgColor : {red:255, green:255, blue:255} 
			, color : {red:255, green:255, blue:255} 
		});
	 	box.setId(id);
	 	
	 	//박스 관련 상위 이벤트 오버라이딩
		box.onDoubleClick = function(){}; //회전
		box.onDragStart  = function(){}; //이동
		box.onDrag = function(){};
		box.onDragEnd  = function(){};
		
		return box;
	}
	//버텍스 박스 그리기
	, createVertexBox : function(canvas, coordinate, id){
		var that = this;
		var vertexBox = null;
		vertexBox = that.createRectangle(coordinate, 5, 10, id);  
		vertexBox.createPort("hybrid");
		return vertexBox;
	}
	//버텍스박스와 케이블박스 커넥션 만들기
	, createConnFromVertex : function(sourcePort, targetPort, id){
	    var connection = new draw2d.Connection();
	    connection.setRouter(new draw2d.layout.connection.DirectRouter());
		connection.setSource(sourcePort);
		connection.setTarget(targetPort);
		connection.setId(id);
		return connection;
	}
	, createConnection : function(canvas, sourcePort, targetPort, connInfo){
		var that = this;
	    var connection = null;
	    
	    //타켓포트쪽에 같은 커넥션이 없을때 새로운 커넥션을 만든다.
		if(!that.getConnectionAgreeFromTargetPort(targetPort, connInfo)){
		    connection = new draw2d.Connection();
			connection.setSource(sourcePort);
			connection.setTarget(targetPort);
			connection.setId(connInfo.connId);
			connection.setUserData(connInfo);

		    //라벨추가 
		    connection = draw.addLabel(connection, connInfo.cableConnCore, "label_" + connInfo.connId);
		    canvas.add(connection);
		}
	}
	, getConnectionAgreeFromTargetPort : function(targetPort, connInfo){
		var connData = targetPort.getConnections().data;
		
		if(connData){
			var id = connInfo.connLingMgno + connInfo.cableConnCore + connInfo.lineMgno;
			for(var i = 0; i < connData.length; i++){
				if(connData[i].getId() == id){
					return true;
				}
			}
		}
		return false;
	}
	//박스 그릴 좌표 구하기
	, makeDirection : function(direction, boxKind, backBox){
		var box = {X : 0, Y: 0};

		if(boxKind == "box"){
			//짝수라면 왼쪽
			if(direction%2 == 0){
				box.X = 40;
			}else{
				--direction;
				box.X = 1750;					
			}
			box.Y = backBox.Y + 30 + (90 * direction);				
		}
		//vertex
		else{
			//짝수라면 왼쪽
			if(direction%2 == 0){
				box.X = 10;
			}else{
				--direction;
				box.X = 1820;					
			}
			box.Y = backBox.Y + 80 + (90 * direction);
		}
		return box;
	}
	, makePortLocator : function(direction){
		var portLocator = null;
		
		//짝수라면 아웃풋
		if(direction%2 == 0){
			portLocator = new draw2d.layout.locator.OutputPortLocator();
		}else{
			portLocator = new draw2d.layout.locator.InputPortLocator();
		}
		return portLocator;
	}
	, addLabel : function(figure, text, id){
	    var label = new draw2d.shape.basic.Label({text:text, stroke:1, color:"#CECECE", fontColor:"#0d0d0d"});
	    label.setId(id);
	    figure.add(label, new draw2d.layout.locator.FromSourceLocator());
	    return figure;
	}
	, getBoxById : function(canvas, id){

		var canvasData = canvas.figures.data;
		var box = null;
		
		for(var i = 0; i < canvasData.length; i++ ){
			if(canvasData[i].getId() == id){
				box = canvasData[i]; 
			}
		}
		return box;
	}
	, getPortById : function(box, id){
		var portData = box.getPorts().data;
		var port = null;
		if(portData){
			for(var i = 0; i< portData.length; i++){
				if(portData[i].getId() == id){
					port = portData[i];
				}
			}
		}
		
		return port;
	}
	, selectConnLine : function(canvas, id){
		var that = this;
		var lineData = canvas.getLines().data;
		if(lineData){
			for(var i =0; i < lineData.length; i++){
				if(lineData[i].getId() == id){
					lineData[i].setColor("#FF0000");
					lineData[i].setStroke(3);
					lineData[i].toFront();
				}
				else{
					lineData[i].setColor("#000000");
					lineData[i].setStroke(1);
				}
				that.selectConnLineLabel(lineData[i], "label_" + id);
			}
		}
	}
	, selectConnLineLabel : function(line, id){
		var labelData = line.getChildren().data;
		
		if(labelData){
			for(var i=0; i < labelData.length; i++){
				if(labelData[i].getId() == id){
					labelData[i].setColor("#FF0000");
				}
				else{
					labelData[i].setColor("#CECECE");
				}
			}
		}
	}
};


//테스트를 위한 상수 설정
//var staticJpMgno = '11110JP001511';
//var staticJpCableList = ['11110CA002005','11140CA002999','11110CA002523','11140CA003712','11140CA007179','11110CA002524','11140CA005417'];
//var staticJpCableMgno = '11110CA002005';


var staticJpMgno = '11140JP001051';
var staticJpCableList = ['11110CA001070',
                         '11110CA001688',
                         '11140CA001372',
                         '11140CA001426',
                         '11140CA001427',
                         '11140CA001517',
                         '11140CA001518',
                         '11140CA001984',
                         '11140CA001985',
                         '11140CA002378',
                         '11140CA002454,',
                         '11140CA002671',
                         '11140CA005214',
                         '11140CA005819'];
var staticJpCableMgno = '11110CA001070';




$("#jpMgno").val(staticJpMgno); 
