package org.uiscloud.gis.routing.service;

import org.apache.commons.lang.builder.ToStringBuilder;

public class EdgeVo {

	private int id;
	private int gid;
	private String wellKnownText;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getGid() {
		return gid;
	}

	public void setGid(int gid) {
		this.gid = gid;
	}

	public String getWellKnownText() {
		return wellKnownText;
	}

	public void setWellKnownText(String wellKnownText) {
		this.wellKnownText = wellKnownText;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

}
