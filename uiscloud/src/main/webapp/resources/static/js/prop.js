/**
 * UIS Geo Library
 * User Properties Object
 */
var prop = {
	map : {
		currentMapType : "v" // 현재 배경지도 타입
		,targetDiv : 'div_map' // 지도가 그려질 DIV 엘리먼트의 ID
		,renderer : 'canvas' // 랜더링 방식
	},
	view : {
		
	},
	layers : {
		backgroudLayer : {},
		wmsLayer : {},
		vectorLayer : {}
	},
	/**
	 * 지도 기본 Control 정의
	 * 1. options.element : 컨트롤이 사용할 버튼 엘리먼트를 따로 생성해서 지정할 수 있다.
	 * 2. options.target : 컨트롤이 보여질 div 엘리먼트 (target을 따로 지정하지 않을 경우 div_map안에 컨트롤명div 엘리먼트를 생성하여 보여준다.)
	 *                     target 지정후에 ol.css에 지정된 스타일이 적용되어 그부분을 수정하여 화면에 표출한다.
	 * 
	 */
	controls : [
	    new ol.control.Attribution(),
	    new ol.control.MousePosition({
	    	target : goog.dom.getElement('mousePosition_div'), // 좌표가 보여질 div 엘리먼트
	    	undefinedHTML: '마우스가 지도를 벗어났습니다.',
	    	projection: 'EPSG:3857',
	    	coordinateFormat: function(coordinate) {
	    		return ol.coordinate.format(coordinate, '{x}, {y}', 4);
	    	}
	    }),
		new ol.control.OverviewMap({
			collapsed: false
		}),
		new ol.control.Rotate({
			autoHide: false
		}),
		new ol.control.ScaleLine(),
		new ol.control.Zoom(),
		new ol.control.ZoomSlider(),
		new ol.control.ZoomToExtent(),
		new ol.control.FullScreen()
	],
	dataServer : {
		type : 'GeoServer' // GIS 엔진 종류
		,url : 'http://211.58.18.254:8180/sktbigis' // GIS 엔진 URL
		//,url : 'http://localhost:8180/geoserver/uis' // GIS 엔진 URL
		,
	},
	etc : {
		
	}
};

/**
 * History Navigator(이전/다음) 기능을 위한 Properties
 */
var historyStack = new ol.Collection();
var index = -1;
var flag = false; // 이전/다음에 의한 지도 이동인지 아닌지 판단

/**
 * 좌표계 정의
 */
