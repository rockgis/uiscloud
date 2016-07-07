var dataCnt = 0;
var oddCnt = 0; // 홀수번째 케이블들의 연결선번 갯수의 합
var oddCnt1 = 0;    // 홀수번째 케이블들의 갯수의 합
var evenCnt = 0;    // 짝수번째 케이블들의 연결선번 갯수의 합
var evenCnt1 = 0;   // 짝수번째 케이블들의 갯수의 합
var heightCnt;      // 캔버스의 세로 길이값

var kBoardWidth = 5;
var kBoardHeight = 0;    
var kPieceWidth = 100;
var kPieceHeight= 20;
var kPixelWidth = 0;
var kPixelHeight= 0;
var gCanvasElement;
var gDrawingContext;
var gPattern;

var gPieces;
var gNumPieces;
var gSelectedPieceIndex;
var gSelectedPieceHasMoved;
var gMoveCount;
var gMoveCountElem;
var gGameInProgress;

var dataResult = [];
var dataResult2 = [];
var dataResult3 = [];

function fn_getAccessDetailInfo(p) {
    dataResult = [];
    dataResult2 = [];
    dataResult3 = [];
    $("#detailLeftView").html("");
    $("#detailRightView").html("");
    
    var url = "";
//    alert("fn_getAccessDetailInfo in : "+p+"\nunqMgno : "+$("#unqMgno").val());    //
    if (p == "temp") {
        url = "/tbies/getTempAccessInfo.do"; 
    }else if(p == 'current'){
        url = "/tbies/getAccessInfo.do";
    }
    
    var acceptType = "json";
    var unqMgno = $("#unqMgno").val();
    var params = {unqMgno: unqMgno};
//    alert("params : "+JSON.stringify(params));
    //$.mobile.changePage("#accessDetail", "slide", false, false);
    
    

	 $.get(
			 url
			, params
       	,function(response) {
       		if(response) {

       			
       			debugger;
	        		
       			
       			

                var data = response;   
                
                var jpMgnoResult = data.jpMgnoList;
                var cableCntResult = data.cableCnt;
                var accessInfoResult = data.accessInfo;

                if (jpMgnoResult !=0) {
                        var JP_MGNO = JSON.stringify(jpMgnoResult[0].JP_MGNO);  // LT_LINE_MGNO
                        var UNQ_MGNO = JSON.stringify(jpMgnoResult[0].UNQ_MGNO);
                        dataResult.push({"jpMgno" : JP_MGNO, "jpUnqMgno" : UNQ_MGNO});    
                }else{
                    alert("jpMgnoResult error");
                }
                
                if (cableCntResult !=0) {
                    for ( var i = 0; i < cableCntResult.length; i++) {
                        var CABLECNT = JSON.stringify(cableCntResult[i].cableCnt);
                        var CABLENM = JSON.stringify(cableCntResult[i].cableNm);  //split('?')
                        dataResult2.push({"cableCnt" : CABLECNT, "cableNm" : CABLENM});
                    }
                }else{
                    alert("cableCntResult error");
                }
                
                if (accessInfoResult !=0) {
                    for ( var i = 0; i < accessInfoResult.length; i++) {
                        var datas = [];
                        
                        for ( var x = 0; x < accessInfoResult[i].length; x++) {
                            var CABLE = JSON.stringify(accessInfoResult[i][x].CABLE);
                            var LINE_MGNO = JSON.stringify(accessInfoResult[i][x].LINE_MGNO);
                            var LTINFO = JSON.stringify(accessInfoResult[i][x].LTINFO);
                            var ELSECABLENM = JSON.stringify(accessInfoResult[i][x].ELSECABLENM);
                            var RTINFO = JSON.stringify(accessInfoResult[i][x].RTINFO);
                            
                            datas.push({"cableNm" : LINE_MGNO, "ltInfo" : LTINFO, "elseCableNm" : ELSECABLENM, "rtInfo" : RTINFO, "sunInfo" : CABLE });
                        }
                        dataResult3.push(datas);
                    }
//                    alert("dataResult3 arr1 : "+JSON.stringify(dataResult3[0][1].cableNm));
                }else{
                    alert("accessInfoResult error");
                }
                
                // 현재 상태값 hidden처리 // 현재: current, 임시 : temp
                var jpUnqMgno = (dataResult[0].jpUnqMgno).replace(/"/gi, '');
                $("#connParam").val(p);
                $("#unqMgno").val(jpUnqMgno);
//                alert("connParam : "+$("#connParam").val()+"\n unqMgno : "+$("#unqMgno").val());
                
                // 상세도 기본 정보 세팅
                var dataCnt = dataResult2;

                /* canvas total height */
                for (var i = 0; i < dataCnt.length; i++) {
                    if (i % 2 == 0) {
                        evenCnt = evenCnt + Number(dataCnt[i].cableCnt);
                        evenCnt1 = evenCnt1+1;
                    }else{
                        oddCnt = oddCnt + Number(dataCnt[i].cableCnt);
                        oddCnt1 = oddCnt1+1;
                    }
                }

                if (evenCnt < oddCnt) {
                    heightCnt = oddCnt1 + oddCnt;
                }else{
                    heightCnt = evenCnt1 + evenCnt;
                }
                
                kBoardHeight= heightCnt;
                kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
                kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

                // 캔버스 초기화
                initGame(null, document.getElementById('movecount'));
                newGame();
                
                return kPixelWidth, kPixelHeight;
          
       		}
       		else {
       			alert("drawDetailJp error code");
       		}
       	},
       	"json"
   );
    
    /*
    // get the data from server
    $.post(url,acceptType, params, function(jsondata) {      
            
            var data = JSON.parse(jsondata);   
            
            var jpMgnoResult = data.jpMgnoList;
            var cableCntResult = data.cableCnt;
            var accessInfoResult = data.accessInfo;

            if (jpMgnoResult !=0) {
                    var JP_MGNO = JSON.stringify(jpMgnoResult[0].JP_MGNO);  // LT_LINE_MGNO
                    var UNQ_MGNO = JSON.stringify(jpMgnoResult[0].UNQ_MGNO);
                    dataResult.push({"jpMgno" : JP_MGNO, "jpUnqMgno" : UNQ_MGNO});    
            }else{
                alert("jpMgnoResult error");
            }
            
            if (cableCntResult !=0) {
                for ( var i = 0; i < cableCntResult.length; i++) {
                    var CABLECNT = JSON.stringify(cableCntResult[i].cableCnt);
                    var CABLENM = JSON.stringify(cableCntResult[i].cableNm);  //split('?')
                    dataResult2.push({"cableCnt" : CABLECNT, "cableNm" : CABLENM});
                }
            }else{
                alert("cableCntResult error");
            }
            
            if (accessInfoResult !=0) {
                for ( var i = 0; i < accessInfoResult.length; i++) {
                    var datas = [];
                    
                    for ( var x = 0; x < accessInfoResult[i].length; x++) {
                        var CABLE = JSON.stringify(accessInfoResult[i][x].CABLE);
                        var LINE_MGNO = JSON.stringify(accessInfoResult[i][x].LINE_MGNO);
                        var LTINFO = JSON.stringify(accessInfoResult[i][x].LTINFO);
                        var ELSECABLENM = JSON.stringify(accessInfoResult[i][x].ELSECABLENM);
                        var RTINFO = JSON.stringify(accessInfoResult[i][x].RTINFO);
                        
                        datas.push({"cableNm" : LINE_MGNO, "ltInfo" : LTINFO, "elseCableNm" : ELSECABLENM, "rtInfo" : RTINFO, "sunInfo" : CABLE });
                    }
                    dataResult3.push(datas);
                }
//                alert("dataResult3 arr1 : "+JSON.stringify(dataResult3[0][1].cableNm));
            }else{
                alert("accessInfoResult error");
            }
            
            // 현재 상태값 hidden처리 // 현재: current, 임시 : temp
            var jpUnqMgno = (dataResult[0].jpUnqMgno).replace(/"/gi, '');
            $("#connParam").val(p);
            $("#unqMgno").val(jpUnqMgno);
//            alert("connParam : "+$("#connParam").val()+"\n unqMgno : "+$("#unqMgno").val());
            
            // 상세도 기본 정보 세팅
            var dataCnt = dataResult2;

             canvas total height 
            for (var i = 0; i < dataCnt.length; i++) {
                if (i % 2 == 0) {
                    evenCnt = evenCnt + Number(dataCnt[i].cableCnt);
                    evenCnt1 = evenCnt1+1;
                }else{
                    oddCnt = oddCnt + Number(dataCnt[i].cableCnt);
                    oddCnt1 = oddCnt1+1;
                }
            }

            if (evenCnt < oddCnt) {
                heightCnt = oddCnt1 + oddCnt;
            }else{
                heightCnt = evenCnt1 + evenCnt;
            }
            
            kBoardHeight= heightCnt;
            kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
            kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

            // 캔버스 초기화
            initGame(null, document.getElementById('movecount'));
            newGame();
            
            return kPixelWidth, kPixelHeight;
      });*/
}

/////////////////////////////////////////
    
function Cell(row, column) {
    this.row = row;
    this.column = column;
}

function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
    x = e.pageX;
    y = e.pageY;
    }
    else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
    var cell = new Cell(Math.floor(y/kPieceHeight), Math.floor(x/kPieceWidth));
    return cell;
}

