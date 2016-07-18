package org.uiscloud.spark.model.mongodb;

public class LocationDao {
	private String reqId;
	
	private int count;
	private GeometryDao geometry;	

	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	
	public GeometryDao getGeometry() {
		return geometry;
	}
	public void setGeometry(GeometryDao loc) {
		this.geometry = loc;
	}
	public String getReqId() {
		return reqId;
	}
	public void setReqId(String reqId) {
		this.reqId = reqId;
	}
	
}
