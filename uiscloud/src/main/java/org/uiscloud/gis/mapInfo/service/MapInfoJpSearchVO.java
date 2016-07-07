package org.uiscloud.gis.mapInfo.service;

public class MapInfoJpSearchVO extends MapInfoSearchVO{

	private String[] jpClf;     //접속함체 유형분류
	private String[] instLoc;     //접속함체 설치위치
	private Integer boxCntMin;			//접속함체 수 이상
	private Integer boxCntMax;			//접속함체 수 이하
	
	public MapInfoJpSearchVO() {
		
	}

	public MapInfoJpSearchVO(String[] jpClf, String[] instLoc, Integer boxCntMin, Integer boxCntMax ) {
		super();
		this.setJpClf(jpClf);
		this.setInstLoc(instLoc);
		this.boxCntMin = boxCntMin;
		this.boxCntMax = boxCntMax;
	}

	public String[] getJpClf() {
		return jpClf;
	}

	public void setJpClf(String[] jpClf) {
		this.jpClf = jpClf;
	}

	public String[] getInstLoc() {
		return instLoc;
	}

	public void setInstLoc(String[] instLoc) {
		this.instLoc = instLoc;
	}

	public Integer getBoxCntMin() {
		return boxCntMin;
	}

	public void setBoxCntMin(Integer boxCntMin) {
		this.boxCntMin = boxCntMin;
	}

	public Integer getBoxCntMax() {
		return boxCntMax;
	}

	public void setBoxCntMax(Integer boxCntMax) {
		this.boxCntMax = boxCntMax;
	}

}