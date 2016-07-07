package org.uiscloud.gis.mapsv.service;

public class GotcCdVO extends SpatialCommonVO {

	private String pipeMgno;
	
	private Double compLen;
	
	private String digMthd;
	
	private String lqtMt;
	
	private Double gisLen;

	public String getPipeMgno() {
		return pipeMgno;
	}

	public void setPipeMgno(String pipeMgno) {
		this.pipeMgno = pipeMgno;
	}

	public Double getCompLen() {
		return compLen;
	}

	public void setCompLen(Double compLen) {
		this.compLen = compLen;
	}

	public String getDigMthd() {
		return digMthd;
	}

	public void setDigMthd(String digMthd) {
		this.digMthd = digMthd;
	}

	public String getLqtMt() {
		return lqtMt;
	}

	public void setLqtMt(String lqtMt) {
		this.lqtMt = lqtMt;
	}

	public Double getGisLen() {
		return gisLen;
	}

	public void setGisLen(Double gisLen) {
		this.gisLen = gisLen;
	}
	
}
