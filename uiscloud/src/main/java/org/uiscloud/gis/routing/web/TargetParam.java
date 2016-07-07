package org.uiscloud.gis.routing.web;

import org.apache.commons.lang.builder.ToStringBuilder;

public class TargetParam {
	double x;
	double y;
	double hubMeters;
	double bldgMeters;
	String source;
	String demandWkt;

	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public double getHubMeters() {
		return hubMeters;
	}

	public void setHubMeters(double hubMeters) {
		this.hubMeters = hubMeters;
	}

	public double getBldgMeters() {
		return bldgMeters;
	}

	public void setBldgMeters(double bldgMeters) {
		this.bldgMeters = bldgMeters;
	}

	public String getDemandWkt() {
		return demandWkt;
	}

	public void setDemandWkt(String demandWkt) {
		this.demandWkt = demandWkt;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
