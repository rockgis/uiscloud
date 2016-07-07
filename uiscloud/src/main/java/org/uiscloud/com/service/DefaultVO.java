package org.uiscloud.com.service;

import java.io.Serializable;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * 
 * @Class Name  : BiesDefaultVO.java
 * @Description : BiesDefaultVO Class
 * @Modification Information  
 * @
 * @   수정일          수정자        수정내용
 * @ -------------  ----------  ---------------------------
 * @   2014. 01. 22.  system      최초 생성
 * 
 * @author system
 * @since 2014. 01. 22.
 * @version 1.0
 * @see bies 시스템
 *
 */
public class DefaultVO implements Serializable {
	
	private static final long serialVersionUID = 1L;

    /** 현재페이지 */
    private int pageIndex = 1;
    
    /** 페이지갯수 */
    private int pageUnit = 10;
    
    /** 페이지사이즈 */
    private int pageSize = 10;

    /** firstIndex */
    private int firstIndex = 1;

    /** lastIndex */
    private int lastIndex = 1;

    /** recordCountPerPage */
    private int recordCountPerPage = 10;

    /** totalCount */
    private int totalCount = 0;

    /** currentPage */
    private int currentPage = 0;

    /** volumePerPage */
    private int volumePerPage = 0;
    
    /** changeSe */
    private String changeSe;
    
        
	public int getFirstIndex() {
		return firstIndex;
	}

	public void setFirstIndex(int firstIndex) {
		this.firstIndex = firstIndex;
	}

	public int getLastIndex() {
		return lastIndex;
	}

	public void setLastIndex(int lastIndex) {
		this.lastIndex = lastIndex;
	}

	public int getRecordCountPerPage() {
		return recordCountPerPage;
	}

	public void setRecordCountPerPage(int recordCountPerPage) {
		this.recordCountPerPage = recordCountPerPage;
	}

	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public int getVolumePerPage() {
		return volumePerPage;
	}

	public void setVolumePerPage(int volumePerPage) {
		this.volumePerPage = volumePerPage;
	}

    public int getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
    }

    public int getPageUnit() {
        return pageUnit;
    }

    public void setPageUnit(int pageUnit) {
        this.pageUnit = pageUnit;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
    

    public String getChangeSe() {
		return changeSe;
	}

	public void setChangeSe(String changeSe) {
		this.changeSe = changeSe;
	}

	public String toString() {
        return ToStringBuilder.reflectionToString(this);
    }
}