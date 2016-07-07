package org.uiscloud.bbsTail.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import org.uiscloud.bbs.service.BbsVO;
import org.uiscloud.bbsTail.service.BbsTailVO;
import org.uiscloud.bbsTail.service.BbsTailDefaultVO;

/**
 * @Class Name : BbsTailDAO.java
 * @Description : BbsTail DAO Class
 * @Modification Information
 *
 * @author 김종민
 * @since 2014.03.05
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */

@Repository("bbsTailDAO")
public class BbsTailDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;

	/**
	 * BBS_TAIL을 등록한다.
	 * @param vo - 등록할 정보가 담긴 BbsTailVO
	 * @return 등록 결과
	 * @exception Exception
	 */
    public Integer insertBbsTail(BbsTailVO vo) throws Exception {
        return sqlSession.insert("bbsTailDAO.insertBbsTail_S", vo);
    }

    /**
	 * BBS_TAIL을 수정한다.
	 * @param vo - 수정할 정보가 담긴 BbsTailVO
	 * @return void형
	 * @exception Exception
	 */
    public void updateBbsTail(BbsTailVO vo) throws Exception {
    	sqlSession.update("bbsTailDAO.updateBbsTail_S", vo);
    }

    /**
	 * BBS_TAIL을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 BbsTailVO
	 * @return void형 
	 * @exception Exception
	 */
    public void deleteBbsTail(BbsTailVO vo) throws Exception {
    	sqlSession.delete("bbsTailDAO.deleteBbsTail_S", vo);
    }

    /**
	 * BBS_TAIL을 조회한다.
	 * @param vo - 조회할 정보가 담긴 BbsTailVO
	 * @return 조회한 BBS_TAIL
	 * @exception Exception
	 */
    public BbsTailVO selectBbsTail(BbsTailVO vo) throws Exception {
        return (BbsTailVO)sqlSession.selectOne("bbsTailDAO.selectBbsTail_S", vo);
    }


    /**
	 * BBS_TAIL 목록을 조회한다.
	 * @param searchMap - 조회할 정보가 담긴 Map
	 * @return BBS_TAIL 목록
	 * @exception Exception
	 */
    public List<BbsTailVO> selectBbsTailListByBbsVO(BbsVO vo) throws Exception {
        return sqlSession.selectList("bbsTailDAO.selectBbsTailList_By_BBSID", vo.getBbsId());
    }
    
    /**
	 * BBS_TAIL 목록을 조회한다.
	 * @param searchMap - 조회할 정보가 담긴 Map
	 * @return BBS_TAIL 목록
	 * @exception Exception
	 */
    public List<BbsTailVO> selectBbsTailList(BbsTailDefaultVO searchVO) throws Exception {
        return sqlSession.selectList("bbsTailDAO.selectBbsTailList_D", searchVO);
    }

    /**
	 * BBS_TAIL 총 갯수를 조회한다.
	 * @param searchMap - 조회할 정보가 담긴 Map
	 * @return BBS_TAIL 총 갯수
	 * @exception
	 */
    public int selectBbsTailListTotCnt(BbsTailDefaultVO searchVO) {
        return (Integer)sqlSession.selectOne("bbsTailDAO.selectBbsTailListTotCnt_S", searchVO);
    }
}