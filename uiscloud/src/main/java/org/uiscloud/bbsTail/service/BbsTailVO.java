package org.uiscloud.bbsTail.service;


import java.sql.Date;

import org.springframework.web.multipart.MultipartFile;
/**
 * @Class Name : BbsTailVO.java
 * @Description : BbsTail VO class
 * @Modification Information
 *
 * @author 김종민
 * @since 2014.03.05
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */
import org.uiscloud.bbs.service.BbsVO;

public class BbsTailVO extends BbsTailDefaultVO {
    private static final long serialVersionUID = 1L;
    
    /** CNT_ID */
    private Integer bbsTailId;
    
    /** CONTENT */
    private String content;
    
    /** CREATE_DATETIME */
    private java.sql.Date createDatetime;
    
    /** PWD */
    private String pwd;
    
    /** CREATOR */
    private String creator;   
    
    /** FILE */   
    private MultipartFile uploadfile;
    
    /** BbsVO */    
    private BbsVO bbsVO;
    
    public BbsTailVO() {
    	bbsVO = new BbsVO();
    }
    
    public BbsTailVO(Integer bbsTailId, String content, Date createDatetime,
			String pwd, String creator,MultipartFile uploadfile, BbsVO bbsVO) {
		super();
		this.bbsTailId = bbsTailId;
		this.content = content;
		this.createDatetime = createDatetime;
		this.pwd = pwd;
		this.creator = creator;
		this.bbsVO = bbsVO;
		this.uploadfile = uploadfile;
	}

	public Integer getBbsTailId() {
        return this.bbsTailId;
    }
    
    public void setBbsTailId(Integer bbsTailId) {
        this.bbsTailId = bbsTailId;
    }
    
    public String getContent() {
        return this.content;
    }
    
    public void setContent(String content) {
        this.content = content;
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
    
    public Integer getBbsId() {
        return this.bbsVO.getBbsId();
    }
    
    public void setBbsId(Integer bbsId) {
        this.bbsVO.setBbsId(bbsId);
    }

	public BbsVO getBbsVO() {
		return this.bbsVO;
	}

	public void setBbsVO(BbsVO bbsVO) {
		this.bbsVO = bbsVO;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}  
	
	public MultipartFile getUploadfile() {
        return uploadfile;
    }
 
    public void setUploadfile(MultipartFile uploadfile) {
        this.uploadfile = uploadfile;
    }
}