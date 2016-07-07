/**
 * 
 * @Class Name  : CommonServiceDAO.java
 * @Description : CommonServiceDAO Class
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 11. 12.  김종민		최초생성
 * 
 * @author 김종민
 * @since 2013. 11. 12.
 * @version 1.0
 * @see
 * 
 * 공통 업무 Data Access Object
 *
 */
package org.uiscloud.com.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.com.service.CommonCodeMasterVO;
import org.uiscloud.com.service.LglCdVO;

/**
 * @author NPIMSKJM
 *
 */
@Repository("commonServiceDAO")
public class CommonServiceDAO {
    /**
     * 
     * 공통 코드 조회 기능
     *
     * @param
     * 		String codeType 코드대분류 명칭
     * @return 
     * 		List<CmmnDetailCodeVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
	
	public List<CommonCodeMasterVO> selectCommonCodeMasterByCodeType(final String codeType) throws Exception {
		return sqlSession.selectList("common.selectCommonCodeMasterByCodeType", codeType);
	}
	
    /**
     * 
     * 공통 코드 조회 기능
     *
     * @param
     * 		String codeType 코드대분류 명칭
     * 		String superCode 상위코드
     * @return 
     * 		List<CmmnDetailCodeVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	public List<CommonCodeMasterVO> selectCommonCodeMasterByCodeTypeAndSuperCode(final CommonCodeMasterVO commonCodeMasterVO) throws Exception {
		return sqlSession.selectList("common.selectCommonCodeMasterByCodeTypeAndSuperCode", commonCodeMasterVO);
	}

	/**
	 * 
	 * 주소 - 시도 검색
	 *
	 * @param
	 * 		LglCdVO lglCdVO 
	 * @return 
	 * 		List<LglCdVO>
	 * @throws Exception
	 * @see SK BIES 시스템
	 *
	 */	
	public List<LglCdVO> selectSido() {
		return sqlSession.selectList("common.selectSido", null);
	}

    /**
     * 
     * 주소 - 시군구 검색
     *
     * @param
     * 		String lglCd 시도 LglCd
     * @return 
     * 		List<LglCdVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	public List<LglCdVO> selectSggBySidoLglCd(String ctprvnCd) {
		return sqlSession.selectList("common.selectSggBySidoLglCd", ctprvnCd);
	}

	public List<LglCdVO> selectEmdlBySggLglCd(String sigCd) {
		return sqlSession.selectList("common.selectEmdlBySggLglCd", sigCd);
	}	
}