function halmaOnClick(e) {  // gNumPieces : 4
//  alert("onclick11");
    var cell = getCursorPosition(e);
    
    if(cell.column == '1'){ // || cell.column == '1'
//      alert("halmaOnClick if "+cell.column+",    "+gPieces(0).column);
        for (var i = 0; i < heightCnt; i++) {   //as-is gNumPieces
            if ((gPieces(i).row == cell.row) && (gPieces(i).column == cell.column)) {
//              alert("halmaOnClick if 111 : "+i+"\ncell.column : "+cell.row);
                clickOnPiece(i, cell.column);
                return;
            }
        }
    }else if(cell.column == '3'){
//      alert("halmaOnClick else if");
        for (var i = 0; i < heightCnt; i++) {
            if ((hPieces(i).row == cell.row) && (hPieces(i).column == cell.column)) {
                clickOnPiece(i, cell.column);
                return;
            }
        }
    }
    
    // 클릭한 케이블 순번 n
//  testfn(n);
    clickOnEmptyCell(cell);
}

function clickOnEmptyCell(cell) {
//  alert("clickOnEmptyCell!! : "+gSelectedPieceIndex);
  if (gSelectedPieceIndex == -1) {alert("clickOnEmptyCell 11"); return; }
  
  var rowDiff = Math.abs(cell.row - gPieces(gSelectedPieceIndex).row);
  var columnDiff = Math.abs(cell.column - gPieces(gSelectedPieceIndex).column);
  alert("rowDiff : "+rowDiff+"\n columnDiff : "+columnDiff);
  
  if ((rowDiff <= 1) && (columnDiff <= 1)) {
      /* we already know that this click was on an empty square,
         so that must mean this was a valid single-square move */
      gPieces(gSelectedPieceIndex).row = cell.row;
      gPieces(gSelectedPieceIndex).column = cell.column;
      gMoveCount += 1;
      gSelectedPieceIndex = -1;
      gSelectedPieceHasMoved = false;
      drawBoard();
      return;
  }
  
  if ((((rowDiff == 2) && (columnDiff == 0)) || ((rowDiff == 0) && (columnDiff == 2)) ||
   ((rowDiff == 2) && (columnDiff == 2))) &&  isThereAPieceBetween(gPieces(gSelectedPieceIndex), cell)) {
      /* this was a valid jump */
          if (!gSelectedPieceHasMoved) {
              gMoveCount += 1;
          }
      gSelectedPieceHasMoved = true;
      gPieces(gSelectedPieceIndex).row = cell.row;
      gPieces(gSelectedPieceIndex).column = cell.column;
      drawBoard();
      return;
  }
  
  gSelectedPieceIndex = -1;
  gSelectedPieceHasMoved = false;
  drawBoard();
}

