package org.uiscloud.spark.model.redis;

public class GridCoordinateDao {
	private double lon;
	private double lat;
	
	public double getLon() {
		return lon;
	}
	public void setLon(double x) {
		this.lon = x;
	}
	public double getLat() {
		return lat;
	}
	public void setLat(double y) {
		this.lat = y;
	}
}