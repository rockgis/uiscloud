/**
 * 
 * @Class Name  : MemberController.java
 * @Description : MemberController Class
 * @Modification Information  
 * @
 * @   수정일          수정자        수정내용
 * @ -------------  ----------  ---------------------------
 * @  2014. 07. 22.	이래훈 		최초생성
 * 
 * @author 이래훈     
 * @since 2014. 07. 22.
 * @version 1.0
 * @see
 * 
 *
 */

package org.uiscloud.member.web;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.WebAttributes;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.servlet.View;
import org.uiscloud.com.service.JsonConverterService;
import org.uiscloud.member.service.MemberSearchVO;
import org.uiscloud.member.service.MemberService;
import org.uiscloud.member.service.MemberVO;
import org.uiscloud.member.service.ShaEncoder;

@Controller
public class MemberController {
	
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());
	
	@Resource(name = "memberService")
	private MemberService memberService;
	
	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	/** jsonConverterService */
	@Resource(name = "jsonConverterService")
	private JsonConverterService jsonConverterService;
	 
	@Resource(name="shaEncoder")
	 private ShaEncoder encoder;
	
	
	public View getJacksonJsonView() {
		return jacksonJsonView;
	}

	public void setJacksonJsonView(View jacksonJsonView) {
		this.jacksonJsonView = jacksonJsonView;
	}
	
	
	/**
	 * 연계 테스트를 하기 위한 테스트 페이지
	 * @return 테스트 페이지 jsp 주소
	 */
	@RequestMapping(value = "/gis/login")
	public String login(
		 Model model,
			HttpServletRequest request) throws Exception {


		return "/account/login";
	}
	
	@RequestMapping(value = "/gis/fail")
	public String sFail(
		 Model model,
			HttpServletRequest request) throws Exception {


		return "/account/sFail";
	}
	
	@RequestMapping("/gis/denied")
	public String denied(Model model, Authentication auth, HttpServletRequest req){
	
		AccessDeniedException ade = (AccessDeniedException) req.getAttribute(WebAttributes.ACCESS_DENIED_403);
	 
	log.info("ex : {}",ade);
	 
	 model.addAttribute("auth", auth);
	 model.addAttribute("errMsg", ade);
	 model.addAttribute("error", true);
	 
	 //return "/account/denied";
	 return "/account/login";
	} 
	
	
	
	@RequestMapping(value = "/gis/join")
	public String Join(
		 Model model,
			HttpServletRequest request) throws Exception {


		return "/account/signup";
	}
	
	@RequestMapping(value = "/gis/addMember")
	public String addMember(MemberVO MemberVO, ModelMap model, SessionStatus status2,
			HttpServletRequest request) throws Exception {
		
		/*
		 * 
		 * 1. 총괄관리자 : 전권한(회원관리포함) 915
		   2. 지역관리자 : 회원관리 제외한 나머지 권한 916
           3. 지역사용자 : 투자비정보/회원관리 제외한 나머지 권한 917
           4. BP사용자 : 투자비정보/Coverage Map/Interactive-UI/회원관리 제외한 나머지 권한 920
		 * 
		 * 
		 */
		
		
		String dbpw = encoder.encoding(MemberVO.getPwd());
		
		MemberVO.setPwd(dbpw);
		
		int userRole = MemberVO.getUserRole();
		
		if(userRole == 915 ){
			MemberVO.setRoleName("ROLE_ADMIN");
		}else if(userRole == 916 || userRole == 922){
			MemberVO.setRoleName("ROLE_MM");
		}else if(userRole == 920 || userRole == 921){
			MemberVO.setRoleName("ROLE_BP");
		}else if(userRole == 923 ){
			MemberVO.setRoleName("ROLE_BM");
		}else{
			MemberVO.setRoleName("ROLE_USER");
		}

		memberService.insertMember(MemberVO);
		status2.setComplete();
		
		model.addAttribute("mesage", "회원 정보가 정상적으로 입력 되었습니다. ");

		return "/account/Susses";
	}
	
	@RequestMapping("/gis/passwdcheck")
	public String passwdcheck(Model model, HttpServletRequest req){
		
	 return "/account/passwdcheck";
	}
	
	@RequestMapping("/gis/idcheck")
	public String idcheck(Model model, MemberVO MemberVO, HttpServletRequest req,SessionStatus status2) throws Exception{
		
		int cntId =  -1;
		
		int iCnt = memberService.selectMemberPassWd(MemberVO);
		
		if(iCnt > 0){
			cntId = memberService.selectMemberCntId(MemberVO);
		}
		
	   model.addAttribute("cntId", cntId);
		
	 return "/account/passwdcheck";
	}
	
	
	@RequestMapping("/gis/selectMemberCheck")
	public View selectMemberCheck(Model model, MemberVO MemberVO, HttpServletRequest req,SessionStatus status2) throws Exception{
		
		String checkid="000";
		
		System.out.println(MemberVO.getUserId());
		
		//MemberVO.setUserId("rockgis");
		
		int checkMembrer = memberService.selectMemberi(MemberVO);
		
		
		if(checkMembrer > 0){
			checkid="130";
        }
		
		model.addAttribute("result", checkid);

		return jacksonJsonView;

	}
	
	
	@RequestMapping("/gis/passwdreset")
	public String passwdreset(Model model, MemberVO MemberVO, HttpServletRequest req,SessionStatus status2) throws Exception{
	
        String dbpw = encoder.encoding(MemberVO.getPwd());
		
		MemberVO.setPwd(dbpw);

		memberService.updateMember_passS(MemberVO);
		
		status2.setComplete();
		
		model.addAttribute("mesage", "패스워드가 정상적으로 변경 되었습니다. ");

		return "/account/Susses";
	}
	
	
	@RequestMapping(value = "/gis/memberList")
	public String memberList(@ModelAttribute MemberSearchVO memberSearchVO, final Model model, final HttpServletRequest request) {		
		
		return "/account/memberlist";	
	}
	
	@RequestMapping(value = "/gis/memberListJson")
	public View memberListJson (@ModelAttribute MemberSearchVO memberSearchVO, Model model,HttpServletRequest request) throws Exception {
		
        Integer total = 0;
		
		if(memberSearchVO.getTotalCount() == null) {
			total = memberService.selectMemberListTotCnt();
		} else {
			total = memberSearchVO.getTotalCount();
		}
		
		
	    memberSearchVO.setTotalCount(total);
		
		List<MemberVO> result = memberService.selectMemberList(memberSearchVO);
		
		model.addAttribute("total", total);
		model.addAttribute("rows", result);
		
		return jacksonJsonView;
	}
	
	
	
	
	@RequestMapping(value = "/gis/memberUpdate")
	public View memberUpdate(MemberVO memberVO, Model model) throws Exception {

		memberService.updateMember(memberVO);
		
		MemberVO result = memberService.selectMember(memberVO);
		
		model.addAttribute("row", result);
		
		return jacksonJsonView;
		
	}
	
	
	@RequestMapping(value = "/gis/memberDel")
	public View memberDel(@ModelAttribute MemberSearchVO memberSearchVO, MemberVO MemberVO, @RequestParam("id") int cntId,final Model model,
			   HttpServletRequest request) throws Exception {	
		
		MemberVO.setCntId(cntId);
		
		memberService.deleteMember(MemberVO);
		
        Integer total = 0;
		
		if(memberSearchVO.getTotalCount() == null) {
			total = memberService.selectMemberListTotCnt();
		} else {
			total = memberSearchVO.getTotalCount();
		}
		
		
	    memberSearchVO.setTotalCount(total);
		
		List<MemberVO> result = memberService.selectMemberList(memberSearchVO);
		
		model.addAttribute("total", total);
		model.addAttribute("rows", result);
		
		return jacksonJsonView;
		
	}

}