function clickOnPiece(pieceIndex, celColIndex) {
//alert("clickOnPiece pieceIndex : "+pieceIndex+",   "+gSelectedPieceIndex);
//  if (gSelectedPieceIndex == pieceIndex) {alert("clickOnPiece 11"); return; }
  gSelectedPieceIndex = pieceIndex;
  gSelectedCelColIndex= celColIndex;
//alert("gSelectedPieceIndex : "+gSelectedPieceIndex+"\n gSelectedCelColIndex : "+gSelectedCelColIndex);
  gSelectedPieceHasMoved = false;
  drawBoard();
  elseStroke();
}


function drawBoard() {

  gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);
  gDrawingContext.beginPath();

  /* vertical lines */
  for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
  gDrawingContext.moveTo(0.5 + x, 0);
  gDrawingContext.lineTo(0.5 + x, kPixelHeight);
  }
  
  /* horizontal lines */
  for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
  gDrawingContext.moveTo(0, 0.5 + y);
  gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
  }
  
  /* draw it! */
  gDrawingContext.strokeStyle = "#ccc";//"red";// 
  gDrawingContext.stroke();
  
  var oddJvalue = 0;
  var evenIvalue = 0;

  for (var k = 0; k < dataResult2.length; k++){
      var cableRowCnt = dataResult2[k].cableCnt;
      var aaa123 = eval("dataResult3["+k+"]");

      if ((k % 2) !=0){   //alert("!=0 : "+dataResult.datas[k].cableCnt);       
          var cableCntOddVal = Number(cableRowCnt)+oddJvalue;
          var bineLineFirstPoint = cableCntOddVal + oddJvalue;            // 케이블 선 갯수 + 첫 row 위치값
          var jj=0;
          
          for (var j = oddJvalue; j < cableCntOddVal; j++) {
              drawPiece(hPieces(j) , aaa123[jj].elseCableNm, aaa123[jj].sunInfo);
              vDrawInfo1(aaa123[jj].sunInfo, aaa123[jj].elseCableNm, k, hPieces(j), "d");
              bindLine(hPieces(j), bineLineFirstPoint, k);
              jj++
          }
          oddJvalue = oddJvalue + Number(cableRowCnt)  +1;
      }else if ((k % 2) ==0){// alert("k==0 : "+dataResult2[k].cableCnt);
          var cableCntEvenVal = Number(cableRowCnt)+evenIvalue;
          var bineLineFirstPoint = cableCntEvenVal + evenIvalue;          // 케이블 선 갯수 + 첫 row 위치값
          var ii =0;
          
          for (var i = evenIvalue; i < cableCntEvenVal; i++) {
              drawPiece(gPieces(i), aaa123[ii].elseCableNm, aaa123[ii].sunInfo);
              vDrawInfo1(aaa123[ii].sunInfo, aaa123[ii].elseCableNm, k, gPieces(i), "d");
              bindLine(gPieces(i), bineLineFirstPoint, k);
              ii++
          }
          evenIvalue = evenIvalue + Number(cableRowCnt) +1;
      }

  }
  
