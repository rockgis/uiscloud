package org.uiscloud.gis.mapInfo.service;

public class MapInfoVO {
	private Integer gid;
	private String unqMgno; 		// 고유관리번호
	private String fctsNm;			// 시설명
	private String cnstMgno;		// 공사번호
	private String caMgno; 			// 시설물관리번호
	private String lglCd;
	private String addr;
	private String theGeom;
	private String layerName;
	
	private String ctprvnCd; // 시도 코드
	private String ctpEngNm; // 시도 영문	
	private String ctpKorNm; // 시도 한글	
	
	private String sigCd; // 시군구 코드
	private String sigEngNm; // 시군구 영문	
	private String sigKorNm; // 시군구 한글	
	
	private String emdCd; // 읍면동 코드
	private String emdEngNm; // 읍면동 영문	
	private String emdKorNm; // 읍면동 한글
	
	public MapInfoVO() {
		
	}

	public MapInfoVO(Integer gid, String unqMgno, String fctsNm, String cnstMgno, String caMgno
			, String lglCd, String addr, String theGeom, String layerName) {
		super();
		this.gid = gid;
		this.unqMgno = unqMgno;
		this.fctsNm = fctsNm;
		this.cnstMgno = cnstMgno;
		this.caMgno = caMgno;
		this.lglCd = lglCd;
		this.addr = addr;
		this.theGeom = theGeom;
		this.layerName = layerName;
	}

	public Integer getGid() {
		return gid;
	}

	public void setGid(Integer gid) {
		this.gid = gid;
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

	public String getCnstMgno() {
		return cnstMgno;
	}

	public void setCnstMgno(String cnstMgno) {
		this.cnstMgno = cnstMgno;
	}

	public String getCaMgno() {
		return caMgno;
	}

	public void setCaMgno(String caMgno) {
		this.caMgno = caMgno;
	}

	public String getLglCd() {
		return lglCd;
	}

	public void setLglCd(String lglCd) {
		this.lglCd = lglCd;
	}

	public String getAddr() {
		return addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}

	public String getTheGeom() {
		return theGeom;
	}

	public void setTheGeom(String theGeom) {
		this.theGeom = theGeom;
	}

	public String getLayerName() {
		return layerName;
	}

	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}

	public String getCtprvnCd() {
		return ctprvnCd;
	}

	public void setCtprvnCd(String ctprvnCd) {
		this.ctprvnCd = ctprvnCd;
	}

	public String getCtpEngNm() {
		return ctpEngNm;
	}

	public void setCtpEngNm(String ctpEngNm) {
		this.ctpEngNm = ctpEngNm;
	}

	public String getCtpKorNm() {
		return ctpKorNm;
	}

	public void setCtpKorNm(String ctpKorNm) {
		this.ctpKorNm = ctpKorNm;
	}

	public String getSigCd() {
		return sigCd;
	}

	public void setSigCd(String sigCd) {
		this.sigCd = sigCd;
	}

	public String getSigEngNm() {
		return sigEngNm;
	}

	public void setSigEngNm(String sigEngNm) {
		this.sigEngNm = sigEngNm;
	}

	public String getSigKorNm() {
		return sigKorNm;
	}

	public void setSigKorNm(String sigKorNm) {
		this.sigKorNm = sigKorNm;
	}

	public String getEmdCd() {
		return emdCd;
	}

	public void setEmdCd(String emdCd) {
		this.emdCd = emdCd;
	}

	public String getEmdEngNm() {
		return emdEngNm;
	}

	public void setEmdEngNm(String emdEngNm) {
		this.emdEngNm = emdEngNm;
	}

	public String getEmdKorNm() {
		return emdKorNm;
	}

	public void setEmdKorNm(String emdKorNm) {
		this.emdKorNm = emdKorNm;
	}
	
}