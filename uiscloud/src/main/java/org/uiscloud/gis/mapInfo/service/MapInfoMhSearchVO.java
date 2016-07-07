package org.uiscloud.gis.mapInfo.service;

import java.sql.Date;

public class MapInfoMhSearchVO extends MapInfoSearchVO{

	private String[] sktSysClf;     //자사/타사 설비구분
	private String[] mhInd;     	  //인/수공 구분
	private Date compDtCompDtStartDate;			  //시작일자
	private Date compDtCompDtFinishDate;		  //종료일자
	private String[] mhStd;     	  //맨홀규격
	private String[] mhLoc;     	  //맨홀위치
	
	public MapInfoMhSearchVO() {
		
	}

	public MapInfoMhSearchVO(String[] sktSysClf, String[] mhInd, Date compDtCompDtStartDate, Date compDtCompDtFinishDate, String[] mhStd, String[] mhLoc) {
		super();
		this.setSktSysClf(sktSysClf);
		this.setMhInd(mhInd);
		this.setCompDtStartDate(compDtCompDtStartDate);
		this.setCompDtFinishDate(compDtCompDtFinishDate);
		this.setMhStd(mhStd);
		this.setMhLoc(mhLoc);
	}


	public String[] getSktSysClf() {
		return sktSysClf;
	}

	public void setSktSysClf(String[] sktSysClf) {
		this.sktSysClf = sktSysClf;
	}

	public String[] getMhInd() {
		return mhInd;
	}

	public void setMhInd(String[] mhInd) {
		this.mhInd = mhInd;
	}

	public Date getCompDtStartDate() {
		return compDtCompDtStartDate;
	}

	public void setCompDtStartDate(Date compDtCompDtStartDate) {
		this.compDtCompDtStartDate = compDtCompDtStartDate;
	}

	public Date getCompDtFinishDate() {
		return compDtCompDtFinishDate;
	}

	public void setCompDtFinishDate(Date compDtCompDtFinishDate) {
		this.compDtCompDtFinishDate = compDtCompDtFinishDate;
	}

	public String[] getMhStd() {
		return mhStd;
	}

	public void setMhStd(String[] mhStd) {
		this.mhStd = mhStd;
	}

	public String[] getMhLoc() {
		return mhLoc;
	}

	public void setMhLoc(String[] mhLoc) {
		this.mhLoc = mhLoc;
	}
}