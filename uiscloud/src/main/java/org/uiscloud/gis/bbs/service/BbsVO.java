package org.uiscloud.gis.bbs.service;


/**
 * @Class Name : BbsVO.java
 * @Description : Bbs VO class
 * @Modification Information
 *
 * @author 김종민
 * @since 2014.03.05
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */
import java.sql.Date;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import org.uiscloud.gis.bbsTail.service.BbsTailVO;

public class BbsVO extends BbsDefaultVO{
    private static final long serialVersionUID = 1L;
    
    /** CNT_ID */
    private Integer bbsId;
    
    /** TITLE */
    private String title;
    
    /** CONTENT */
    private String content;
    
    /** VIEW_COUNT */
    private Integer viewCount;
    
    /** CREATE_DATETIME */
    private java.sql.Date createDatetime;
    
    /** CREATOR */
    private String creator;
    
    /** PWD */
    private String pwd;
    
    /** Tail_Count */
    private Integer tailCount;
    
    /** FILE NAME(original) */
    private List<String> fileNames;
    
    /** FILE NAME(new) */
    private List<String> newFileNames;
    
    /** FILE NAME(original) */
    private String fileName;
    
    /** FILE NAME(new) */
    private String newFileName;
    
    /** Tail_Count */
    private Integer fileCount;
    
    /** Tail_Count */
    private Integer fileSeq;
    
    private java.sql.Date startDate;
    
    private java.sql.Date endDate;
    
    private String bbsType;
    
    
    public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getNewFileName() {
		return newFileName;
	}

	public void setNewFileName(String newFileName) {
		this.newFileName = newFileName;
	}

	/** FILE */  
    private List<MultipartFile> files;
    
    private List<BbsTailVO> bbsTailVOs;
    
    public BbsVO() {
    	
    }
    
    public BbsVO(Integer bbsId, String title, String content, Integer viewCount,List<String> newFileNames,
			Date createDatetime, String creator, String pwd, Integer tailCount,List<String> fileNames, Integer fileSeq,
			List<BbsTailVO> bbsTailVOs, List<MultipartFile> files, Date startDate, Date endDate, String bbsType) {
		super();
		this.bbsId = bbsId;
		this.title = title;
		this.content = content;
		this.viewCount = viewCount;
		this.createDatetime = createDatetime;
		this.creator = creator;
		this.pwd = pwd;
		this.fileNames = fileNames;
		this.newFileNames = newFileNames;
		this.bbsTailVOs = bbsTailVOs;
		this.files = files;
		this.fileSeq = fileSeq;
		this.startDate = startDate;
		this.endDate = endDate;
		this.bbsType = bbsType;
	}

	public Integer getFileCount() {
		return fileCount;
	}

	public void setFileCount(Integer fileCount) {
		this.fileCount = fileCount;
	}

	public List<MultipartFile> getFiles() {
		return files;
	}

	public void setFiles(List<MultipartFile> files) {
		this.files = files;
	}

	public Integer getBbsId() {
        return this.bbsId;
    }
    
    public void setBbsId(Integer bbsId) {
        this.bbsId = bbsId;
    }
    
    public java.lang.String getTitle() {
        return this.title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public java.lang.String getContent() {
        return this.content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Integer getViewCount() {
        return this.viewCount;
    }
    
    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }
    
    public java.sql.Date getCreateDatetime() {
        return this.createDatetime;
    }
    
    public void setCreateDatetime(java.sql.Date createDatetime) {
        this.createDatetime = createDatetime;
    }
    
    public String getCreator() {
        return this.creator;
    }
    
    public void setCreator(String creator) {
        this.creator = creator;
    }

	public List<BbsTailVO> getBbsTailVOs() {
		return bbsTailVOs;
	}

	public void setBbsTailVOs(List<BbsTailVO> bbsTailVOs) {
		this.bbsTailVOs = bbsTailVOs;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public Integer getTailCount() {
		return tailCount;
	}

	public void setTailCount(Integer tailCount) {
		this.tailCount = tailCount;
	}

	public List<String> getFileNames() {
		return fileNames;
	}

	public void setFileNames(List<String> fileNames2) {
		this.fileNames = fileNames2;
	}

	public List<String> getNewFileNames() {
		return newFileNames;
	}

	public java.sql.Date getStartDate() {
		return startDate;
	}

	public void setStartDate(java.sql.Date startDate) {
		this.startDate = startDate;
	}

	public java.sql.Date getEndDate() {
		return endDate;
	}

	public void setEndDate(java.sql.Date endDate) {
		this.endDate = endDate;
	}

	public String getBbsType() {
		return bbsType;
	}

	public void setBbsType(String bbsType) {
		this.bbsType = bbsType;
	}

	public void setNewFileNames(List<String> newFileNames) {
		this.newFileNames = newFileNames;
	}

	public Integer getFileSeq() {
		return fileSeq;
	}

	public void setFileSeq(Integer fileSeq) {
		this.fileSeq = fileSeq;
	}
	
}
