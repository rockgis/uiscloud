package org.uiscloud.gis.bbsTail.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.bbsTail.service.impl.BbsTailDAO;

import org.uiscloud.gis.bbs.service.BbsVO;
import org.uiscloud.gis.bbsTail.service.BbsTailService;
import org.uiscloud.gis.bbsTail.service.BbsTailDefaultVO;
import org.uiscloud.gis.bbsTail.service.BbsTailVO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @Class Name : BbsTailServiceImpl.java
 * @Description : BbsTail Business Implement class
 * @Modification Information
 *
 * @author 김종민
 * @since 2014.03.05
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */

@Service("bbsTailService")
public class BbsTailServiceImpl extends AbstractServiceImpl implements
        BbsTailService {

    @Resource(name="bbsTailDAO")
    private BbsTailDAO bbsTailDAO;
    
	/**
	 * BBS_TAIL을 등록한다.
	 * @param vo - 등록할 정보가 담긴 BbsTailVO
	 * @return 등록 결과
	 * @exception Exception
	 */
    public String insertBbsTail(BbsTailVO vo) throws Exception {
    	log.debug(vo.toString());
    	
    	/** ID Generation Service */
    	//TODO 해당 테이블 속성에 따라 ID 제너레이션 서비스 사용
    	//String id = egovIdGnrService.getNextStringId();
    	//vo.setId(id);
    	log.debug(vo.toString());
    	
    	bbsTailDAO.insertBbsTail(vo);
    	//TODO 해당 테이블 정보에 맞게 수정    	
        return null;
    }

    /**
	 * BBS_TAIL을 수정한다.
	 * @param vo - 수정할 정보가 담긴 BbsTailVO
	 * @return void형
	 * @exception Exception
	 */
    public void updateBbsTail(BbsTailVO vo) throws Exception {
        bbsTailDAO.updateBbsTail(vo);
    }

    /**
	 * BBS_TAIL을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 BbsTailVO
	 * @return void형 
	 * @exception Exception
	 */
    public void deleteBbsTail(BbsTailVO vo) throws Exception {
        bbsTailDAO.deleteBbsTail(vo);
    }

    /**
	 * BBS_TAIL을 조회한다.
	 * @param vo - 조회할 정보가 담긴 BbsTailVO
	 * @return 조회한 BBS_TAIL
	 * @exception Exception
	 */
    public BbsTailVO selectBbsTail(BbsTailVO vo) throws Exception {
        BbsTailVO resultVO = bbsTailDAO.selectBbsTail(vo);
        if (resultVO == null)
            throw processException("info.nodata.msg");
        return resultVO;
    }

    /**
	 * BBS_TAIL 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS_TAIL 목록
	 * @exception Exception
	 */
    public List<BbsTailVO> selectBbsTailListByBbsVO(BbsVO vo) throws Exception {
        return (List<BbsTailVO>)bbsTailDAO.selectBbsTailListByBbsVO(vo);
    }

    /**
	 * BBS_TAIL 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS_TAIL 목록
	 * @exception Exception
	 */
    public List<BbsTailVO> selectBbsTailList(BbsTailDefaultVO searchVO) throws Exception {
        return (List<BbsTailVO>)bbsTailDAO.selectBbsTailList(searchVO);
    }

    /**
	 * BBS_TAIL 총 갯수를 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS_TAIL 총 갯수
	 * @exception
	 */
    public int selectBbsTailListTotCnt(BbsTailDefaultVO searchVO) {
		return bbsTailDAO.selectBbsTailListTotCnt(searchVO);
	}    
}