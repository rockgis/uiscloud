package org.uiscloud.gis.bbs.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import org.uiscloud.gis.bbs.service.BbsDefaultVO;
import org.uiscloud.gis.bbs.service.BbsVO;
import org.uiscloud.gis.bbsTail.service.impl.BbsTailDAO;

/**
 * @Class Name : BbsDAO.java
 * @Description : Bbs DAO Class
 * @Modification Information
 *
 * @author 김종민
 * @since 2014.03.05
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */

@Repository("bbsDAO")
public class BbsDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
	
	@Resource(name="bbsTailDAO")
	private BbsTailDAO bbsTailDAO;
	
	/**
	 * BBS을 등록한다.
	 * @param vo - 등록할 정보가 담긴 BbsVO
	 * @return 등록 결과
	 * @exception Exception
	 */
	public Integer insertBbs(BbsVO vo) throws Exception {
    	sqlSession.insert("bbsDAO.insertBbs_S", vo);
    	Integer result = vo.getBbsId();
    	List<BbsVO> list= new ArrayList<BbsVO>();
    	
    	if(vo.getFileNames().size() > 0){
	    	for(int i= 0;i < vo.getFileNames().size();i++){
	    		BbsVO filevo = new BbsVO();
	    		filevo.setFileName(vo.getFileNames().get(i));
	    		filevo.setNewFileName(vo.getNewFileNames().get(i));
	    		filevo.setBbsId(result);
	    		list.add(filevo);
	    	}
	    	sqlSession.insert("bbsDAO.insertBbsFile", list);
    	}
        return result;
    }

    /**
	 * BBS을 수정한다.
	 * @param vo - 수정할 정보가 담긴 BbsVO
	 * @return void형
	 * @exception Exception
	 */
    public int updateBbs(BbsVO vo) throws Exception {
    	
    	List<BbsVO> list= new ArrayList<BbsVO>();
    	Integer result = sqlSession.update("bbsDAO.updateBbs_S", vo);
    	if(vo.getFileNames().size() > 0){
	    	for(int i= 0;i < vo.getFileNames().size();i++){
	    		BbsVO filevo = new BbsVO();
	    		filevo.setFileName(vo.getFileNames().get(i));
	    		filevo.setNewFileName(vo.getNewFileNames().get(i));
	    		filevo.setBbsId(vo.getBbsId());
	    		list.add(filevo);
	    	}
	    	sqlSession.insert("bbsDAO.insertBbsFile", list);
    	}
        return result;
    }

    /**
	 * BBS을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 BbsVO
	 * @return void형 
	 * @exception Exception
	 */
    public int deleteBbs(BbsVO vo) throws Exception {
        return sqlSession.delete("bbsDAO.deleteBbs_S", vo);
    }

    /**
	 * BBS을 조회한다.
	 * @param vo - 조회할 정보가 담긴 BbsVO
	 * @return 조회한 BBS
	 * @exception Exception
	 */
    public BbsVO selectBbs(BbsVO vo) throws Exception {
    	vo = (BbsVO)sqlSession.selectOne("bbsDAO.selectBbs_S", vo);
    	vo.setBbsTailVOs(bbsTailDAO.selectBbsTailListByBbsVO(vo));
    	
        return vo;
    }

    /**
	 * BBS 목록을 조회한다.
	 * @param searchMap - 조회할 정보가 담긴 Map
	 * @return BBS 목록
	 * @exception Exception
	 */
    public List<BbsVO> selectBbsList(BbsDefaultVO searchVO) throws Exception {
        return sqlSession.selectList("bbsDAO.selectBbsList_D", searchVO);
    }

    /**
	 * BBS첨부파일 목록을 조회한다.
	 * @param searchMap - 조회할 정보가 담긴 Map
	 * @return BBS 목록
	 * @exception Exception
	 */
    public List<String> selectBbsFile(BbsDefaultVO searchVO) throws Exception {
        return sqlSession.selectList("bbsDAO.selectBbsFile_D", searchVO);
    }
    public List<Map<String,String>> selectBbsFileList(BbsVO vo) throws Exception {
        return sqlSession.selectList("bbsDAO.selectBbsFile_D", vo);
    }
    
    /**
	 * BBS첨부파일을 조회한다.
	 * @param vo - 조회할 정보가 담긴 BbsVO
	 * @return 조회한 BBS
	 * @exception Exception
	 */
    public BbsVO selectBbsFileDown(BbsVO vo) throws Exception {
    	vo = (BbsVO)sqlSession.selectOne("bbsDAO.selectBbsFile_D", vo);
    	vo.setBbsTailVOs(bbsTailDAO.selectBbsTailListByBbsVO(vo));
    	
        return vo;
    }
    
    /**
	 * BBS첨부파일을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 BbsVO
	 * @return void형 
	 * @exception Exception
	 */
    public int deleteFile(BbsVO vo) throws Exception {
        return sqlSession.delete("bbsDAO.deleteFile", vo);
    }
    
    /**
	 * BBS 총 갯수를 조회한다.
	 * @param searchMap - 조회할 정보가 담긴 Map
	 * @return BBS 총 갯수
	 * @exception
	 */
    public int selectBbsListTotCnt(BbsDefaultVO searchVO) {
        return (Integer)sqlSession.selectOne("bbsDAO.selectBbsListTotCnt_S", searchVO);
    }
	
	public void updateViewCnt(BbsVO vo) throws Exception {
		sqlSession.update("bbsDAO.updateViewCnt", vo);		
	}
}
