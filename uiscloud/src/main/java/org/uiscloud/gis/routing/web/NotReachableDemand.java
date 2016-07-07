package org.uiscloud.gis.routing.web;

public class NotReachableDemand {

	private String demandId;
	private String wkt;

	public NotReachableDemand(String demandId, String wkt) {
		this.demandId = demandId;
		this.wkt = wkt;
	}

	public String getDemandId() {
		return demandId;
	}

	public void setDemandId(String demandId) {
		this.demandId = demandId;
	}

	public String getWkt() {
		return wkt;
	}

	public void setWkt(String wkt) {
		this.wkt = wkt;
	}

	@Override
	public boolean equals(Object obj) {
		NotReachableDemand f = (NotReachableDemand) obj;
		if (f != null) {
			return f.getDemandId().equals(this.demandId);
		}
		return false;
	}
}
