package org.uiscloud.gis.bbs.service;

import java.util.List;
import java.util.Map;

import org.uiscloud.gis.bbs.service.BbsVO;

/**
 * @Class Name : BbsService.java
 * @Description : Bbs Business class
 * @Modification Information
 *
 * @author 김종민
 * @since 2014.03.05
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */
public interface BbsService {
	
	/**
	 * BBS을 등록한다.
	 * @param vo - 등록할 정보가 담긴 BbsVO
	 * @return 등록 결과
	 * @exception Exception
	 */
    String insertBbs(BbsVO vo) throws Exception;
    
    /**
	 * BBS을 수정한다.
	 * @param vo - 수정할 정보가 담긴 BbsVO
	 * @return void형
	 * @exception Exception
	 */
    void updateBbs(BbsVO vo) throws Exception;
    
    /**
	 * BBS을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 BbsVO
	 * @return void형 
	 * @exception Exception
	 */
    void deleteBbs(BbsVO vo) throws Exception;
    
    /**
	 * BBS을 조회한다.
	 * @param vo - 조회할 정보가 담긴 BbsVO
	 * @return 조회한 BBS
	 * @exception Exception
	 */
    BbsVO selectBbs(BbsVO vo) throws Exception;
    
    /**
	 * BBS첨부파일을 조회한다.
	 * @param vo - 조회할 정보가 담긴 BbsVO
	 * @return 조회한 BBS
	 * @exception Exception
	 */
    List<String> selectBbsFile(BbsVO vo) throws Exception;
    List<Map<String, String>> selectBbsFileList(BbsVO vo) throws Exception;
    /**
	 * BBS첨부파일을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 BbsVO
	 * @return void형 
	 * @exception Exception
	 */
    void deleteFile(BbsVO vo) throws Exception;
    
    /**
	 * BBS첨부파일을 조회한다.
	 * @param vo - 조회할 정보가 담긴 BbsVO
	 * @return 조회한 BBS
	 * @exception Exception
	 */
    BbsVO selectBbsFileDown(BbsVO vo) throws Exception;
    /**
	 * BBS 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS 목록
	 * @exception Exception
	 */
    List<BbsVO> selectBbsList(BbsDefaultVO searchVO) throws Exception;
    
    /**
	 * BBS 총 갯수를 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS 총 갯수
	 * @exception
	 */
    int selectBbsListTotCnt(BbsDefaultVO searchVO);
    

	void updateViewCnt(BbsVO vo) throws Exception;    
}
