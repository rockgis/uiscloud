package org.uiscloud.gis.routing.service;

import org.apache.commons.lang.builder.ToStringBuilder;

public class KroutingVO extends RoutingVO {

	private String source;
	private String targets;
	private String demands;
	private String demandWkt;
	private String bldgWkt;
	private String targetWkt;

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getTargets() {
		return targets;
	}

	public void setTargets(String targets) {
		this.targets = targets;
	}

	public String getDemandWkt() {
		return demandWkt;
	}

	public void setDemandWkt(String demandWkt) {
		this.demandWkt = demandWkt;
	}

	public String getDemands() {
		return demands;
	}

	public void setDemands(String demands) {
		this.demands = demands;
	}

	public String getBldgWkt() {
		return bldgWkt;
	}

	public void setBldgWkt(String bldgWkt) {
		this.bldgWkt = bldgWkt;
	}

	public String getTargetWkt() {
		return targetWkt;
	}

	public void setTargetWkt(String targetWkt) {
		this.targetWkt = targetWkt;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

}
