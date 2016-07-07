package org.uiscloud.gis.member.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.bbs.service.BbsDefaultVO;
import org.uiscloud.gis.member.service.MemberSearchVO;
import org.uiscloud.gis.member.service.MemberService;
import org.uiscloud.gis.member.service.MemberVO;
import org.uiscloud.gis.member.service.impl.MemberDAO;

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

@Service("memberService")
public class MemberServiceImpl extends AbstractServiceImpl implements
    
    MemberService {

    @Resource(name="MemberDAO")
    private MemberDAO MemberDAO;

	/**
	 * Member을 등록한다.
	 * @param vo - 등록할 정보가 담긴 MemberVO
	 * @return 등록 결과
	 * @exception Exception
	 */
    public String insertMember(MemberVO vo) throws Exception {
    	log.debug(vo.toString());
    	
    	/** ID Generation Service */
    	//TODO 해당 테이블 속성에 따라 ID 제너레이션 서비스 사용
    	//String id = egovIdGnrService.getNextStringId();
    	//vo.setId(id);
    	log.debug(vo.toString());
    		
    	MemberDAO.insertMember(vo);
    	//TODO 해당 테이블 정보에 맞게 수정    	
        return null;
    }

    /**
	 * Member을 수정한다.
	 * @param vo - 수정할 정보가 담긴 MemberVO
	 * @return void형
	 * @exception Exception
	 */
    public void updateMember(MemberVO vo) throws Exception {
        MemberDAO.updateMember(vo);
    }

    /**
	 * Member을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 MemberVO
	 * @return void형 
	 * @exception Exception
	 */
    public void deleteMember(MemberVO vo) throws Exception {
        MemberDAO.deleteMember(vo);
    }

    /**
	 * Member을 조회한다.
	 * @param vo - 조회할 정보가 담긴 MemberVO
	 * @return 조회한 Member
	 * @exception Exception
	 */
    public MemberVO selectMember(MemberVO vo) throws Exception {
        MemberVO resultVO = MemberDAO.selectMember(vo);
        if (resultVO == null)
            throw processException("info.nodata.msg");
        return resultVO;
    }

    /**
	 * Member 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return Member 목록
	 * @exception Exception
	 */
    public List<MemberVO> selectMemberList(MemberSearchVO memberSearchVO) throws Exception {
    	return MemberDAO.selectMemberList(memberSearchVO);
    }
    
    public int selectMemberi(MemberVO vo) throws Exception {
		return MemberDAO.checkMembrer(vo);
	}

    /**
	 * Member 총 갯수를 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return Member 총 갯수
	 * @exception
	 */
    
    public int selectMemberListTotCnt() {
		return MemberDAO.selectMemberListTotCnt( );
	}
    
    
    /**
     * @throws Exception 
	 * member 를 확인한다.
	 * @param MemberVO - 조회할 정보가 담긴 VO
	 * @return cntID
	 * @exception
	 */
    
    public int selectMemberPassWd(MemberVO vo) throws Exception {
		return MemberDAO.selectMemberPasswd(vo);
	}
    
    /**
     * @throws Exception 
	 * member 를 확인한다.
	 * @param MemberVO - 조회할 정보가 담긴 VO
	 * @return cntID
	 * @exception
	 */
    
    public int  selectMemberCntId(MemberVO vo) throws Exception {
		return MemberDAO.selectMemberCntId(vo);
	}
   
    
    /**
	 * Member 패스워드를 초기화 한다. 
	 * @param MemberVO - 조회할 정보가 담긴 VO
	 * @return 
	 * @exception
	 */
    
    public void updateMember_passS(MemberVO vo)  throws Exception {
		 MemberDAO.updateMember_passS(vo);
	}

}
