package org.uiscloud.spark.model.mongodb;

public class GeometryDao extends GeometryObjectDao{
	private CoordinateDao coordinates;
	
	public GeometryDao() {
		super();
		this.setType("Point");
	}

	public CoordinateDao getCoordinates() {
		return coordinates;
	}
	public void setCoordinates(CoordinateDao coordinates) {
		this.coordinates = coordinates;
	}
	
}
