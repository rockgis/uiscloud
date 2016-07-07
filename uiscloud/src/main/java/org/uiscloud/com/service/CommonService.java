/**
 * 
 * @Class Name  : CommonService.java
 * @Description  : CommonService Class
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
 * 공통 업무 Service Interface
 *
 */
package org.uiscloud.com.service;

import java.util.List;

public interface CommonService {
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
	public List<CommonCodeMasterVO> selectCommonCodeMasterByCodeType(String codeType) throws Exception;
	
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
	public List<CommonCodeMasterVO> selectCommonCodeMasterByCodeTypeAndSuperCode(CommonCodeMasterVO commonCodeMasterVO) throws Exception;

	/**
	 * 
	 * 주소 - 시도 검색
	 *
	 * @param
	 * 		String category : 시도 - sido, 시군구 - sgg, 읍면동/리 - emdri
	 * 		String lglCd 
	 * @return 
	 * 		List<LglCdVO>
	 * @throws Exception
	 * @see SK BIES 시스템
	 *
	 */	
	public List<LglCdVO> selectSido();

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
	public List<LglCdVO> selectSggBySidoLglCd(String lglCd);

	public List<LglCdVO> selectEmdlBySggLglCd(String lglCd);
}