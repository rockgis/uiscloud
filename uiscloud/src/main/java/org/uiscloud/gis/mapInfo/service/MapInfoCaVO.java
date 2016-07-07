package org.uiscloud.gis.mapInfo.service;

public class MapInfoCaVO {
	private Integer gid;
	private String caMgno;
	private String unqMgno;
	private String fctsNm;
	private String lglCd;
	private String sysClf;
	private String cnstMgno;
	private String insertDt;
	private String insertOpr;
	private String theGeom;
	private String gisCode;
	private String ownClf;
	private String ungrLoc;
	private Double compLen;
	private Double gisLen;
	private Double coreCnt;
	private Double useCoreCnt;
	private Double connCoreCnt;
	private String compDt;
	private String workDocNo;
	private String caMnftno;
	private String netClf;
	private String caInd;
	private String useCoreGrade;
	private Integer source;
	private Integer target;
	private Double cost;
	
	public MapInfoCaVO(Integer gid, String caMgno, String unqMgno,
			String fctsNm, String lglCd, String sysClf, String cnstMgno,
			String insertDt, String insertOpr, String theGeom, String gisCode,
			String ownClf, String ungrLoc, Double compLen, Double gisLen,
			Double coreCnt, Double useCoreCnt, Double connCoreCnt,
			String compDt, String workDocNo, String caMnftno, String netClf,
			String caInd, String useCoreGrade, Integer source, Integer target,
			Double cost) {
		super();
		this.gid = gid;
		this.caMgno = caMgno;
		this.unqMgno = unqMgno;
		this.fctsNm = fctsNm;
		this.lglCd = lglCd;
		this.sysClf = sysClf;
		this.cnstMgno = cnstMgno;
		this.insertDt = insertDt;
		this.insertOpr = insertOpr;
		this.theGeom = theGeom;
		this.gisCode = gisCode;
		this.ownClf = ownClf;
		this.ungrLoc = ungrLoc;
		this.compLen = compLen;
		this.gisLen = gisLen;
		this.coreCnt = coreCnt;
		this.useCoreCnt = useCoreCnt;
		this.connCoreCnt = connCoreCnt;
		this.compDt = compDt;
		this.workDocNo = workDocNo;
		this.caMnftno = caMnftno;
		this.netClf = netClf;
		this.caInd = caInd;
		this.useCoreGrade = useCoreGrade;
		this.source = source;
		this.target = target;
		this.cost = cost;
	}

	public Integer getGid() {
		return gid;
	}

	public void setGid(Integer gid) {
		this.gid = gid;
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

	public String getSysClf() {
		return sysClf;
	}

	public void setSysClf(String sysClf) {
		this.sysClf = sysClf;
	}

	public String getCnstMgno() {
		return cnstMgno;
	}

	public void setCnstMgno(String cnstMgno) {
		this.cnstMgno = cnstMgno;
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

	public String getTheGeom() {
		return theGeom;
	}

	public void setTheGeom(String theGeom) {
		this.theGeom = theGeom;
	}

	public String getGisCode() {
		return gisCode;
	}

	public void setGisCode(String gisCode) {
		this.gisCode = gisCode;
	}

	public String getOwnClf() {
		return ownClf;
	}

	public void setOwnClf(String ownClf) {
		this.ownClf = ownClf;
	}

	public String getUngrLoc() {
		return ungrLoc;
	}

	public void setUngrLoc(String ungrLoc) {
		this.ungrLoc = ungrLoc;
	}

	public Double getCompLen() {
		return compLen;
	}

	public void setCompLen(Double compLen) {
		this.compLen = compLen;
	}

	public Double getGisLen() {
		return gisLen;
	}

	public void setGisLen(Double gisLen) {
		this.gisLen = gisLen;
	}

	public Double getCoreCnt() {
		return coreCnt;
	}

	public void setCoreCnt(Double coreCnt) {
		this.coreCnt = coreCnt;
	}

	public Double getUseCoreCnt() {
		return useCoreCnt;
	}

	public void setUseCoreCnt(Double useCoreCnt) {
		this.useCoreCnt = useCoreCnt;
	}

	public Double getConnCoreCnt() {
		return connCoreCnt;
	}

	public void setConnCoreCnt(Double connCoreCnt) {
		this.connCoreCnt = connCoreCnt;
	}

	public String getCompDt() {
		return compDt;
	}

	public void setCompDt(String compDt) {
		this.compDt = compDt;
	}

	public String getWorkDocNo() {
		return workDocNo;
	}

	public void setWorkDocNo(String workDocNo) {
		this.workDocNo = workDocNo;
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

	public String getUseCoreGrade() {
		return useCoreGrade;
	}

	public void setUseCoreGrade(String useCoreGrade) {
		this.useCoreGrade = useCoreGrade;
	}

	public Integer getSource() {
		return source;
	}

	public void setSource(Integer source) {
		this.source = source;
	}

	public Integer getTarget() {
		return target;
	}

	public void setTarget(Integer target) {
		this.target = target;
	}

	public Double getCost() {
		return cost;
	}

	public void setCost(Double cost) {
		this.cost = cost;
	}
}
