<%@page pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<title>uiscloud</title>

<!-- Bootstrap Core CSS -->
<link href="/spark/css/bootstrap.css" rel="stylesheet">

<!-- Custom CSS -->
<link href="/spark/css/simple-sidebar.css" rel="stylesheet">

<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
	        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
	        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
	    <![endif]-->
<link rel="stylesheet" href="/webjars/openlayers/3.15.1/ol.css" type="text/css">
<style type="text/css">
body {
	height: 100%;
	width: 100%;
}

div.contentBody {
	height: 100%;
	z-index: 1;
}

div.map {
	width: 100%;
	height: 100%;
}

div.container-fluid {
	height: 100%;
}

div.fill {
	height: 100%;
	z-index: 1;
}

div.daum {
	height: 100%;
	display: none;
}

#wrapping {
	z-index: 1;
	position: absolute;
}

#spark {
	width: 100%;
	height: 100%;
}

#loadingw {
	z-index: 2;
	position: absolute;
}

.money .number {
	color: red;
}
</style>
<script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
<!--  script type="text/javascript"
	src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js"></script-->

<script src="/webjars/openlayers/3.15.1/ol.js" type="text/javascript"></script>
<script src="/spark/js/heatmap.js" type="text/javascript"></script>
<script src="/spark/js/geowebsocket.js" type="text/javascript"></script>
<script src="/spark/js/googleClusterMap.js" type="text/javascript"></script>
<script src="/spark/js/markercluster.js" type="text/javascript"></script>
<script src="/spark/js/spin.js" type="text/javascript"></script>
<script src="/spark/js/fireworks.js" type="text/javascript"></script>
<script src="/spark/js/statSocket.js" type="text/javascript"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/1.4.5/numeral.min.js"></script>
<script type="text/javascript" src="/spark/js/jquery.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="/spark/js/bootstrap.min.js"></script>

<link rel="stylesheet" href="/spark/css/spark/vis.min.css" type="text/css" />
<link rel="stylesheet" href="/spark/css/spark/webui.css" type="text/css" />
<link rel="stylesheet" href="/spark/css/spark/timeline-view.css" type="text/css" />

<script src="/spark/js/spark/sorttable.js"></script>
<script src="/spark/js/spark/jquery-1.11.1.min.js"></script>
<script src="/spark/js/spark/vis.min.js"></script>
<script src="/spark/js/spark/bootstrap-tooltip.js"></script>
<script src="/spark/js/spark/initialize-tooltips.js"></script>
<script src="/spark/js/spark/table.js"></script>
<script src="/spark/js/spark/additional-metrics.js"></script>
<script src="/spark/js/spark/timeline-view.js"></script>
<script src="/spark/js/ajaxSparkCall.js"></script>


</head>

<body>
	<div id="contentBody">
		<div id="wrapper">

