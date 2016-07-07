package org.uiscloud.com.service;

public class LglCdVO {
	private Integer gid; 
	private String ctprvnCd; // 시도 코드
	private String ctpEngNm; // 시도 영문	
	private String ctpKorNm; // 시도 한글	
	
	private String sigCd; // 시군구 코드
	private String sigEngNm; // 시군구 영문	
	private String sigKorNm; // 시군구 한글	
	
	private String emdCd; // 읍면동 코드
	private String emdEngNm; // 읍면동 영문	
	private String emdKorNm; // 읍면동 한글
	
	public LglCdVO() {
		this.ctprvnCd = "";
		this.sigCd = "";
		this.emdCd = "";
		
		this.ctpKorNm = "전체";
		this.sigKorNm = "전체";
		this.emdKorNm = "전체";
	}
	
	public Integer getGid() {
		return gid;
	}
	public void setGid(Integer gid) {
		this.gid = gid;
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