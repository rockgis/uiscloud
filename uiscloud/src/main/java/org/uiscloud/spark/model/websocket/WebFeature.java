package org.uiscloud.spark.model.websocket;

public class WebFeature {
	private String type = "Feature";
	private PropertyDto properties;
	private WebGeometry geometry;
	private String id;

	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}

	public WebGeometry getGeometry() {
		return geometry;
	}
	public void setGeometry(WebGeometry geometry) {
		this.geometry = geometry;
		this.id = this.geometry.getCoordinates()[0]+"_"+this.getGeometry().getCoordinates()[1];
	}
	public PropertyDto getProperties() {
		return properties;
	}
	public void setProperties(PropertyDto properties) {
		this.properties = properties;
	}
	
}
/*
{
"type": "FeatureCollection",
"features": [
{ "type": "Feature", "properties":
 { "GMI_ADMIN": "GBR-SCT", "FIPS_CNTRY": "UK", "CNTRY_NAME": "United Kingdom", "POP_RANK": 5, "ADMIN_NAME": "Scotland", "STATUS": "Other", "PORT_ID": 32170, "CITY_NAME": "Dundee", "POP_CLASS": "100,000 to 250,000" }, 
 "geometry": { "type": "Point", "coordinates": [ -2.966700, 56.466702 ] } }
,
{ "type": "Feature", "properties": { "GMI_ADMIN": "GBR-SCT", "FIPS_CNTRY": "UK", "CNTRY_NAME": "United Kingdom", "POP_RANK": 7, "ADMIN_NAME": "Scotland", "STATUS": "Other", "PORT_ID": 33515, "CITY_NAME": "Hunterston", "POP_CLASS": "Less than 50,000" }, "geometry": { "type": "Point", "coordinates": [ -4.856786, 55.736744 ] } }
*/