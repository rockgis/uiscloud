
var targetMap = "div_map";
var map_config = "sktbigis";
var map_Hostconfig = "211.58.18.254:8180";   //:http://211.58.18.254:8180/sktbigis/wms?

var serviceUrl = "http://"+map_Hostconfig+"/"+map_config+"/wms"   // CACHE_KEY=sggiskey&FIXED=TRUE&GRAPHIC_BUFFER=0&ANTI=true&TEXT_ANTI=true&LABEL=HIDE_OVERLAP&REPEAT=null&DISPLAY_GAP=null";  //http://221.148.35.65:8880/geonuris/wms?GDX=raise_01.xml&FIXED=TRUE&REQUEST=GetCapabilities&SERVICE=WMS
var serviceWfsUrl = "http://"+map_Hostconfig+"/"+map_config+"/wfs";  //http://221.148.35.65:8880/geonuris/wms?GDX=raise_01.xml&FIXED=TRUE&REQUEST=GetCapabilities&SERVICE=WMS


var projection = ol.proj.get('EPSG:5181');
projection.setExtent([-535028.96,-219825.99 ,
                       777525.22,819486.07]);


var projectionExtent = projection.getExtent();

var maxResolution = ol.extent.getWidth(projectionExtent) / (256*2);

//alert(maxResolution);

var extent = [13726555.27431,3881804.13438070057,14681712.379771207,4730560.896459303];

var centerXY=[196596.04, 435167.03];




var vectorSource = new ol.source.Vector();

var vector = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});





var openCycleMapLayer = new ol.layer.Tile({
	  source: new ol.source.OSM({
	    attributions: [
	      new ol.Attribution({
	        html: 'All maps &copy; ' +
	            '<a href="http://www.opencyclemap.org/">OpenCycleMap</a>'
	      }),
	      ol.source.OSM.ATTRIBUTION
	    ],
		logo : false,
	    url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
	  })
	});

var openSeaMapLayer = new ol.layer.Tile({
	  source: new ol.source.OSM({
	   /* attributions: [
	      new ol.Attribution({
	        html: 'All maps &copy; ' +
	            '<a href="http://www.openseamap.org/">OpenSeaMap</a>'
	      }),
	      ol.source.OSM.ATTRIBUTION
	    ],*/
	    crossOrigin: null,
	    url: 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
	  })
	});

var geollayer = new ol.layer.Image({
   // extent: extent,
    source: new ol.source.ImageWMS({
        url: serviceUrl,
        projection: "EPSG:900913",
        params: {'LAYERS': 'sktbigis:gnet_ring_map,sktbigis:gotc_ca,sktbigis:gotc_ca,sktbigis:gotc_ca,sktbigis:gotc_ca,sktbigis:gotc_ca,sktbigis:gotc_ca,sktbigis:gotc_tpo,sktbigis:gotc_tpo,sktbigis:gotc_tpo,sktbigis:gotc_tpo',
      	        'STYLES':'RM001,CA007,CA006,CA005,CA003,CA002,CA001,TPO004,TPO005,TPO002,TPO001'
      	       },    
    	serverType: 'geoserver'
    })
  })


var layers = [openCycleMapLayer,geollayer,vector];

var map = new ol.Map({
  controls: ol.control.defaults().extend([
    // 축척레벨바
                new ol.control.ZoomSlider(),
                // 하단 축척바
                new ol.control.ScaleLine(),
                new ol.control.MousePosition(),
                new ol.control.FullScreen(),
                new ol.control.ZoomToExtent()
  ]),
  layers: layers,
  logo : false,
 // renderer: exampleNS.getRendererFromQueryString(),
  target: targetMap,
  view: new ol.View({
   // projection:projection,
    center: [14154602.63271663, 4289060.621084114],//[14224512.545,4426940.466], //ol.proj.transform([ 126.92,37.17], 'EPSG:4326', 'EPSG:5181'),
    extent: extent,
    //zoomFactor :1,
     maxZoom : 18,
    //maxResolution : 2048,
    zoom: 7
  })
});

alert(geollayer.getExtent());

/**
 * Currently drawn feature.
 * @type {ol.Feature}
 */
var sketch;


/**
 * The help tooltip element.
 * @type {Element}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {ol.Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {ol.Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click to continue drawing the polygon';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click to continue drawing the line';


/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt
 */
