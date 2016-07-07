package org.uiscloud.gis.mapInfo.service;

public class RingSearchVO {
	private Integer layerTreePk;			// 링종류 - 시설물종류(레이어 트리 PK)
	private String conditionField;
	private String condition;
	private String ringName;				// 링명
	private String layerName;
	private String lglCd;
	private Integer page = 1;
	private Integer rows = 10;
	private Integer totalCount;
	private Integer fetchCount = 10;
	
	public RingSearchVO() {}

	public RingSearchVO(Integer layerTreePk, String conditionField,
			String condition, String ringName, String layerName, String lglCd, Integer page,
			Integer rows, Integer totalCount, Integer fetchCount) {
		super();
		this.layerTreePk = layerTreePk;
		this.conditionField = conditionField;
		this.condition = condition;
		this.ringName = ringName;
		this.layerName = layerName;
		this.lglCd = lglCd;
		this.page = page;
		this.rows = rows;
		this.totalCount = totalCount;
		this.fetchCount = fetchCount;
	}

	public Integer getLayerTreePk() {
		return layerTreePk;
	}

	public void setLayerTreePk(Integer layerTreePk) {
		this.layerTreePk = layerTreePk;
	}

	public String getConditionField() {
		return conditionField;
	}

	public void setConditionField(String conditionField) {
		this.conditionField = conditionField;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

	public String getRingName() {
		return ringName;
	}

	public void setRingName(String ringName) {
		this.ringName = ringName;
	}

	public String getLayerName() {
		return layerName;
	}

	public void setLayerName(String layerName) {
		this.layerName = layerName;
	}

	public String getLglCd() {
		return lglCd;
	}

	public void setLglCd(String lglCd) {
		this.lglCd = lglCd;
	}

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}

	public Integer getRows() {
		return rows;
	}

	public void setRows(Integer rows) {
		this.rows = rows;
	}

	public Integer getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(Integer totalCount) {
		this.totalCount = totalCount;
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
}
