package org.uiscloud.gis.mapInfo.service;

public class RingVO {
	private String netNo;

	private String netType;
	private String netTypeName;
	private String netNm;
	private Integer countCable;
	private Integer countTpo;
	private Double sumLengthSKTA;
	private Double sumLengthSKTD;
	private Double sumLengthSKBA;
	private Double sumLengthSKBD;	
	private Integer sumCoreringLen;
	private Integer sumCopoleLen;
	
	public RingVO() {}

	public RingVO(String netNo, String netType, String netTypeName, String netNm,
		Integer countCable, Integer countTpo, Double sumLengthSKTA,
		Double sumLengthSKTD, Double sumLengthSKBA, Double sumLengthSKBD, Integer sumCoreringLen, Integer sumCopoleLen) {
		super();
		this.netNo = netNo;
		this.netType = netType;
		this.netTypeName = netTypeName;
		this.netNm = netNm;
		this.countCable = countCable;
		this.countTpo = countTpo;
		this.sumLengthSKTA = sumLengthSKTA;
		this.sumLengthSKTD = sumLengthSKTD;
		this.sumLengthSKBA = sumLengthSKBA;
		this.sumLengthSKBD = sumLengthSKBD;
		this.sumCoreringLen = sumCoreringLen;
		this.sumCopoleLen = sumCopoleLen;
	}

	public String getNetNo() {
		return netNo;
	}

	public void setNetNo(String netNo) {
		this.netNo = netNo;
	}

	public String getNetType() {
		return netTypeName;
	}

//	public void setNetType(String netType) {
//		this.netType = netType;
//	}

	public String getNetTypeName() {
		String ntn = "기타";
		
		if("029001".equals(netType)) {
			ntn = "기간망";
		} else if("029002".equals(netType)) {
			ntn = "중심국망";
		} else if("029003".equals(netType)) {
			ntn = "기지국망";
		} else if("029004".equals(netType)) {
			ntn = "가입자망";
		}
			
		return ntn;
	}

	public void setNetTypeName(String netTypeName) {
		this.netTypeName = netTypeName;
	}

	public String getNetNm() {
		return netNm;
	}

	public void setNetNm(String netNm) {
		this.netNm = netNm;
	}

	public Integer getCountCable() {
		return countCable;
	}

	public void setCountCable(Integer countCable) {
		this.countCable = countCable;
	}

	public Integer getCountTpo() {
		return countTpo;
	}

	public void setCountTpo(Integer countTpo) {
		this.countTpo = countTpo;
	}

	public Double getSumLengthSKTA() {
		return sumLengthSKTA;
	}

	public void setSumLengthSKTA(Double sumLengthSKTA) {
		this.sumLengthSKTA = sumLengthSKTA;
	}

	public Double getSumLengthSKTD() {
		return sumLengthSKTD;
	}

	public void setSumLengthSKTD(Double sumLengthSKTD) {
		this.sumLengthSKTD = sumLengthSKTD;
	}

	public Double getSumLengthSKBA() {
		return sumLengthSKBA;
	}

	public void setSumLengthSKBA(Double sumLengthSKBA) {
		this.sumLengthSKBA = sumLengthSKBA;
	}

	public Double getSumLengthSKBD() {
		return sumLengthSKBD;
	}

	public void setSumLengthSKBD(Double sumLengthSKBD) {
		this.sumLengthSKBD = sumLengthSKBD;
	}

	public void setNetType(String netType) {
		this.netType = netType;
	}

	public Integer getSumCoreringLen() {
		return sumCoreringLen;
	}

	public void setSumCoreringLen(Integer sumCoreringLen) {
		this.sumCoreringLen = sumCoreringLen;
	}

	public Integer getSumCopoleLen() {
		return sumCopoleLen;
	}

	public void setSumCopoleLen(Integer sumCopoleLen) {
		this.sumCopoleLen = sumCopoleLen;
	}
}
