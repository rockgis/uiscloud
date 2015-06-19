requirejs.config({
    baseUrl: "/js"
    , paths: {
        //underscore: "underscore/underscore-min"
        //, OpenLayers: "OpenLayers/OpenLayers"
        //, jQuery: "jQuery/jquery-1.10.2.min"

        underscore: "underscore/underscore"
        , OpenLayers: "OpenLayers/OpenLayers.debug"
        , jQuery: "jQuery/jquery-1.10.2"

        , UTIL: "UTIL/UTIL"

        , contextMenu: "UTIL/contextMenu"       // jquery dep

        , GeoNURIS: "GeoNURIS/Map"
        , ServerInfo: "GeoNURIS/ServerInfo"
        , CustomServerInfo: "GeoNURIS/CustomServerInfo"
        , TOC: "GeoNURIS/TOC"
        , Service: "GeoNURIS/Service"
        , CustomService: "GeoNURIS/CustomService"
        , BaseLayer: "GeoNURIS/BaseLayer"
        , Layer: "GeoNURIS/Layer"
        , GroupLayer: "GeoNURIS/GroupLayer"
        , Style: "GeoNURIS/Style"
        , Control: "GeoNURIS/Control"
        , BaseControl: "GeoNURIS/Controls/BaseControl"
        , Navigation: "GeoNURIS/Controls/Navigation"
        , ZoomBox: "GeoNURIS/Controls/ZoomBox"
        , NavigationHistory: "GeoNURIS/Controls/NavigationHistory"
        , MousePosition: "GeoNURIS/Controls/MousePosition"
        , ScaleLine: "GeoNURIS/Controls/ScaleLine"
        , PanZoomBar: "GeoNURIS/Controls/PanZoomBar"
        , NavToolbar: "GeoNURIS/Controls/NavToolbar"
        , Measure: "GeoNURIS/Controls/Measure"
        , GetFeature: "GeoNURIS/Controls/GetFeature"
        , DrawFeature: "GeoNURIS/Controls/DrawFeature"
        , WMSGetFeatureInfo: "GeoNURIS/Controls/WMSGetFeatureInfo"
        , SelectFeature: "GeoNURIS/Controls/SelectFeature"
        , Marker: "GeoNURIS/Controls/Marker"
        , Mouse: "GeoNURIS/Controls/Mouse"
        , Toolbar: "GeoNURIS/Controls/Toolbar"
    }
    , shim: {
        "GeoNURIS": {
            // GeoNURIS가 로드되기 전에 underscore, OpenLayers, ... 가 먼저 로드 되어야 한다.
            deps: ["underscore", "OpenLayers", "jQuery"
                , "UTIL", "contextMenu", "ServerInfo", "CustomServerInfo", "BaseLayer" ,"Layer" ,"GroupLayer", "Service", "CustomService", "TOC"
                , "Style"
                , "BaseControl", "Mouse", "Navigation", "ZoomBox", "NavigationHistory"
                , "MousePosition", "ScaleLine"
                , "PanZoomBar", "NavToolbar"
                , "Measure", "GetFeature", "DrawFeature", "SelectFeature", "WMSGetFeatureInfo", "Marker", "Mouse", "Toolbar"
                , "Control"]
            , exports: "geonuris"
        }
    }
});

requirejs(["GeoNURIS"], function (geonuris) {
    console.log("script loaded");

    if (typeof ginit == "function") {
        // init call
        //ginit();

        var body = document.getElementsByTagName("body")[0];
        body.addEventListener("load", ginit(), false);
    }

});