//  gMoveCountElem.innerHTML = gMoveCount;

}

/** 묶음라인 정보 생성 (네 좌표 계산) // Parameter (좌표값(row, column), 묶음좌표값, 케이블순서(짝/홀)) **/
function bindLine(p, fp, k){
  var column = p.column;
  var row = p.row;
  
  if ((k % 2) !=0){
      var x = 425;
      var x2 = ((fp*kPieceHeight)/2);
      var xx = (column * kPieceWidth) + kPieceWidth;
      var yy =  (row * kPieceHeight) + (kPieceHeight/2);
  }else if ((k % 2) ==0) {
      var x = 75;
      var x2 = ((fp*kPieceHeight)/2);
      var xx = column * kPieceWidth;
      var yy = (row * kPieceHeight) + (kPieceHeight/2);
  }
  vDrawPiece(x, x2, xx, yy);
}

/** 수직라인 정보 생성 (네 좌표 계산)**/
function vDrawInfo1(sif, ecn, ek, gp, chk){
  var oddJvalue = 0;
  var evenIvalue = 0;
  var column = gp.column;
  var row = gp.row;
  
  if ((ecn != "") && ((ek % 2) ==0)) {
      // 현재 케이블 정보    //  좌표값(col, row)에 따른 시작점, 끝점, (홀/짝)
//    alert("ek % 2) ==0 >"+column+", "+row);
      var x1 = (column * kPieceWidth)+((kPieceWidth*3)/2);    //z
      var x2 =  (row * kPieceHeight) + (kPieceHeight/2);          //w
      
  }else if (ecn && ((ek % 2) !=0)) {
//    alert("ek % 2) !=0 >"+column+", "+row);
      var x1 = (((column * kPieceWidth)*5)/6);                            //x
      var x2 = (row * kPieceHeight) + (kPieceHeight/2);               //y
  }
  
  for (var k = 0; k < dataResult2.length; k++){
      var cableRowCnt = dataResult2[k].cableCnt;
      var otCableNm = dataResult2[k].cableNm
      var aaa123 = eval("dataResult3["+k+"]");

      if (((k % 2)) != 0) {   // 홀수일때
//          alert("vDrawInfo1 (k % 2)) != 0");
          var cableCntOddVal = Number(cableRowCnt)+oddJvalue;
          var jj=0;

          for (var j = oddJvalue; j < cableCntOddVal; j++) {
              
              if (sif == aaa123[jj].sunInfo && otCableNm == ecn) { 
                  var p = hPieces(j);
//                alert("(k % 2)) != 0 > p : "+JSON.stringify(p));
                  var xx = (((p.column * kPieceWidth)*5)/6);
                  var yy = (p.row * kPieceHeight) + (kPieceHeight/2);
              }
              jj++
          }
          oddJvalue = oddJvalue + Number(cableRowCnt)  +1;
      }else if (((k % 2)) == 0) {
//          alert(" vDrawInfo1 (k % 2)) == 0");
          var cableCntOddVal = Number(cableRowCnt)+evenIvalue;
          var jj=0;
          for (var j = evenIvalue; j < cableCntOddVal; j++) {
              if (sif == aaa123[jj].sunInfo && otCableNm == ecn) { 
                  var p = gPieces(j);
                  var xx = 250;//((kPieceWidth*3)/2); //var kPieceWidth = 100;    var kPieceHeight= 20;
                  var yy = (p.row * kPieceHeight) + (kPieceHeight/2);
              }
              jj++
          }
          evenIvalue = evenIvalue + Number(cableRowCnt)  +1;
      }
  }   //   for
  
  // 케이블 네 좌표 계산
  if (chk == "d") {
//    alert(x1+", "+x2+", "+xx+", "+yy);
      vDrawPiece(x1, x2, xx, yy);
      
  }else if (chk == "click") {
      var pp = [{"x1" : x1}, {"x2" :  x2}, {"xx" : xx}, {"yy" : yy}]
      elseDrawPiece("", pp, "", "verticle");
  }
  
//if ((ek % 2) == 0) {
//    alert("==0"+x1+",  "+x2+") , ( "+xx+",  "+yy);
//}else if ((ek % 2) != 0) {
//    alert("!=0"+x1+",  "+x2+") , ( "+xx+",  "+yy);
//}
}

