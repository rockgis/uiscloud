package org.uiscloud.gis.mapsv.service;

public class GotcTpoVO extends SpatialCommonVO {
	
	private String tpMgno;

	private String addr;
	
	private String clientCd;

	public String getTpMgno() {
		return tpMgno;
	}

	public void setTpMgno(String tpMgno) {
		this.tpMgno = tpMgno;
	}

	public String getAddr() {
		return addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}

	public String getClientCd() {
		return clientCd;
	}

	public void setClientCd(String clientCd) {
		this.clientCd = clientCd;
	}
	
}