<script>
	var daumMap = null;
	var heatMap = null;

	var webSocket = null;
	var statSocket = null;

	var preCount = 0.0;
	var preAllCollectio = 0.0;

	var requestId = null;

	var time = null;

	var chartShow = false;
	
	var check_bound = function() {
		var boundExist = true;

		if (daumMap.getBound() == undefined) {
			boundExist = false;

		}

		if (!boundExist)
			setTimeout(check_bound, 200);
		else
			requestCluseterInfo("daummap");
	}

	function init() {

		webSocket = new GeoWebsocket();
		webSocket
				.initialize(function(msg) {
					if (msg == "connect") {
						check_bound();
					} else {
						var ob = $.parseJSON(msg);
						if (requestId != ob.reqId
								&& ob.reqId.indexOf("count_") == -1
								&& ob.reqId.indexOf("statics") == -1) {
							return;
						}
						if (isVisible("clusterContainer")
								&& ob.reqId.indexOf("count_") == -1
								&& (ob.reqId.indexOf("daummap") != -1)) {
							daumMap.setData(msg);
						} else if (isVisible("heatmapContainer")
								&& ob.reqId.indexOf("count_") == -1
								&& (ob.reqId.indexOf("heatmap") != -1)
								&& ob.features.length > 0) {
							heatMap.setData(msg);
						} else if (ob.reqId.indexOf("count_") != -1) {
							getProcessedDataCount(ob);
							return;
						} else if (ob.reqId == "statics") {
							getProcessedCoordinates(ob);
						}
					}

				});

		webSocket.setListener(function(obj) {
			console.log(obj);
		});

		show("clusterContainer");

		if (daumMap == null) {
			createClusterMap();
		}
		
		

	}

	function ellipsis(str) {
		var idx = str.indexOf(".");
		if (idx == -1 || str.length < 11) {

			return str;
		}
		idx += 7;
		var rt = str.substring(0, idx);
		if (rt.length < 11) {
			rt = createSpace(" ", 8 - rt.length) + rt;
		}
		return rt;
	}
	function addZero(str) {

		if (str.toString().length == 1) {
			return "0" + str.toString();
		}
		return str.toString();
	}
	function createSpace(regx, count) {
		var rt = "";
		for (var i = 0; i < count; i++) {
			rt += regx;
		}
		return rt;
	}

	function show(divId) {
		$('#container').children().each(function(){
			$(this).hide();
		});
		
		if(divId == 'clusterContainer' || divId == 'heatmapContainer'){
			$('#'+divId).show();
		}

		
	}

	function createClusterMap() {
		$('#clusterContainer').show();
		
		//document.getElementById("clusterContainer").style.display = "block";
		//daumMap = new DaumClusterMap();
		
		daumMap = new GoogleMap();
		daumMap.createCluster("clusterContainer");
		daumMap.move(0, 0);

		daumMap.setBoundChangeListener(function(isZoom) {
			requestCluseterInfo("daummap");
			daumMap.clear();
			if (isZoom) {
				preCount = 0.0;
			}

		});

	}

	function createHeatMap() {
		$('#heatmapContainer').show();
		//document.getElementById("heatmapContainer").style.display = "block";

		heatMap = new Heatmap("heatmap", "gmap");

		heatMap.setBlur(20);
		heatMap.setRadius(6);

		heatMap.setListener(function(isZoom) {
			heatMap.clear();
			requestCluseterInfo("heatmap");

			if (isZoom) {
				preCount = 0.0;
			}
		});

		heatMap.move(0, 0);
		heatMap.setLevel(2);

	}

	function changeMap(showId, type) {
		if (isVisible(showId))
			return;

		if (daumMap == null && showId == "clusterContainer") {
			createClusterMap();
		}

		if (heatMap == null && showId == "heatmapContainer") {
			createHeatMap();
		}

		if (daumMap) {
			daumMap.clear();
		}
		
		if (heatMap)
			heatMap.clear();

		if(chartShow){
			if(showId !='chart' && showId != 'ganglia') {
				chartShow = false;
			}
			stopChart();
		}

		show(showId);
		
		if (isVisible("clusterContainer")) {
			requestCluseterInfo("daummap");
		} else if (isVisible("heatmapContainer")) {
			requestCluseterInfo("heatmap");
		} else {
			if(showId == 'spark'){
				spark(type);
			} else if(showId == 'chart'){
				chart(type);
			} else if(showId == 'ganglia') {
				ganglia(type);
			}
			requestCluseterInfo("stopSendLocation");
		}

		preCount = 0.0;
	}

	function isVisible(id) {
		return ($(document.getElementById(id)).is(':visible'));
	}

	function requestCluseterInfo(id) {
		time = new Date();
		if (id == "daummap" && isVisible("clusterContainer")) {

			var bound = daumMap.getBound();
			var bounds = [ bound.getSouthWest().lng(),
					bound.getSouthWest().lat(), bound.getNorthEast().lng(),
					bound.getNorthEast().lat() ];
			requestMapLocation("daummap", daumMap.getLevel(), bounds);
		} else if (id == "heatmap" && isVisible("heatmapContainer")) {
			var bound = heatMap.getBox();
			requestMapLocation("heatmap", heatMap.getLevel(), bound);
		} else if(id == "stopSendLocation"){
			
			var request = new Object();
			request.id = id;
			webSocket.sendMessage(JSON.stringify(request));
		}

	}

	function requestMapLocation(id, level, bound) {
		var request = new Object();
		request.id = id + "_" + level;
		request.level = level;

		var point = new Array();
		point.push(bound[0]);
		point.push(bound[1]);
		request.startPoint = point;

		point = new Array();
		point.push(bound[2]);
		point.push(bound[3]);

		request.endPoint = point;
		webSocket.sendMessage(JSON.stringify(request));

		requestId = request.id;
	}
	
	function chart(type){
		if(chartShow) 
			stopChart();
		$('#div_contents').empty();
		$.ajax({
			type : 'POST',
			url : '/chart/index.n',
			datatype : 'html',
			data : {
				type: type
			},
			beforeSend : function() {
			},
			success : function(data) {
				$('#div_contents').empty().html(data);
				$('#div_contents').show();
				chartShow = true;
			},
			error : function() {
			}
		});
	}
	
	function ganglia(type) {
		if(chartShow) 
			stopChart();
		$('#div_contents').empty();
		$.ajax({
			type : 'POST',
			url : '/ganglia/index.n',
			datatype : 'html',
			data : {
				type: type
			},
			beforeSend : function() {
			},
			success : function(data) {
				$('#div_contents').empty().html(data);
				$('#div_contents').show();
				chartShow = true;
			},
			error : function() {
			}
		});
	}
	
	function getTime() {
		var x = new Date().getTime();
		var rightNow = new Date();
		var jan1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);
		var temp = jan1.toGMTString();
		var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
		var std_time_offset = (jan1 - jan2);
		
		return x+std_time_offset;
	}
</script>
		<!-- Page Content -->
		<div id="page-content-wrapper">
			<div class="container-fluid">
				<div class="row" id="container">
					<div id="clusterContainer" class="daum"></div>
					<div id="heatmapContainer" class="map">
						<div id="wraping">
							<div id="gmap" class="fill"></div>
							<div id="heatmap" class="fill"></div>
						</div>
					</div>
					<div id="div_contents">
					</div>
				</div>
			</div>
		</div>
		<!-- /#page-content-wrapper -->

<script>
	var winWidth = $(window).width();
	var winHeight = $(window).height();

	
	window.onfocus = function() {
	  console.log("focus");
	  daumMap.setFireworkVisible(true);
	};
	window.onblur = function() {
	    console.log("unfocus");
	    daumMap.setFireworkVisible(false);
	};
	
	$(document).ready(function() {
		// set initial div height / width
		$('div').css({
			'height' : winHeight,

		});

		// make sure div stays full width/height on resize
		$(window).resize(function() {
			$('div').css({
				'height' : winHeight,
			});

		});
		init();
	});

	$("#menu-toggle").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});
</script>	
			
			
			
		</div>
	</div>
	
</body>

</html>
