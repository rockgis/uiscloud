/**
 * 파일명 : properties.js
 * 설명 : 전역변수를 지정하는 파일
 * 
 * 수정일       수정자   수정내용
 *----------   -------  --------------------------------------------------
 *2013.09.27	  	최원석		최초생성
 *2013.11.05    	이민규    검색 부분 칼럼 정의 상수 추가.
 *2013.11.21    	정봉화    칼럼 정의 중복없이 하나로 통일
 *2013.12.18    	정봉화    그리드에 formatter 정의.
 *2013.01.06		최원석		운영환경 정의 
 */

// 지도객체 
var map;
// 색인도 지도 객체
var indexMap;
// 화면 저장 객체
var saveMap;

// 지도 서비스 주소
// 운영서버
var gisUrl = "${bies.gisserver}";

var prefix = "sktbigis:";

//좌표계 설정
//Proj4js.defs["EPSG:5181"] = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
//var EPSG900913 = new OpenLayers.Projection("EPSG:900913");
//var EPSG5181 = new OpenLayers.Projection("EPSG:5181");

// 요청 레이어가 없는 경우 화면에 빨간 창이 뜨는 것을 막기 위해서 빈 레이어를 초기에 추가 (임시 : 행정구역 레이어)
var blankLayer = "sktbigis:blank_layer";

/* 
 * 기본 레이어 목록 - 화면 로딩 시 보일 레이어명 지정
 * 초기 - 시도, 시군구, 읍면동, 리 ["TL_SCCO_CTPRVN_25", "TL_SCCO_SIG_25", "TL_SCCO_EMD_25", "TL_SCCO_LI_25"]
 */
var baseLayers = {
	// 시도
	"CTPRVN" : {
		layer : "TL_SCCO_CTPRVN_25",
		korName : "시도",
		visibility : true
	},
	// 시군구
	"SIG" : {
		layer : "TL_SCCO_SIG_25",
		korName : "시군구",
		visibility : true
	},
	// 읍면동
	"EMD" : {
		layer : "TL_SCCO_EMD_25",
		korName : "읍면동",
		visibility : true
	},
	// 리
	"RI" : {
		layer : "TL_SCCO_LI_25",
		korName : "리",
		visibility : true
	}
};

// 검색 결과 기본 스타일
var searchLayerStyle = {
	strokeWidth : 6,
	strokeColor : "#ffff00",
	fillOpacity : 0.5,
	fillColor : "#ff0000",
	strokeDashstyle : "solid"
};

// 그리드 일련번호
var gridIdex = 0;

// 그리드 크기 값.
var commonGridWidth = 2000;                        
var commonGridHeight = 130;

//검색 부분 그리드 칼럼 정의.
var commonGridColumns = [
    {field:"assetsNo",title:"자산번호", width:120, halign:"center", align:"left", sortable:true},
  	{field:"prprtyKndNm", title:"종류", width:40, halign:"center", align:"left", sortable:true},
  	{field:"areaNm",title:"주소", width:180, halign:"center", align:"left", sortable:true},
  	{field:"regstrQy",title:"대장면적(㎡)", width:100, halign:"center", align:"right", sortable:true, formatter:gfnFormatNumber},
  	{field:"regstrAmount",title:"대장가액(원)", width:100, halign:"center", align:"right", sortable:true, formatter:gfnFormatNumber},
  	{field:"acqsDeNm",title:"취득일자", width:100, halign:"center", align:"left", sortable:true},
  	{field:"prprtySeNm",title:"재산구분", width:100, halign:"center", align:"left", sortable:true},
  	{field:"jrsdNm",title:"소관", width:100, halign:"center", align:"left", sortable:true},
  	{field:"onlnGrfcNm",title:"일선관서", width:120, halign:"center", align:"left", sortable:true},
  	{field:"assetsNm",title:"자산명", width:120, halign:"center", align:"left", sortable:true},
  	{field:"assetsGroupNo",title:"자산그룹", width:80, halign:"center", align:"left", sortable:true},
  	{field:"bogLndcgrNm",title:"공부지목", width:50, halign:"center", align:"left", sortable:true},
  	{field:"sttusLndcgrNm",title:"현황지목", width:50, halign:"center", align:"left", sortable:true},
  	{field:"pblonsipAt",title:"공유", width:30, halign:"center", align:"center", sortable:true},
  	{field:"useAccdtNm",title:"사용실태", width:50, halign:"center", align:"left", sortable:true},
  	{field:"prposAreaNm",title:"용도지역", width:80, halign:"center", align:"left", sortable:true},
  	{field:"propsAreaSeNm",title:"용도지구", width:80, halign:"center", align:"left", sortable:true},
  	{field:"ctyPlanFcltyNm",title:"도시계획시설", width:80, halign:"center", align:"left", sortable:true}
  	/*,{field:"lglCdNo",title:"토지코드", width:100, halign:"center", align:"left"} */
];

//도로명 및 건물명칭 전용 검색 부분 그리드 칼럼 정의.
var commonGridColumnsRoadBuld = [
	{field:"oldAddr",title:"지번주소", width:400, halign:"center", align:"left"},
	{field:"newAddr",title:"도로명주소", width:400, halign:"center", align:"left"}
];

// 정보 보기 팝업 객체 배열. 나중에 모두 삭제할 때 사용된다.
var infoPopups = []; 