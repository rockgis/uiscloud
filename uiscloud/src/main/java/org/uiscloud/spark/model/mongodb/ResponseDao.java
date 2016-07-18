package org.uiscloud.spark.model.mongodb;

public class ResponseDao {
	private GeometryDao _id;
	private int maxCount;
	private String reqId;

	public GeometryDao get_id() {
		return _id;
	}
	public void set_id(GeometryDao _id) {
		this._id = _id;
	}
	public int getMaxCount() {
		return maxCount;
	}
	public void setMaxCount(int maxCount) {
		
		this.maxCount = maxCount;
	}
	public void setReqId(String id) {
		this.reqId = id;
	}
	public String getReqId() {
		return reqId;
	}
	
}
