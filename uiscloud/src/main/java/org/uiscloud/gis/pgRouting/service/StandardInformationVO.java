package org.uiscloud.gis.pgRouting.service;

public class StandardInformationVO {
	private String pk;
	private String name;
	
	public StandardInformationVO() {
		
	}
	
	public StandardInformationVO(String pk, String name) {
		this.pk = pk;
		this.name = name;
	}	
	
	public String getPk() {
		return pk;
	}
	public void setPk(String pk) {
		this.pk = pk;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