function gPieces(i){
  return new Cell(kBoardHeight - (kBoardHeight-i), 1);
}

function hPieces(j){
  return new Cell(kBoardHeight - (kBoardHeight-j), 3);
}

function vDrawPiece(a, b, c, d){
  gDrawingContext.beginPath();
  gDrawingContext.moveTo(c, d);
  gDrawingContext.lineTo(a, b);
  gDrawingContext.closePath();
  gDrawingContext.strokeStyle = "black";                  // 기본 선 색깔
  gDrawingContext.stroke();
}

/** 라인 draw 
* (p : (column, row), selected : , cNm:케이블이름, sNm:선이름, eCNm:다른케이블이름)**/
function drawPiece(p, eCNm, sNm) {  //, inCableNm   // kPieceWidth : 50, kPieceHeight : 50
//alert("p : "+JSON.stringify(p)+"\neCNm : "+eCNm+"\nsNm : "+sNm);
  var column = p.column;
  var row = p.row;

  /* 라인이 시작되는 좌표값 계산 (y값은 위에서부터 밑으로 계산) */
  if (eCNm !=0 && (column == 1 || column == 2)) { //      var kPieceWidth = 60;   var kPieceHeight= 20;
      var x = column * kPieceWidth;
      var y = (row * kPieceHeight) + (kPieceHeight/2);
      var z = (column * kPieceWidth)+((kPieceWidth*3)/2);
      var w =  (row * kPieceHeight) + (kPieceHeight/2);
//      alert("x : "+x+",   y : "+y+",   z : "+z+",   w : "+w);
  }else if (eCNm !=0 && column == 3) {
      var x = (((column * kPieceWidth)*5)/6);
      var y = (row * kPieceHeight) + (kPieceHeight/2);
      var z = (column * kPieceWidth) + kPieceWidth;
      var w =  (row * kPieceHeight) + (kPieceHeight/2);
  }else if (eCNm == 0) {  //  연결이 없는 라인
      var x = column * kPieceWidth;
      var y = (row * kPieceHeight) + (kPieceHeight/2);
      var z = (column * kPieceWidth) + kPieceWidth;
      var w =  (row * kPieceHeight) + (kPieceHeight/2);
  }
  
  sNm = sNm.replace(/"/gi, '');
  gDrawingContext.beginPath();
  gDrawingContext.moveTo(z, w);
  gDrawingContext.lineTo(x, y);
  gDrawingContext.closePath();
  gDrawingContext.strokeStyle = "black";                  // 기본 선 색깔
  gDrawingContext.fillText(sNm, (x+z)/2, y);              // 라인위에 선번정보 입력
  gDrawingContext.stroke();
  
}

/** 다른 한쪽선 정보 
*  s:선이름([*-*]), e:다른케이블이름, ij:해당라인의 캔버스순서(수직) **/
function elseStroke(){  //s, e, ij
//alert("elseStroke 11");
  var oddJvalue = 0;
  var evenIvalue = 0;
  
  var k = 0;
//for (var k = 0; k < dataCnt.length; k++) {
  while (k < dataResult2.length) {
      
      var cableRowCnt = dataResult2[k].cableCnt;
      var aaa123 = eval("dataResult3["+k+"]");
      
      if(((k % 2) !=0)){  //  e == dataResult.datas[k].cableNm && 
//        alert("(k % 2) !=0 >>"+k);
              var cableCntOddVal = Number(cableRowCnt)+oddJvalue;
              var jj=0;
              
              for (var j = oddJvalue; j < cableCntOddVal; j++) {
                  if (j == gSelectedPieceIndex && gSelectedCelColIndex == '3') {  // s == aaa123.datas[jj].sunInfo
//                    alert("aaa123.datas[jj].sunInfo : "+aaa123.datas[jj].sunInfo+",  "+j);
                      elseDrawPiece(hPieces(j), "", aaa123[jj].elseCableNm,"");
                      vDrawInfo1(aaa123[jj].sunInfo, aaa123[jj].elseCableNm, k, hPieces(j), "click");
                      
//                    var cNm = aaa123.datas[jj].cableNm;
                      var eCNm = aaa123[jj].elseCableNm;    // 클릭된 선의 다른 케이블 정보
                      var sInfo = aaa123[jj].sunInfo;           // 클릭된 선의 연결선번 정보
                      var cNm = aaa123[jj].ltInfo;
                      var enCNm = aaa123[jj].rtInfo;
                      otElseDraw(sInfo, eCNm, enCNm, cNm);
                  }
                  jj++
              }
              oddJvalue = oddJvalue + Number(cableRowCnt)  +1;
      }else if (((k % 2) ==0)){
//        alert("(k % 2) ==0"+k);
          var cableCntEvenVal = Number(cableRowCnt)+evenIvalue;
          var ii =0;
          
          for (var i = evenIvalue; i < cableCntEvenVal; i++) {
              if (i == gSelectedPieceIndex && gSelectedCelColIndex == '1') {//s == aaa123.datas[ii].sunInfo
//                alert("aaa123.datas[ii].sunInfo : "+aaa123.datas[ii].sunInfo+",  "+i);
                  elseDrawPiece(gPieces(i), "", aaa123[ii].elseCableNm,"");     // 클릭한 선 color 변경
                  vDrawInfo1(aaa123[ii].sunInfo, aaa123[ii].elseCableNm, k, gPieces(i), "click");
                  
//                var cNm = aaa123[ii].cableNm;
                  var eCNm = aaa123[ii].elseCableNm;    // 클릭된 선의 다른 케이블 정보
                  var sInfo = aaa123[ii].sunInfo;           // 클릭된 선의 연결선번 정보
                  var cNm = aaa123[ii].ltInfo;
                  var enCNm = aaa123[ii].rtInfo;
                  otElseDraw(sInfo, eCNm, enCNm, cNm);                    // 연결된 반대편 선 color 변경
              }
              ii++;
          }
          evenIvalue = evenIvalue + Number(cableRowCnt) +1;
      }
      
      k++;
  }
}

function otElseDraw(sif, em, enm, cm){  //  eCNm, selectedSunCnt
//alert("otElseDraw : "+em+",   "+sif);
  var evenIvalue2 = 0;
  var oddJvalue2 = 0;
  
  for (var k2 = 0; k2 < dataResult2.length; k2++) {
      var otCableNm = dataResult2[k2].cableNm;

      if ((k2 % 2) !=0) { //otCableNm == ec
//        alert("otElseDraw (k2 % 2) !=0");
          var aaa456 = eval("dataResult3["+k2+"]");
          var cableRowCnt2 = dataResult2[k2].cableCnt;
          var cableCntEvenVal2 = Number(cableRowCnt2)+evenIvalue2;
          var ii = 0;
//        alert("aaa456 : "+JSON.stringify(cableRowCnt2));
          for (var i = evenIvalue2; i < cableCntEvenVal2; i++) {
//            alert("aaa456.datas[ii].sunInfo : "+JSON.stringify(aaa456.datas[ii].sunInfo));
              if (sif == aaa456[ii].sunInfo && otCableNm == em) {
//                alert("sif == aaa456.datas[ii].sunInfo : "+JSON.stringify(hPieces(i))+",  "+i);
                  elseDrawPiece(hPieces(i), "", aaa456[ii].elseCableNm, "");
              }
              ii++;
          }
          evenIvalue2 = evenIvalue2 + Number(cableRowCnt2) +1;
      }else if ((k2 % 2) ==0) {
//        alert("otElseDraw (k2 % 2) ==0");
          var aaa456 = eval("dataResult3["+k2+"]");
          var cableRowCnt2 = dataResult2[k2].cableCnt;
          var cableCntEvenVal2 = Number(cableRowCnt2)+oddJvalue2;
          var jj = 0;

          for (var j = oddJvalue2; j < cableCntEvenVal2; j++) {
//            alert("aaa456.datas[ii].sunInfo : "+JSON.stringify(aaa456.datas[ii].sunInfo));
              if (sif == aaa456[jj].sunInfo && otCableNm == em) {
//                alert("sif == aaa456.datas[ii].sunInfo : "+JSON.stringify(gPieces(j))+",  "+j);
                  elseDrawPiece(gPieces(j), "", aaa456[jj].elseCableNm, "");
              }
              jj++;
          }
          oddJvalue2 = oddJvalue2 + Number(cableRowCnt2) +1;
      }
  }
  
  addElement(cm, enm);
}

/** 다른 한쪽 선 빨간색 표시 **/
function elseDrawPiece(p, pp, eCNm, etc){
//alert("elseDrawPiece : "+JSON.stringify(p));
  
  if (etc == "") {
      var column = p.column;
      var row = p.row;
      
      /* 라인이 시작되는 좌표값 계산 (y값은 위에서부터 밑으로 계산) */
      if (eCNm !=0 && (column == 1)) {    //      var kPieceWidth = 60;   var kPieceHeight= 20;
          var x = column * kPieceWidth;
          var y = (row * kPieceHeight) + (kPieceHeight/2);
          var z = (column * kPieceWidth)+((kPieceWidth*3)/2);
          var w =  (row * kPieceHeight) + (kPieceHeight/2);
      }else if (eCNm !=0 && column == 3) {
          var x = (((column * kPieceWidth)*5)/6);
          var y = (row * kPieceHeight) + (kPieceHeight/2);
          var z = (column * kPieceWidth) + kPieceWidth;
          var w =  (row * kPieceHeight) + (kPieceHeight/2);
      }
  } else if (etc == "verticle") {
      var x = pp[0].x1;
      var y = pp[1].x2;
      var z = pp[2].xx;
      var w= pp[3].yy;
//    alert(x+", "+y+", "+z+", "+w);
  }
//  var x = column * kPieceWidth;
//var y = (row * kPieceHeight) + (kPieceHeight/2);
//var z = (column * kPieceWidth) + kPieceWidth;
//var w =  (row * kPieceHeight) + (kPieceHeight/2);
  
  gDrawingContext.beginPath();
  gDrawingContext.moveTo(z, w);
  gDrawingContext.lineTo(x, y)
  gDrawingContext.closePath();
  gDrawingContext.strokeStyle = "white";//"#000";     // 검은색을 지우기 위한 흰색처리.
  gDrawingContext.stroke();
  gDrawingContext.strokeStyle = "red";//"#000";       // 클릭된 선 빨간색 처리.
  gDrawingContext.stroke();
  
}

/* 클릭된 선의 케이블 정보 */
function addElement(cm, em){
  var str = "";
  var str1 = "";
  
  cm = cm.replace('"', '').replace(']"', '');
  em = em.replace('"', '').replace(']"', '');
  str += "<p>"+em+"</p>";
  str1 += "<p>"+cm+"</p>";

  $("#detailLeftView").html(str);
  $("#detailRightView").html(str1);
}


function newGame() {        //  kBoardHeight : 4

  gSelectedPieceIndex = -1;
  hSelectedPieceIndex = -1;
  gSelectedCelColIndex = -1
  gSelectedPieceHasMoved = false;
  gMoveCount = 0;
  gGameInProgress = true;
  drawBoard();

}

function initGame(canvasElement, moveCountElement) {
  if (!canvasElement) {
      canvasElement = document.getElementById("halma_canvas");
    }
  
    gCanvasElement = canvasElement;
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
    
    gCanvasElement.addEventListener("click", halmaOnClick, false);
    
    //gCanvasElement.on('click', halmaOnClick);
    
    gDrawingContext = gCanvasElement.getContext("2d");
}