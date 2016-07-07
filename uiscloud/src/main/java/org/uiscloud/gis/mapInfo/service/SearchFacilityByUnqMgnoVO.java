package org.uiscloud.gis.mapInfo.service;

public class SearchFacilityByUnqMgnoVO {
	private String unqMgno;
	private String tableName;
	
	public SearchFacilityByUnqMgnoVO() {
		
	};
	
	public SearchFacilityByUnqMgnoVO(
			String unqMgno, String tableName) {
		super();
		this.unqMgno = unqMgno;
		this.tableName = tableName;
	}
	
	public String getUnqMgno() {
		return unqMgno;
	}
	public void setUnqMgno(String unqMgno) {
		this.unqMgno = unqMgno;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
}
