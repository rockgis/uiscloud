/**
 * 
 * @Class Name  : CommonServiceImpl.java
 * @Description : CommonServiceImpl Class
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 11. 13.  김종민		최초생성
 * 
 * @author 김종민
 * @since 2013. 11. 13.
 * @version 1.0
 * @see
 * 
 * 공통 업무 Service Implement
 *
 */
package org.uiscloud.com.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.com.service.CommonCodeMasterVO;
import org.uiscloud.com.service.CommonService;
import org.uiscloud.com.service.LglCdVO;

@Service("commonService")
public class CommonServiceImpl implements CommonService {
	/** commonServiceDAO */
    @Resource(name="commonServiceDAO")
    private CommonServiceDAO commonServiceDAO;

	public CommonServiceDAO getCommonDAO() {
		return commonServiceDAO;
	}

	public void setCommonDAO(CommonServiceDAO commonCodeMasterDAO) {
		this.commonServiceDAO = commonCodeMasterDAO;
	}

	@Override
	public List<CommonCodeMasterVO> selectCommonCodeMasterByCodeType(String codeType) throws Exception {
		return commonServiceDAO.selectCommonCodeMasterByCodeType(codeType);
	}

	@Override
	public List<CommonCodeMasterVO> selectCommonCodeMasterByCodeTypeAndSuperCode(
			CommonCodeMasterVO commonCodeMasterVO) throws Exception {
		return commonServiceDAO.selectCommonCodeMasterByCodeTypeAndSuperCode(commonCodeMasterVO);
	}

	@Override
	public List<LglCdVO> selectSido() {
		return commonServiceDAO.selectSido();
	}

	@Override
	public List<LglCdVO> selectSggBySidoLglCd(String ctprvnCd) {
		return commonServiceDAO.selectSggBySidoLglCd(ctprvnCd);
	}

	@Override
	public List<LglCdVO> selectEmdlBySggLglCd(String sigCd) {
		return commonServiceDAO.selectEmdlBySggLglCd(sigCd);
	}
}