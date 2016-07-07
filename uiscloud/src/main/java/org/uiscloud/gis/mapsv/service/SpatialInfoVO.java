package org.uiscloud.gis.mapsv.service;

import java.util.List;

public class SpatialInfoVO {
	
	private String targetTableNameList;
	
	private String targetTableKorNameList;
	
	private String tableName;
	
	private Integer gid;
	
	private List<Integer> gids;
	
	private String columsStr;

	private double lon = 0.0;
	
	private double lat = 0.0;
	
	private int dist = 1;
	
	private String polyGeom;
	
	
	public String getTargetTableKorNameList() {
		return targetTableKorNameList;
	}

	public void setTargetTableKorNameList(String targetTableKorNameList) {
		this.targetTableKorNameList = targetTableKorNameList;
	}

	public String getTargetTableNameList() {
		return targetTableNameList;
	}

	public void setTargetTableNameList(String targetTableNameList) {
		this.targetTableNameList = targetTableNameList;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public Integer getGid() {
		return gid;
	}

	public void setGid(Integer gid) {
		this.gid = gid;
	}

	public List<Integer> getGids() {
		return gids;
	}

	public void setGids(List<Integer> gids) {
		this.gids = gids;
	}

	public String getColumsStr() {
		return columsStr;
	}

	public void setColumsStr(String columsStr) {
		this.columsStr = columsStr;
	}

	public double getLon() {
		return lon;
	}

	public void setLon(double lon) {
		this.lon = lon;
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public int getDist() {
		return dist;
	}

	public void setDist(int dist) {
		this.dist = dist;
	}

	public String getPolyGeom() {
		return polyGeom;
	}

	public void setPolyGeom(String polyGeom) {
		this.polyGeom = polyGeom;
	}
}
