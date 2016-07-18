package org.uiscloud.spark.model.mongodb;

public class GeometryObjectDao {
	private String type;
	private DefaultCrsDao crs = new DefaultCrsDao();
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public DefaultCrsDao getCrs() {
		return crs;
	}

	public void setCrs(DefaultCrsDao crs) {
		this.crs = crs;
	}
}
