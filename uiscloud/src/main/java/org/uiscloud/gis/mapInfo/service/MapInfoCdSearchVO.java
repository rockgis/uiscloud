package org.uiscloud.gis.mapInfo.service;

import java.sql.Date;

public class MapInfoCdSearchVO extends MapInfoSearchVO{


	private String[] lyrClf;     	//임차시설물구분
	private double compLenMin;      //준공거리 이상
	private double compLenMax;      //준공거리 이하
	private double gisLenMin;       //도상거리 이상
	private double gisLenMax;       //도상거리 이하
	private Date compDtCompDtCompDtStartDate;			  //시작일자
	private Date compDtCompDtCompDtFinishDate;		  //종료일자
	private String[] lqtMt;     	  //관로규격
	private String[] digMthd;     	  //굴착방법
	
	public MapInfoCdSearchVO() {
		
	}

	public MapInfoCdSearchVO(String[] lyrClf, double compLenMin,double compLenMax,double gisLenMin,double gisLenMax
			, Date compDtCompDtCompDtStartDate, Date compDtCompDtCompDtFinishDate, String[] lqtMt, String[] digMthd) {
		super();
		this.setLyrClf(lyrClf);
		this.compLenMin = compLenMin;
		this.compLenMax = compLenMax;
		this.gisLenMin = gisLenMin;
		this.gisLenMax = gisLenMax;
		this.setCompDtStartDate(compDtCompDtCompDtStartDate);
		this.setCompDtFinishDate(compDtCompDtCompDtFinishDate);
		this.setLqtMt(lqtMt);
		this.setDigMthd(digMthd);
	}


	public String[] getLyrClf() {
		return lyrClf;
	}

	public void setLyrClf(String[] lyrClf) {
		this.lyrClf = lyrClf;
	}

	public double getCompLenMin() {
		return compLenMin;
	}

	public void setCompLenMin(double compLenMin) {
		this.compLenMin = compLenMin;
	}

	public double getCompLenMax() {
		return compLenMax;
	}

	public void setCompLenMax(double compLenMax) {
		this.compLenMax = compLenMax;
	}

	public double getGisLenMin() {
		return gisLenMin;
	}

	public void setGisLenMin(double gisLenMin) {
		this.gisLenMin = gisLenMin;
	}

	public double getGisLenMax() {
		return gisLenMax;
	}

	public void setGisLenMax(double gisLenMax) {
		this.gisLenMax = gisLenMax;
	}

	public Date getCompDtStartDate() {
		return compDtCompDtCompDtStartDate;
	}

	public void setCompDtStartDate(Date compDtCompDtCompDtStartDate) {
		this.compDtCompDtCompDtStartDate = compDtCompDtCompDtStartDate;
	}

	public Date getCompDtFinishDate() {
		return compDtCompDtCompDtFinishDate;
	}

	public void setCompDtFinishDate(Date compDtCompDtCompDtFinishDate) {
		this.compDtCompDtCompDtFinishDate = compDtCompDtCompDtFinishDate;
	}

	public String[] getLqtMt() {
		return lqtMt;
	}

	public void setLqtMt(String[] lqtMt) {
		this.lqtMt = lqtMt;
	}

	public String[] getDigMthd() {
		return digMthd;
	}

	public void setDigMthd(String[] digMthd) {
		this.digMthd = digMthd;
	}
}