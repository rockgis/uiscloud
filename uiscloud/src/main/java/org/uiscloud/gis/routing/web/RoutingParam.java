package org.uiscloud.gis.routing.web;

import org.apache.commons.lang.builder.ToStringBuilder;

public class RoutingParam {

	private String startPoint = null;
	private String sourcePoints = null;
	private String endPoint = null;
	private int startPointId = -1;
	private int endPointId = -1;
	private String nonStopOverPoints = null;
	private String nonStopOverLines = null;
	private String byICost = null;
	private String sysClf = null;
	private String sktBbring = null;
	private String sktCtring = null;
	private String sktBsring = null;
	private String sktRfptp = null;
	private String sktEtc = null;
	private String skbRing = null;
	private String gisCodes = null;
	private int byCost = 0;
	private int conCoreCount = 0;
	private String newPpPrice = null;
	private String bbox = null;
	private String bboxes = null;

	private String capacity;
	private String remainCapacity;
	private String connectingPointCount;
	private String[] ungrLocsArr;
	private String ungrLocs;
	private String coreCount;
	private String gurobiSel;
	private String stopOverPoints;
	private String stopOverLines;

	private String routingCount = null;
	private String orderRequired = null;
	private String allowOverlap = null;
	private String avoidCoring = null;

	private String source = null;
	private String targets = null;
	private String demands = null;

	private double hubMeters = 0.0d;
	private double bldgMeters = 0.0d;

	private String polyWkt = null;
	private String lglCd = null;

	private double x = 0.0d;
	private double y = 0.0d;

	public String getRoutingCount() {
		return routingCount;
	}

	public void setRoutingCount(String routingCount) {
		this.routingCount = routingCount;
	}

	public String getOrderRequired() {
		return orderRequired;
	}

	public void setOrderRequired(String orderRequired) {
		this.orderRequired = orderRequired;
	}

	public String getAllowOverlap() {
		return allowOverlap;
	}

	public void setAllowOverlap(String allowOverlap) {
		this.allowOverlap = allowOverlap;
	}

	public String getAvoidCoring() {
		return avoidCoring;
	}

	public void setAvoidCoring(String avoidCoring) {
		this.avoidCoring = avoidCoring;
	}

	public int getStartPointId() {
		return startPointId;
	}

	public void setStartPointId(int startPointId) {
		this.startPointId = startPointId;
	}

	public int getEndPointId() {
		return endPointId;
	}

	public void setEndPointId(int endPointId) {
		this.endPointId = endPointId;
	}

	public String getStartPoint() {
		return startPoint;
	}

	public void setStartPoint(String startPoint) {
		this.startPoint = startPoint;
	}

	public String getEndPoint() {
		return endPoint;
	}

	public void setEndPoint(String endPoint) {
		this.endPoint = endPoint;
	}

	public String getNonStopOverPoints() {
		return nonStopOverPoints;
	}

	public void setNonStopOverPoints(String nonStopOverPoints) {
		this.nonStopOverPoints = nonStopOverPoints;
	}

	public String getNonStopOverLines() {
		return nonStopOverLines;
	}

	public void setNonStopOverLines(String nonStopOverLines) {
		this.nonStopOverLines = nonStopOverLines;
	}

	public String getByICost() {
		return byICost;
	}

	public void setByICost(String byICost) {
		this.byICost = byICost;
	}

	public String getSysClf() {
		return sysClf;
	}

	public void setSysClf(String sysClf) {
		this.sysClf = sysClf;
	}

	public String getSkBbring() {
		return sktBbring;
	}

	public void setSkBbring(String skBbring) {
		this.sktBbring = skBbring;
	}

	public String getSktBbring() {
		return sktBbring;
	}

	public void setSktBbring(String sktBbring) {
		this.sktBbring = sktBbring;
	}

	public String getSktCtring() {
		return sktCtring;
	}

	public void setSktCtring(String sktCtring) {
		this.sktCtring = sktCtring;
	}

	public String getSktBsring() {
		return sktBsring;
	}

	public void setSktBsring(String sktBsring) {
		this.sktBsring = sktBsring;
	}

	public String getSktRfptp() {
		return sktRfptp;
	}

	public void setSktRfptp(String sktRfptp) {
		this.sktRfptp = sktRfptp;
	}

	public String getSktEtc() {
		return sktEtc;
	}

	public void setSktEtc(String sktEtc) {
		this.sktEtc = sktEtc;
	}

	public String getSkbRing() {
		return skbRing;
	}

	public void setSkbRing(String skbRing) {
		this.skbRing = skbRing;
	}

	public String getGisCodes() {
		return gisCodes;
	}

	public void setGisCodes(String gisCodes) {
		this.gisCodes = gisCodes;
	}

	public int getByCost() {
		return byCost;
	}

	public void setByCost(int byCost) {
		this.byCost = byCost;
	}

	public int getConCoreCount() {
		return conCoreCount;
	}

	public void setConCoreCount(int conCoreCount) {
		this.conCoreCount = conCoreCount;
	}

	public String getNewPpPrice() {
		return newPpPrice;
	}

	public void setNewPpPrice(String newPpPrice) {
		this.newPpPrice = newPpPrice;
	}

	public String getBbox() {
		return bbox;
	}

	public void setBbox(String bbox) {
		this.bbox = bbox;
	}

	public String getCapacity() {
		return capacity;
	}

	public void setCapacity(String capacity) {
		this.capacity = capacity;
	}

	public String getRemainCapacity() {
		return remainCapacity;
	}

	public void setRemainCapacity(String remainCapacity) {
		this.remainCapacity = remainCapacity;
	}

	public String getConnectingPointCount() {
		return connectingPointCount;
	}

	public void setConnectingPointCount(String connectingPointCount) {
		this.connectingPointCount = connectingPointCount;
	}

	public String[] getUngrLocsArr() {
		return ungrLocsArr;
	}

	public void setUngrLocsArr(String[] ungrLocsArr) {
		this.ungrLocsArr = ungrLocsArr;
	}

	public String getCoreCount() {
		return coreCount;
	}

	public void setCoreCount(String coreCount) {
		this.coreCount = coreCount;
	}

	public String getUngrLocs() {
		return ungrLocs;
	}

	public void setUngrLocs(String ungrLocs) {
		this.ungrLocs = ungrLocs;
	}

	public String getGurobiSel() {
		return gurobiSel;
	}

	public void setGurobiSel(String gurobiSel) {
		this.gurobiSel = gurobiSel;
	}

	public String getStopOverPoints() {
		return stopOverPoints;
	}

	public void setStopOverPoints(String stopOverPoints) {
		this.stopOverPoints = stopOverPoints;
	}

	public String getStopOverLines() {
		return stopOverLines;
	}

	public void setStopOverLines(String stopOverLines) {
		this.stopOverLines = stopOverLines;
	}

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

	public String getSourcePoints() {
		return sourcePoints;
	}

	public void setSourcePoints(String sourcePoints) {
		this.sourcePoints = sourcePoints;
	}

	public String getBboxes() {
		return bboxes;
	}

	public void setBboxes(String bboxes) {
		this.bboxes = bboxes;
	}

	public String getPolyWkt() {
		return polyWkt;
	}

	public void setPolyWkt(String polyWkt) {
		this.polyWkt = polyWkt;
	}

	public String getLglCd() {
		return lglCd;
	}

	public void setLglCd(String lglCd) {
		this.lglCd = lglCd;
	}

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

	public String getDemands() {
		return demands;
	}

	public void setDemands(String demands) {
		this.demands = demands;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
