package org.uiscloud.gis.mapInfo.service;

public class MapInfoSearchVO {
	private String fctsNm;			// 시설명
	private String unqMgno;			// 시설물관리번호
	private String cnstMgno;		// NITS공사번호
	private String[] sysClf;		// 자산소유구분
	private String lglCd;			// LglCd
	private String tableName;
	private String[] gisCode;
	private String layerName;
	private Integer page = 1;
	private Integer rows = 10;
	private Integer totalCount;
	private Integer fetchCount = 10;
	
	public MapInfoSearchVO() {
		
	}

	public MapInfoSearchVO(String fctsNm, String unqMgno,
			String cnstMgno, String[] sysClf, String lglCd, String tableName, 
			String[] condition, String layerName, Integer page, Integer rows, Integer totalCount) {
		super();
		this.fctsNm = fctsNm;
		this.unqMgno = unqMgno;
		this.cnstMgno = cnstMgno;
		this.sysClf = sysClf;
		this.lglCd = lglCd;
		this.tableName = tableName;
		this.gisCode = gisCode;
		this.layerName = layerName;
		this.page = page;
		this.rows = rows;
		this.totalCount = totalCount;
	}

	public String getUnqMgno() {
		return unqMgno;
	}

	public void setUnqMgno(String unqMgno) {
		this.unqMgno = unqMgno;
	}

	public String getCnstMgno() {
		return cnstMgno;
	}

	public void setCnstMgno(String cnstMgno) {
		this.cnstMgno = cnstMgno;
	}

	public String[] getSysClf() {
		return sysClf;
	}

	public void setSysClf(String[] sysClf) {
		this.sysClf = sysClf;
	}

	public String getFctsNm() {
		return fctsNm;
	}

	public void setFctsNm(String fctsNm) {
		this.fctsNm = fctsNm;
	}

	public String getLglCd() {
		return lglCd;
	}

	public void setLglCd(String lglCd) {
		this.lglCd = lglCd;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String[] getGisCode() {
		return gisCode;
	}

	public void setGisCode(String[] gisCode) {
		this.gisCode = gisCode;
	}

	public String getLayerName() {
		return layerName;
	}

	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		if(page != null) {
			this.page = page;
		}
	}

	public Integer getRows() {
		return rows;
	}

	public void setRows(Integer rows) {
		if(rows != null) {
			this.rows = rows;
		}
	}

	public Integer getFetchCount() {
		if(totalCount > page * rows) {
			fetchCount = rows;
		} else {
			fetchCount = totalCount - ((page - 1) * rows);			
		}
		return fetchCount;
	}

//	public void setFetchCount(Integer fetchCount) {
//		this.fetchCount = fetchCount;
//	}

	public Integer getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(Integer totalCount) {
		this.totalCount = totalCount;
	}
}