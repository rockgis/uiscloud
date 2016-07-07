package org.uiscloud.gis.member.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.bbs.service.BbsDefaultVO;
import org.uiscloud.gis.member.service.MemberSearchVO;
import org.uiscloud.gis.member.service.MemberVO;


/**
 * @Class Name : MemberDAO.java
 * @Description : Member DAO Class
 * @Modification Information
 *
 * @author rockgis
 * @since 2014.08.08
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */

@Repository("MemberDAO")
public class MemberDAO {
	
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
	
	/**
	 * Member을 등록한다.
	 * @param vo - 등록할 정보가 담긴 MemberVO
	 * @return 등록 결과
	 * @exception Exception
	 */
    public Integer insertMember(MemberVO vo) throws Exception {
        return sqlSession.insert("MemberDAO.insertMember_S", vo);
    }

    /**
	 * Member을 수정한다.
	 * @param vo - 수정할 정보가 담긴 MemberVO
	 * @return void형
	 * @exception Exception
	 */
    public int updateMember(MemberVO vo) throws Exception {
        return sqlSession.update("MemberDAO.updateMember_S", vo);
    }

    /**
	 * Member을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 MemberVO
	 * @return void형 
	 * @exception Exception
	 */
    public int deleteMember(MemberVO vo) throws Exception {
        return sqlSession.delete("MemberDAO.deleteMember_S", vo);
    }

    /**
	 * Member을 조회한다.
	 * @param vo - 조회할 정보가 담긴 MemberVO
	 * @return 조회한 Member
	 * @exception Exception
	 */
    public MemberVO selectMember(MemberVO vo) throws Exception {
    	vo = (MemberVO)sqlSession.selectOne("MemberDAO.selectMember_S", vo);

        return vo;
    }
    
    public int checkMembrer(MemberVO vo) throws Exception {

        return sqlSession.selectOne("MemberDAO.selectMember_i", vo);
    }
    

    /**
	 * Member 목록을 조회한다.
	 * @param searchMap - 조회할 정보가 담긴 Map
	 * @return Member 목록
	 * @exception Exception
	 */
    public List<MemberVO> selectMemberList(MemberSearchVO memberSearchVO) throws Exception {
        return sqlSession.selectList("MemberDAO.selectMemberList_D", memberSearchVO);
    }

    /**
	 * Member 총 갯수를 조회한다.
	 * @param searchMap - 조회할 정보가 담긴 Map
	 * @return Member 총 갯수
	 * @exception
	 */
    public int selectMemberListTotCnt() {
        return (Integer)sqlSession.selectOne("MemberDAO.selectMemberListTotCnt_S");
    }
	
	public void updateViewCnt(MemberVO vo) throws Exception {
		sqlSession.update("MemberDAO.updateViewCnt", vo);		
	}
	
	
   /**
	 * Member을 확인한다.
	 * @param vo - 수정할 정보가 담긴 MemberVO
	 * @return void형
	 * @exception Exception
	 */
	public int selectMemberPasswd(MemberVO vo) throws Exception {
	  return (Integer)sqlSession.selectOne("MemberDAO.selectMemberPasswd", vo);
	}
	
	 /**
		 * Member을 확인한다.
		 * @param vo - 수정할 정보가 담긴 MemberVO
		 * @return void형
		 * @exception Exception
		 */
		public int selectMemberCntId(MemberVO vo) throws Exception {
		  return (Integer)sqlSession.selectOne("MemberDAO.selectMemberCntId", vo);
		}
	
	/**
	 * 패스워드를 초기화 한다. 
	 * @param vo - 수정할 정보가 담긴 MemberVO
	 * @return void형
	 * @exception Exception
	 */
	public int updateMember_passS(MemberVO vo) throws Exception {
	  return sqlSession.update("MemberDAO.updateMember_passS", vo);
	}

}

