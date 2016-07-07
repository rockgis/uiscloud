goog.provide('olCustom.format.WFS');

olCustom.format.WFS = function() {
	goog.base(this);
};
goog.inherits(olCustom.format.WFS, ol.Object);

olCustom.format.WFS.prototype.writeGetFeature = function(params, options) {
	var format = OpenLayers.Format.WFST(params);
	var data = OpenLayers.Format.XML.prototype.write.apply(
        format, [format.writeNode("wfs:GetFeature", options)]
    );

	var agent = navigator.userAgent.toLowerCase();
	var appName = navigator.appName.toLowerCase();
	//익스일때 xml에서 relace 
	if((agent.indexOf("msie") != -1) || (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1)) {
		data = data.replace('xmlns:NS1="" NS1:' , "");	
	}
	
	return data;
};