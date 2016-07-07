package org.uiscloud.gis.mapsv.service;

import org.hibernate.validator.constraints.NotBlank;

public class SpatialCommonVO {

	private Integer gid;
	
	private String unqMgno;
	
	private String fctsNm;
	
	private String cnstMgno;
	
	private String lglCd;
	
	private String lglNm;
	
	private String sysClf;
	
	private String ownClf;
	
	private String gisCd;
	
	private String gisCode;
	
	private String gisNm;
	
	@NotBlank
	private String wkt;
	
	private String featureType;
	
	private String insertOpr;
	
	private String newYn;

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

	public String getLglCd() {
		return lglCd;
	}

	public void setLglCd(String lglCd) {
		this.lglCd = lglCd;
	}

	public String getLglNm() {
		return lglNm;
	}

	public void setLglNm(String lglNm) {
		this.lglNm = lglNm;
	}

	public String getSysClf() {
		return sysClf;
	}

	public void setSysClf(String sysClf) {
		this.sysClf = sysClf;
	}

	public String getOwnClf() {
		return ownClf;
	}

	public void setOwnClf(String ownClf) {
		this.ownClf = ownClf;
	}

	public String getGisCd() {
		return gisCd;
	}

	public void setGisCd(String gisCd) {
		this.gisCd = gisCd;
	}

	public String getGisCode() {
		return gisCode;
	}

	public void setGisCode(String gisCode) {
		this.gisCode = gisCode;
	}

	public String getGisNm() {
		return gisNm;
	}

	public void setGisNm(String gisNm) {
		this.gisNm = gisNm;
	}

	public String getWkt() {
		return wkt;
	}

	public void setWkt(String wkt) {
		this.wkt = wkt;
	}

	public String getFeatureType() {
		return featureType;
	}

	public void setFeatureType(String featureType) {
		this.featureType = featureType;
	}

	public String getInsertOpr() {
		return insertOpr;
	}

	public void setInsertOpr(String insertOpr) {
		this.insertOpr = insertOpr;
	}

	public String getNewYn() {
		return newYn;
	}

	public void setNewYn(String newYn) {
		this.newYn = newYn;
	}
	
}
