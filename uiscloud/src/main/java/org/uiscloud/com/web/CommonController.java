/**
 * 
 * @Class Name  : CommonController.java
 * @Description : CommonController Class
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
 * 공통 업무 Spring @MVC Controller
 *
 */
package org.uiscloud.com.web;

import java.util.LinkedList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;
import org.uiscloud.com.service.CommonCodeMasterVO;
import org.uiscloud.com.service.CommonService;
import org.uiscloud.com.service.LglCdVO;

@Controller
public class CommonController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/** commonService */
	@Resource(name = "commonService")
	private CommonService commonService;

	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	public CommonService getCommonService() {
		return commonService;
	}

	public void setCommonService(CommonService commonService) {
		this.commonService = commonService;
	}

	public View getJacksonJsonView() {
		return jacksonJsonView;
	}

	public void setJacksonJsonView(View jacksonJsonView) {
		this.jacksonJsonView = jacksonJsonView;
	}

    /**
     * 
     * 공통 코드 조회 기능
     *
     * @param
     * 		String codeType 코드대분류 명칭
     * @return 
     * 		List<CommonCodeMasterVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	@RequestMapping(value = "/gis/common/selectCommonCodeMasterByCodeType")
	public View selectCommonCodeMasterByCodeType(Model model, @RequestParam String codeType) throws Exception {
		List<CommonCodeMasterVO> list = commonService.selectCommonCodeMasterByCodeType(codeType);

		model.addAttribute("result", list);

		return jacksonJsonView;
	}	

    /**
     * 
     * 공통 코드 조회 기능
     *
     * @param
     * 		String codeType 코드대분류 명칭
     * 		String superCode 상위코드
     * @return 
     * 		List<CommonCodeMasterVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	@RequestMapping(value = "/gis/common/selectCommonCodeMasterByCodeTypeAndSuperCode")
	public View selectCommonCodeMasterByCodeTypeAndSuperCode(Model model, @ModelAttribute CommonCodeMasterVO commonCodeMasterVO) throws Exception {
		List<CommonCodeMasterVO> list = commonService.selectCommonCodeMasterByCodeTypeAndSuperCode(commonCodeMasterVO);

		model.addAttribute("result", list);

		return jacksonJsonView;
	}
	

    /**
     * 
     * 주소 - 시도 검색
     *
     * @param
     * 		
     * @return 
     * 		List<LglCdVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	@RequestMapping(value = "/gis/address/selectSido")
	public View selectSido(Model model) throws Exception {
		List<LglCdVO> list = new LinkedList<LglCdVO>();
		list.add(new LglCdVO());
		
		list.addAll(commonService.selectSido());
		
		model.addAttribute("result", list);

		return jacksonJsonView;
	}
	

    /**
     * 
     * 주소 - 시군구 검색
     *
     * @param
     * 		String lglCd 시도 LglCd 2 자리
     * @return 
     * 		List<LglCdVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	@RequestMapping(value = "/gis/address/selectSggBySidoLglCd")
	public View selectSggBySidoLglCd(Model model, @RequestParam String ctprvnCd) throws Exception {
		List<LglCdVO> list = new LinkedList<LglCdVO>();
		list.add(new LglCdVO());
		
		list.addAll(commonService.selectSggBySidoLglCd(ctprvnCd));

		model.addAttribute("result", list);

		return jacksonJsonView;
	}
	

    /**
     * 
     * 주소 - 읍면동리 검색
     *
     * @param
     * 		String lglCd 시군구 LglCd 5 자리
     * @return 
     * 		List<LglCdVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	@RequestMapping(value = "/gis/address/selectEmdlBySggLglCd")
	public View selectEmdlBySggLglCd(Model model, @RequestParam String sigCd) throws Exception {
		List<LglCdVO> list = new LinkedList<LglCdVO>();
		list.add(new LglCdVO());
		
		list.addAll(commonService.selectEmdlBySggLglCd(sigCd));

		
		model.addAttribute("result", list);

		return jacksonJsonView;
	}
}
