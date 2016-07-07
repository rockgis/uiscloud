package org.uiscloud.gis.mapInfo.service;

public class MapInfoTpoSearchVO extends MapInfoSearchVO{

	private String addr;			//주소
	private String[] clientCd;     //국소유형분류
	private String[] devType;      //장비유형분류
	
	public MapInfoTpoSearchVO() {
		
	}

	public MapInfoTpoSearchVO(String addr, String[] clientCd, String[] devType) {
		super();
		this.addr = addr;
		this.setClientCd(clientCd);
		this.setDevType(devType);
	}
	public String getAddr() {
		return addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}

	public String[] getClientCd() {
		return clientCd;
	}

	public void setClientCd(String[] clientCd) {
		this.clientCd = clientCd;
	}

	public String[] getDevType() {
		return devType;
	}

	public void setDevType(String[] devType) {
		this.devType = devType;
	}

}