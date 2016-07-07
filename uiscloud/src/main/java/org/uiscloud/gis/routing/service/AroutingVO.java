package org.uiscloud.gis.routing.service;

import org.apache.commons.lang.builder.ToStringBuilder;

public class AroutingVO extends RoutingVO {

	private String source;
	private String targets;

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

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

}
