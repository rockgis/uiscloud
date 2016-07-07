package org.uiscloud.gis.routing.service;

import org.apache.commons.lang.builder.ToStringBuilder;

public class RoutingVO {

	private String startPoint;
	private String endPoint;
	private int startPointId = -1;
	private int endPointId = -1;
	private int buffer;

	private int seq;
	private int path;
	private int node;
	private int edge;
	private double cost;
	private String geom;

	private String caMgno;
	private String unqMgno;
	private String fctsNm;
	private String lglCd;
	private String lglCdType;
	private String lglCdWkt;
	private String sysClf;
	private String ungrLoc;
	private String ownClf;
	private String compLen;
	private String gisLen;
	private String coreCnt;
	private String useCoreC;
	private String useCoreGrade;
	private String compDt;
	private String cnstMgno;
	private String workDocN;
	private String caMnftno;
	private String netClf;
	private String caInd;
	private String insertDt;
	private String insertOpr;
	private String sido;
	private String sgg;
	private String emd;
	private String gisCode;
	private double bCost;

	private String stopOverPoints;
	private String nonStopOverPoints;
	private String stopOverLines;
	private String nonStopOverLines;
	private String polyWkt;
	private String capacity;
	private String remainCapacity;
	private String connectingPointCount;
	private String[] ungrLocsArr;
	private String[] gisCodesArr;
	private String coreCount = null;
	private String[] netClfsArr;

	private double hubMeters;
	private double bldgMeters;

	private double x;
	private double y;

	private String bbox;

	private String byICost = null;
	private int sktBbring = 0;
	private int sktCtring = 0;
	private int sktBsring = 0;
	private int sktRfptp = 0;
	private int sktEtc = 0;
	private int skbRing = 0;
	private String gisCodes = null;
	private int byCost = 0;
	private int conCoreCount = 0;
	private String newPpPrice = null;

	private String routingCount = null;
	private String orderRequired = null;
	private String allowOverlap = null;
	private String avoidCoring = null;
	
	private int target = -1;

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

	public int getSeq() {
		return seq;
	}

	public void setSeq(int seq) {
		this.seq = seq;
	}

	public int getPath() {
		return path;
	}

	public void setPath(int path) {
		this.path = path;
	}

	public int getNode() {
		return node;
	}

	public void setNode(int node) {
		this.node = node;
	}

	public int getEdge() {
		return edge;
	}

	public void setEdge(int edge) {
		this.edge = edge;
	}

	public double getCost() {
		return cost;
	}

	public void setCost(double cost) {
		this.cost = cost;
	}

	public String getGeom() {
		return geom;
	}

	public void setGeom(String geom) {
		this.geom = geom;
	}

	public String getCaMgno() {
		return caMgno;
	}

	public void setCaMgno(String caMgno) {
		this.caMgno = caMgno;
	}

	public String getUnqMgno() {
		return unqMgno;
	}

	public void setUnqMgno(String unqMgno) {
		this.unqMgno = unqMgno;
	}

	public String getFctsNm() {
		return fctsNm;
	}

	public void setFctsNm(String fctsNm) {
		this.fctsNm = fctsNm;
	}

	public String getLglCd() {
		return lglCd;
	}

	public void setLglCd(String lglCd) {
		this.lglCd = lglCd;
	}

	public String getLglCdType() {
		return lglCdType;
	}

	public void setLglCdType(String lglCdType) {
		this.lglCdType = lglCdType;
	}

	public String getLglCdWkt() {
		return lglCdWkt;
	}

	public void setLglCdWkt(String lglCdWkt) {
		this.lglCdWkt = lglCdWkt;
	}

	public String getSysClf() {
		return sysClf;
	}

	public void setSysClf(String sysClf) {
		this.sysClf = sysClf;
	}

	public String getUngrLoc() {
		return ungrLoc;
	}

	public void setUngrLoc(String ungrLoc) {
		this.ungrLoc = ungrLoc;
	}

	public String getOwnClf() {
		return ownClf;
	}

	public void setOwnClf(String ownClf) {
		this.ownClf = ownClf;
	}

	public String getCompLen() {
		return compLen;
	}

	public void setCompLen(String compLen) {
		this.compLen = compLen;
	}

	public String getGisLen() {
		return gisLen;
	}

	public void setGisLen(String gisLen) {
		this.gisLen = gisLen;
	}

	public String getCoreCnt() {
		return coreCnt;
	}

	public void setCoreCnt(String coreCnt) {
		this.coreCnt = coreCnt;
	}

	public String getUseCoreC() {
		return useCoreC;
	}

	public void setUseCoreC(String useCoreC) {
		this.useCoreC = useCoreC;
	}

