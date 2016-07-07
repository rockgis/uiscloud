package org.uiscloud.gis.bookmark.service;

public class BookmarkSearchVO extends BookmarkVO {
	private String conditionField;
	private String condition;
	private String layerName;
	private Integer page = 1;
	private Integer rows = 10;
	private Integer totalCount;
	private Integer fetchCount = 10;
    
    public BookmarkSearchVO() {
    	
    }
    
  	public BookmarkSearchVO(Integer gid, String headOffice, String creator,
			String title, String conditionField, String condition, String layerName,
			Integer page, Integer rows, Integer totalCount, Integer fetchCount) {
		super(gid, headOffice, creator, title);
		this.conditionField = conditionField;
		this.condition = condition;
		this.layerName = layerName;
		this.page = page;
		this.rows = rows;
		this.totalCount = totalCount;
		this.fetchCount = fetchCount;
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
		this.page = page;
	}

	public Integer getRows() {
		return rows;
	}

	public void setRows(Integer rows) {
		if(rows != null) {
			this.rows = rows;
		}
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