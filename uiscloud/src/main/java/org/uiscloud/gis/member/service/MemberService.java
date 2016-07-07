package org.uiscloud.gis.member.service;

/**
 * @Class Name : MemberService.java
 * @Description : Member Business class
 * @Modification Information
 *
 * @author ROCKGIS
 * @since 2014.08.08
 * @version 1.0
 * @see
 *  
 *  Copyright (C)  All right reserved.
 */

import java.util.List;

import org.uiscloud.gis.member.service.MemberSearchVO;
import org.uiscloud.gis.member.service.MemberVO;

public interface MemberService {
	
	
	/**
	 * Member을 등록한다.
	 * @param vo - 등록할 정보가 담긴 MemberVO
	 * @return 등록 결과
	 * @exception Exception
	 */
    String insertMember(MemberVO vo) throws Exception;
    
    /**
	 * Member을 수정한다.
	 * @param vo - 수정할 정보가 담긴 MemberVO
	 * @return void형
	 * @exception Exception
	 */
    void updateMember(MemberVO vo) throws Exception;
    
    /**
	 * Member을 삭제한다.
	 * @param vo - 삭제할 정보가 담긴 MemberVO
	 * @return void형 
	 * @exception Exception
	 */
    void deleteMember(MemberVO vo) throws Exception;
    
    /**
	 * Member을 조회한다.
	 * @param vo - 조회할 정보가 담긴 MemberVO
	 * @return 조회한 Member
	 * @exception Exception
	 */
    MemberVO selectMember(MemberVO vo) throws Exception;
    int selectMemberi(MemberVO vo) throws Exception;
    
    /**
	 * Member 목록을 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return Member 목록
	 * @exception Exception
	 */
    List<MemberVO> selectMemberList(MemberSearchVO vo) throws Exception;
    
    /**
	 * BBS 총 갯수를 조회한다.
	 * @param searchVO - 조회할 정보가 담긴 VO
	 * @return BBS 총 갯수
	 * @exception
	 */
    int selectMemberListTotCnt();
    
    /**
     * @throws Exception 
	 * member 를 확인한다.
	 * @param MemberVO - 조회할 정보가 담긴 VO
	 * @return cntID
	 * @exception
	 */
    
     int selectMemberPassWd(MemberVO vo) throws Exception;
     

     int  selectMemberCntId(MemberVO vo) throws Exception;
    
    /**
	 * Member 패스워드를 초기화 한다. 
	 * @param MemberVO - 조회할 정보가 담긴 VO
	 * @return 
	 * @exception
	 */
    
    void updateMember_passS(MemberVO vo)  throws Exception ;
    
}
