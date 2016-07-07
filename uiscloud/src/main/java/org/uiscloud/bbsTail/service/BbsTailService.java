package org.uiscloud.bbsTail.service;

import java.util.List;

import org.uiscloud.bbs.service.BbsVO;
import org.uiscloud.bbsTail.service.BbsTailVO;

/**
 * @Class Name : BbsTailService.java
 * @Description : BbsTail Business class
 * @Modification Information
 *
 * @author 김종민
 * @since 2014.03.05
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */
public interface BbsTailService {
	
	/**
	 * BBS_TAIL을 등록한다.
	 * @param vo - 등록할 정보가 담긴 BbsTailVO
	 * @return 등록 결과
	 * @exception Exception
	 */
    String insertBbsTail(BbsTailVO vo) throws Exception;
    
    /**
	 * BBS_TAIL을 수정한다.
	 * @param vo - 수정할 정보가 담긴 BbsTailVO
	 * @return void형
	 * @exception Exception
	 */
    void updateBbsTail(BbsTailVO vo) throws Exception;
    
    /**
	 * BBS_TAIL을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 BbsTailVO
	 * @return void형 
	 * @exception Exception
	 */
    void deleteBbsTail(BbsTailVO vo) throws Exception;
    
    /**
	 * BBS_TAIL을 조회한다.
	 * @param vo - 조회할 정보가 담긴 BbsTailVO
	 * @return 조회한 BBS_TAIL
	 * @exception Exception
	 */
    BbsTailVO selectBbsTail(BbsTailVO vo) throws Exception;
    
    /**
	 * BBS_TAIL 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS_TAIL 목록
	 * @exception Exception
	 */
    List<BbsTailVO> selectBbsTailListByBbsVO(BbsVO vo) throws Exception;
    
    /**
	 * BBS_TAIL 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS_TAIL 목록
	 * @exception Exception
	 */
    List<BbsTailVO> selectBbsTailList(BbsTailDefaultVO searchVO) throws Exception;
    
    /**
	 * BBS_TAIL 총 갯수를 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS_TAIL 총 갯수
	 * @exception
	 */
    int selectBbsTailListTotCnt(BbsTailDefaultVO searchVO);
    
}
