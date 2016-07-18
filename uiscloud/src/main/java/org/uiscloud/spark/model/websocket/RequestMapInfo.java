package org.uiscloud.spark.model.websocket;

public class RequestMapInfo {
	private String id;
	private int level;
	private double[] startPoint;
	private double[] endPoint;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public double[] getStartPoint() {
		return startPoint;
	}
	public void setStartPoint(double[] startPoint) {
		this.startPoint = startPoint;
	}
	public double[] getEndPoint() {
		return endPoint;
	}
	public void setEndPoint(double[] endPoint) {
		this.endPoint = endPoint;
	}
	
}
