package org.uiscloud.spark.model.mongodb;

public class DefaultCrsDao {
	private String type = "name";
	private PropertyDao properties;

	public DefaultCrsDao() {
		this.properties = new PropertyDao();
		this.properties.setName("urn:x-mongodb:crs:strictwinding:EPSG:4326" );
	}
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public PropertyDao getProperties() {
		return properties;
	}
	public void setProperties(PropertyDao properties) {
		this.properties = properties;
	}
	
}