var pointerMoveHandler = function(evt) {
	
	createMeasureTooltip();
	createHelpTooltip();
 
 if (evt.dragging) {
    return;
  }
  /** @type {string} */
  var helpMsg = '한글인데 되나';
  /** @type {ol.Coordinate|undefined} */
  var tooltipCoord = evt.coordinate;

  if (sketch) {
    var output;
    var geom = (sketch.getGeometry());
    if (geom instanceof ol.geom.Polygon) {
      output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
      helpMsg = continuePolygonMsg;
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
    } else if (geom instanceof ol.geom.LineString) {
      output = formatLength( /** @type {ol.geom.LineString} */ (geom));
      helpMsg = continueLineMsg;
      tooltipCoord = geom.getLastCoordinate();
    }
    measureTooltipElement.innerHTML = output;
    measureTooltip.setPosition(tooltipCoord);
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);
};


//map.un('pointermove', pointerMoveHandler);

//var typeSelect = document.getElementById('type');

var draw; // global so we can remove it later


function addInteraction(typeSelect) {
	
	
	
	
  var type = (typeSelect == 'area' ? 'Polygon' : 'LineString');
  draw = new ol.interaction.Draw({
    source: vectorSource,
    type: /** @type {ol.geom.GeometryType} */ (type),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })
  });
  map.addInteraction(draw);

  createMeasureTooltip();
  createHelpTooltip();

  draw.on('drawstart',
      function(evt) {
        // set sketch
        sketch = evt.feature;
      }, this);

  draw.on('drawend',
      function(evt) {
        measureTooltipElement.className = 'tooltip tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
      }, this);
}


/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'tooltip';
  helpTooltip = new ol.Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left'
  });
  map.addOverlay(helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'tooltip tooltip-measure';
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center'
  });
  map.addOverlay(measureTooltip);
}


/**
 * Let user change the geometry type.
 * @param {Event} e Change event.
 
typeSelect.onchange = function(e) {
  map.removeInteraction(draw);
  addInteraction();
};*/


/**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
 */
var formatLength = function(line) {
  var length = Math.round(line.getLength() * 100) / 100;
  var output;
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
  } else {
    output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
  }
  return output;
};


/**
 * format length output
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 */
var formatArea = function(polygon) {
  var area = polygon.getArea();
  var output;
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
  } else {
    output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
  }
  return output;
};

//addInteraction();

function mapClear(){
   var mapOverLay =	map.getOverlays();
   alert(mapOverLay.item(0));
	map.removeOverlay(measureTooltip);
	
}


//레이어 관련 일을 해야지..

function bindInputs(layerid, layer) {
	  new ol.dom.Input($(layerid + ' .visible')[0])
	      .bindTo('checked', layer, 'visible');
	  $.each(['opacity', 'hue', 'saturation', 'contrast', 'brightness'],
	      function(i, v) {
	        new ol.dom.Input($(layerid + ' .' + v)[0])
	            .bindTo('value', layer, v)
	            .transform(parseFloat, String);
	      }
	  );
}

/*map.getLayers().forEach(function(layer, i) {
	
	alert("layer : " + layer);
	alert("i : " + i);
	
	bindInputs('#layer' + i, layer);
	
	if (layer instanceof ol.layer.Group) {
	    layer.getLayers().forEach(function(sublayer, j) {
	      bindInputs('#layer' + i + j, sublayer);
	    	alert("sublayer : " + sublayer);
	    	alert("j : " + j);
	    	
	    });
	  }
	});*/

//거리
$("#btn_dist").click(gfnMeasureDistanceEvent);

// 면적
$("#btn_area").click(gfnMeasureAreaEvent);

// 초기화
$("#btn_refresh").click(gfnRefreshEvent);


/**********************************************************************
설명 : 거리 측정
파라메터 :
리턴값 :
***********************************************************************/
function gfnMeasureDistanceEvent() {
	
	 map.on('pointermove', pointerMoveHandler);	
	 map.removeInteraction(draw);
	 addInteraction("length");
}

/**********************************************************************
설명 : 면적 측정
파라메터 :
리턴값 :
***********************************************************************/
function gfnMeasureAreaEvent() {
	
	 map.on('pointermove', pointerMoveHandler);	
	 
	 map.removeInteraction(draw);
	 addInteraction("area");
}

/**********************************************************************
설명 : 지도 초기화
파라메터 :
리턴값 :
***********************************************************************/
function gfnRefreshEvent() {
	alert("초기화");
	map.un('pointermove', pointerMoveHandler);							// 이동 기능 활성화
	map.removeInteraction(draw);
	
}


