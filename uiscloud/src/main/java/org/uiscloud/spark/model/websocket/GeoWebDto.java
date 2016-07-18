package org.uiscloud.spark.model.websocket;

import java.util.List;

public class GeoWebDto {
	private String type = "FeatureCollection";
	private long totalCount = 0;
	private long allCollectionCount = 0;
	private String reqId;
	private String idx;
	private List<WebFeature> features;
	
	public String getIdx() {
		return idx;
	}

	public void setIdx(String idx) {
		this.idx = idx;
	}

	public long getAllCollectionCount() {
		return allCollectionCount;
	}
	public void setAllCollectionCount(long allCollectionCount) {
		this.allCollectionCount = allCollectionCount;
	}
	
	public String getReqId() {
		return reqId;
	}
	public void setReqId(String reqId) {
		this.reqId = reqId;
	}
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public List<WebFeature> getFeatures() {
		return features;
	}
	public void setFeatures(List<WebFeature> feature) {
		this.features = feature;
	}
	public long getTotalCount() {
		return totalCount;
	}
	public void setTotalCount(long totalCount) {
		this.totalCount = totalCount;
	}
	
	
}
