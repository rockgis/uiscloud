package org.uiscloud.com.service.impl;

public class NewLine {
	// 선종류
	private String cableTypeName;
	// 선길이
	private Double measureDist;
	// 길이 단위
	private String measureUnit;
	
	public NewLine() {
		
	}
	
	public NewLine(String cableTypeName, Double measureDist, String measureUnit) {
		super();
		this.cableTypeName = cableTypeName;
		this.measureDist = measureDist;
		this.measureUnit = measureUnit;
	}

	public String getCableTypeName() {
		return cableTypeName;
	}

	public void setCableTypeName(String cableTypeName) {
		this.cableTypeName = cableTypeName;
	}

	public Double getMeasureDist() {
		return measureDist;
	}

	public void setMeasureDist(Double measureDist) {
		this.measureDist = measureDist;
	}

	public String getMeasureUnit() {
		return measureUnit;
	}

	public void setMeasureUnit(String measureUnit) {
		this.measureUnit = measureUnit;
	}
}