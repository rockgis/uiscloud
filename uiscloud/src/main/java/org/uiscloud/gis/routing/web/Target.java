package org.uiscloud.gis.routing.web;

import java.util.LinkedHashMap;
import java.util.LinkedList;

import org.apache.commons.lang.builder.ToStringBuilder;

public class Target {

	private String targetId = null;
	private LinkedList<LinkedHashMap<String, Object>> fc = null;
	private double cost = 0.0d;

	public Target(String targetId, LinkedList<LinkedHashMap<String, Object>> fc, double cost) {
		this.targetId = targetId;
		this.fc = fc;
		this.cost = cost;
	}

	public String getTargetId() {
		return targetId;
	}

	public void setTargetId(String targetId) {
		this.targetId = targetId;
	}

	public LinkedList<LinkedHashMap<String, Object>> getFc() {
		return fc;
	}

	public void setFc(LinkedList<LinkedHashMap<String, Object>> fc) {
		this.fc = fc;
	}

	public double getCost() {
		return cost;
	}

	public void setCost(double cost) {
		this.cost = cost;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