	public String getUseCoreGrade() {
		return useCoreGrade;
	}

	public void setUseCoreGrade(String useCoreGrade) {
		this.useCoreGrade = useCoreGrade;
	}

	public String getCompDt() {
		return compDt;
	}

	public void setCompDt(String compDt) {
		this.compDt = compDt;
	}

	public String getCnstMgno() {
		return cnstMgno;
	}

	public void setCnstMgno(String cnstMgno) {
		this.cnstMgno = cnstMgno;
	}

	public String getWorkDocN() {
		return workDocN;
	}

	public void setWorkDocN(String workDocN) {
		this.workDocN = workDocN;
	}

	public String getCaMnftno() {
		return caMnftno;
	}

	public void setCaMnftno(String caMnftno) {
		this.caMnftno = caMnftno;
	}

	public String getNetClf() {
		return netClf;
	}

	public void setNetClf(String netClf) {
		this.netClf = netClf;
	}

	public String getCaInd() {
		return caInd;
	}

	public void setCaInd(String caInd) {
		this.caInd = caInd;
	}

	public String getInsertDt() {
		return insertDt;
	}

	public void setInsertDt(String insertDt) {
		this.insertDt = insertDt;
	}

	public String getInsertOpr() {
		return insertOpr;
	}

	public void setInsertOpr(String insertOpr) {
		this.insertOpr = insertOpr;
	}

	public String getSido() {
		return sido;
	}

	public void setSido(String sido) {
		this.sido = sido;
	}

	public String getSgg() {
		return sgg;
	}

	public void setSgg(String sgg) {
		this.sgg = sgg;
	}

	public String getEmd() {
		return emd;
	}

	public void setEmd(String emd) {
		this.emd = emd;
	}

	public String getGisCode() {
		return gisCode;
	}

	public void setGisCode(String gisCode) {
		this.gisCode = gisCode;
	}

	public double getbCost() {
		return bCost;
	}

	public void setbCost(double bCost) {
		this.bCost = bCost;
	}

	public int getBuffer() {
		return buffer;
	}

	public void setBuffer(int buffer) {
		this.buffer = buffer;
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

	public String[] getNetClfsArr() {
		return netClfsArr;
	}

	public void setNetClfsArr(String[] netClfsArr) {
		this.netClfsArr = netClfsArr;
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

	public String[] getGisCodesArr() {
		return gisCodesArr;
	}

	public void setGisCodesArr(String[] gisCodesArr) {
		this.gisCodesArr = gisCodesArr;
	}

	public String getBbox() {
		return bbox;
	}

	public void setBbox(String bbox) {
		this.bbox = bbox;
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

	public String getStopOverPoints() {
		return stopOverPoints;
	}

	public void setStopOverPoints(String stopOverPoints) {
		this.stopOverPoints = stopOverPoints;
	}

	public String getNonStopOverPoints() {
		return nonStopOverPoints;
	}

	public void setNonStopOverPoints(String nonStopOverPoints) {
		this.nonStopOverPoints = nonStopOverPoints;
	}

	public String getStopOverLines() {
		return stopOverLines;
	}

	public void setStopOverLines(String stopOverLines) {
		this.stopOverLines = stopOverLines;
	}

	public String getNonStopOverLines() {
		return nonStopOverLines;
	}

	public void setNonStopOverLines(String nonStopOverLines) {
		this.nonStopOverLines = nonStopOverLines;
	}

	public String getPolyWkt() {
		return polyWkt;
	}

	public void setPolyWkt(String polyWkt) {
		this.polyWkt = polyWkt;
	}

	public String getByICost() {
		return byICost;
	}

	public void setByICost(String byICost) {
		this.byICost = byICost;
	}

	public int getSktBbring() {
		return sktBbring;
	}

	public void setSktBbring(int sktBbring) {
		this.sktBbring = sktBbring;
	}

	public int getSktCtring() {
		return sktCtring;
	}

	public void setSktCtring(int sktCtring) {
		this.sktCtring = sktCtring;
	}

	public int getSktBsring() {
		return sktBsring;
	}

	public void setSktBsring(int sktBsring) {
		this.sktBsring = sktBsring;
	}

	public int getSktRfptp() {
		return sktRfptp;
	}

	public void setSktRfptp(int sktRfptp) {
		this.sktRfptp = sktRfptp;
	}

	public int getSktEtc() {
		return sktEtc;
	}

	public void setSktEtc(int sktEtc) {
		this.sktEtc = sktEtc;
	}

	public int getSkbRing() {
		return skbRing;
	}

	public void setSkbRing(int skbRing) {
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

	public int getTarget() {
		return target;
	}

	public void setTarget(int target) {
		this.target = target;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

}
