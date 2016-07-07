package org.uiscloud.member.service;

public class MemberSearchVO {
	
	private Integer page = 1;
	private Integer rows = 10;
	private Integer totalCount;
	private Integer fetchCount = 10;
	
	
	public MemberSearchVO(){
		
	}
	
	public MemberSearchVO( Integer page, Integer rows, Integer totalCount) {
		super();
		this.page = page;
		this.rows = rows;
		this.totalCount = totalCount;
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
	