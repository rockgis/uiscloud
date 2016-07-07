package org.uiscloud.bbs.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.bbs.service.impl.BbsDAO;

import org.uiscloud.bbs.service.BbsDefaultVO;
import org.uiscloud.bbs.service.BbsService;
import org.uiscloud.bbs.service.BbsVO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @Class Name : BbsServiceImpl.java
 * @Description : Bbs Business Implement class
 * @Modification Information
 *
 * @author 김종민
 * @since 2014.03.05
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */

@Service("bbsService")
public class BbsServiceImpl extends AbstractServiceImpl implements
        BbsService {

    @Resource(name="bbsDAO")
    private BbsDAO bbsDAO;

	/**
	 * BBS을 등록한다.
	 * @param vo - 등록할 정보가 담긴 BbsVO
	 * @return 등록 결과
	 * @exception Exception
	 */
    public String insertBbs(BbsVO vo) throws Exception {
    	log.debug(vo.toString());
    	
    	/** ID Generation Service */
    	//TODO 해당 테이블 속성에 따라 ID 제너레이션 서비스 사용
    	//String id = egovIdGnrService.getNextStringId();
    	//vo.setId(id);
    	log.debug(vo.toString());
    		
    	String result = (bbsDAO.insertBbs(vo)).toString();
    	//TODO 해당 테이블 정보에 맞게 수정    	
        return result;
    }

    /**
	 * BBS을 수정한다.
	 * @param vo - 수정할 정보가 담긴 BbsVO
	 * @return void형
	 * @exception Exception
	 */
    public void updateBbs(BbsVO vo) throws Exception {
        bbsDAO.updateBbs(vo);
    }

    /**
	 * BBS을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 BbsVO
	 * @return void형 
	 * @exception Exception
	 */
    public void deleteBbs(BbsVO vo) throws Exception {
        bbsDAO.deleteBbs(vo);
    }

    /**
	 * BBS을 조회한다.
	 * @param vo - 조회할 정보가 담긴 BbsVO
	 * @return 조회한 BBS
	 * @exception Exception
	 */
    public BbsVO selectBbs(BbsVO vo) throws Exception {
        BbsVO resultVO = bbsDAO.selectBbs(vo);
        if (resultVO == null)
            throw processException("info.nodata.msg");
        return resultVO;
    }

    /**
	 * BBS 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS 목록
	 * @exception Exception
	 */
    public List<BbsVO> selectBbsList(BbsDefaultVO searchVO) throws Exception {
    	return bbsDAO.selectBbsList(searchVO);
    }

    /**
	 * BBS첨부파일 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS 목록
	 * @exception Exception
	 */
    public List<String> selectBbsFile(BbsVO vo) throws Exception {
    	return bbsDAO.selectBbsFile(vo);
    }
    public List<Map<String, String>> selectBbsFileList(BbsVO vo) throws Exception {
    	return bbsDAO.selectBbsFileList(vo);
    }
    /**
	 * BBS첨부파일을 조회한다.
	 * @param vo - 조회할 정보가 담긴 BbsVO
	 * @return 조회한 BBS
	 * @exception Exception
	 */
    public BbsVO selectBbsFileDown(BbsVO vo) throws Exception {
        BbsVO resultVO = bbsDAO.selectBbsFileDown(vo);
        if (resultVO == null)
            throw processException("info.nodata.msg");
        return resultVO;
    }
    
    /**
	 * BBS첨부파일을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 BbsVO
	 * @return void형 
	 * @exception Exception
	 */
    public void deleteFile(BbsVO vo) throws Exception {
        bbsDAO.deleteFile(vo);
    }
    
    /**
	 * BBS 총 갯수를 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS 총 갯수
	 * @exception
	 */
    public int selectBbsListTotCnt(BbsDefaultVO searchVO) {
		return bbsDAO.selectBbsListTotCnt(searchVO);
	}

	public void updateViewCnt(BbsVO vo) throws Exception {
		bbsDAO.updateViewCnt(vo);
	}
}