// Vworld 좌표계 정의
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");
// Daum 좌표계 정의
proj4.defs("EPSG:5181", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
// Naver 좌표계 정의
proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs");

/**
 * Layer 정의
 */
// 배경지도 Layer 정의
var initType = 'Street';

var vworldLayer = new ol.layer.Tile({
	source : new ol.source.VworldMaps({
		type : initType,
		maxZoom : 23
	})
});

var daumLayer = new ol.layer.Tile({
	source: new ol.source.DaumMaps({ type : initType, maxZoom : 14 })
});

var naverLayer = new ol.layer.Tile({
	source: new ol.source.NaverMaps({ type : initType, maxZoom : 14 })
});

// WMS Layer 정의
var imageWMSOption = {
		/*
		 * logo: 'http://some_server/my_logo_is_here', attributions: [ new
		 * ol.Attribution({ html: 'This tiles comes from ...' }) ],
		 */
		url : 'http://211.58.18.254:8180/sktbigis/wms',
		//url : 'http://localhost:8180/geoserver/uis/wms',
		params : {
			'LAYERS' : 'sktbigis:bd_object_cable',
			//'LAYERS' : 'uis:moct_link',
			'CRS' : "EPSG:3857",
			'FORMAT' : 'image/png'
		},
		serverType : 'geoserver'
	};

var wmsLayer = new ol.layer.Image({
	extent : [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
	source : new ol.source.ImageWMS(imageWMSOption)
});

// Vector Source 정의
var source = new ol.source.Vector();

// Vector Layer 정의
var vectorLayer = new ol.layer.Vector({
	source : source
	,style : new ol.style.Style({
		fill : new ol.style.Fill({
			color : 'rgba(255, 255, 255, 0.2)'
		}),
		stroke : new ol.style.	Stroke({
			color : '#ffcc33',
			width : 2
		}),
		image : new ol.style.Circle({
			radius : 7,
			fill : new ol.style.Fill({
				color : '#ffcc33'
			})
		})
	})
});

/**
 * 화면 관리 Properties - Vworld 기반
 */
// 뷰 객체
var view = new ol.View({
	projection : new ol.proj.Projection({
		code : "EPSG:3857",
		extent : [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
		unit : "m"
		// , axisOrientation : "ne" // xy 위도 경도를 바꿔서 전송한다. (GeoServer)
	}),
	maxResolution : 156543.0339,
	center : [ 14225425.793355, 4301705.8698004 ],
	zoom : 18,
	maxZoom : 23
});

/**
 * Map 정의
 */
// 지도 객체
var map = new ol.Map({
	target : targetDiv,
	renderer : renderer,
	controls : controls,
	layers : [ vworldLayer, wmsLayer, vectorLayer ],
	view : view
});

/**
 * Interaction 정의
 */
// 도형 선택
var selectSingleClick = new ol.interaction.Select({name : 'selectFeature'});

// 스냅
var snap = new ol.interaction.Snap({
	name : 'snap',
	source: vectorLayer.getSource(),
});

// 측정 : measure.js 참조
// 도형 이동 : drag.js 참조 

/**
 * Zoom 레벨별 Draw Interaction Style 정의 (Zoom Level : 7 ~ 18)
 */
/*var drawColorArr = [
    "#99FF00","#99CC00","#999900","#996600","#993300","#990000"
    ,"#00FF00","#00CC00","#009900","#006600","#003300","#000000"
];*/
var drawColorArr = [
    "#FFFFFF","#C0C0C0","#808080","#000000","#FF0000","#8000000"
    ,"#FFFF00","#808000","#00FF00","#008000","#0000FF","#FF00FF"
    ,"#FFDD00","#CC80C0","#EE2211","#221122","#FF1122","#DDCC21"
    ,"#AAAA00","#000022","#113322","#DDDDDD","#314521","#123456"
    ,"#FFFFFF","#C0C0C0","#808080","#000000","#FF0000","#8000000"
    ,"#FFFF00","#808000","#00FF00","#008000","#0000FF","#FF00FF"
];
var drawSizeArr = [
    30,50,70,90,10
    ,30,50,70,5,10
    ,20,30,40,50,1,3,5
    ,10,15,20,25,30
    ,35,40
];

/**
 * Map정보
 */
var mapInfo = {
	maxExtent : {
		"v" : [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
		"d" : [-30000, -60000, 494288, 988576],
		"n" : [90112, 1192896, 1990673, 2761664]
	},
	crs : {
		"v" : "EPSG:3857",
		"d" : "EPSG:5181",
		"n" : "EPSG:5179"
	},
	projection : {
		"v" : new ol.proj.Projection({
			code : "EPSG:3857",
			extent : [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
			unit : "m"
			// , axisOrientation : "ne" // xy 위도 경도를 바꿔서 전송한다. (GeoServer)
		}),
		"d" : new ol.proj.Projection({
			code : "EPSG:5181",
			extent : [-30000, -60000, 494288, 988576],
			unit : "m",
			axisOrientation : "ne" // xy 위도 경도를 바꿔서 전송한다. (GeoServer)
		}),
		"n" : new ol.proj.Projection({
			code : "EPSG:5179",
			extent : [90112, 1192896, 1990673, 2761664],
			unit : "m",
			/**
			 * Get the axis orientation of this projection.
			 * Example values are:
			 * enu - the default easting, northing, elevation.
			 * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
			 *     or south orientated transverse mercator.
			 * wnu - westing, northing, up - some planetary coordinate systems have
			 *     "west positive" coordinate systems
			 * @return {string} Axis orientation.
			 */
			axisOrientation : "neu" // xy 위도 경도를 바꿔서 전송한다. (GeoServer)
		})
	},
	maxZoom : {
		"v" : 23,
		"d" : 14,
		"n" : 14
	},
	minZoom : {
		"v" : 7,
		"d" : 0,
		"n" : 0
	},
	layerGroup : {
		"v" : new ol.layer.Group({
			layers: [ vworldLayer, wmsLayer, vectorLayer ]
		}),
		"d" : new ol.layer.Group({
			layers: [ daumLayer, wmsLayer, vectorLayer ]
		}),
		"n" : new ol.layer.Group({
			layers: [ naverLayer, wmsLayer, vectorLayer ]
		})
	},
	maxResolution : {
		"v" : 156543.0339,
		"d" : 2048,
		"n" : 2048
	}
};