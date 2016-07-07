package org.uiscloud.bbs.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.View;

import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;

import org.uiscloud.bbs.service.BbsDefaultVO;
import org.uiscloud.bbs.service.BbsService;
import org.uiscloud.bbs.service.BbsVO;
import org.uiscloud.bbsTail.service.BbsTailVO;

/**
 * @Class Name : BbsController.java
 * @Description : Bbs Controller class
 * @Modification Information
 * 
 * @author 김종민
 * @since 2014.03.05
 * @version 1.0
 * @see Copyright (C) All right reserved.
 */

@Controller
@SessionAttributes(types = BbsVO.class)
public class BbsController {
	@Resource(name = "bbsService")
	private BbsService bbsService;

	@Resource(name = "propertiesService")
	private EgovPropertyService propertiesService; 
	
	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;
	
	@RequestMapping(value = "/gis/bbs/Bbs")
	public String Bbs(@ModelAttribute("searchVO") BbsDefaultVO searchVO,
			Model model, HttpServletRequest request) throws Exception {

		return "/gis/bbs/Bbs";
	}
	
	/**
	 * BBS 목록을 조회한다. (pageing)
	 * 
	 * @param searchVO
	 *            - 조회할 정보가 담긴 BbsDefaultVO
	 * @return "/gis/bbs/BbsList"
	 * @exception Exception
	 */
	@RequestMapping(value = "/gis/bbs/BbsList")
	public String selectBbsList(
			@ModelAttribute("searchVO") BbsDefaultVO searchVO, Model model,
			HttpServletRequest request) throws Exception {

		/** EgovPropertyService.sample */
		searchVO.setPageUnit(10);
		searchVO.setPageSize(10);

		/** pageing */
		PaginationInfo paginationInfo = new PaginationInfo();
		paginationInfo.setCurrentPageNo(searchVO.getPageIndex());
		paginationInfo.setRecordCountPerPage(searchVO.getPageUnit());
		paginationInfo.setPageSize(searchVO.getPageSize());

		searchVO.setFirstIndex(paginationInfo.getFirstRecordIndex());
		searchVO.setLastIndex(paginationInfo.getLastRecordIndex());
		searchVO.setRecordCountPerPage(paginationInfo.getRecordCountPerPage());

		List<BbsVO> bbsList = bbsService.selectBbsList(searchVO);
		model.addAttribute("resultList", bbsList);

		int totCnt = bbsService.selectBbsListTotCnt(searchVO);
		paginationInfo.setTotalRecordCount(totCnt);
		model.addAttribute("paginationInfo", paginationInfo);
		model.addAttribute("bbsVO", new BbsVO());

		return "/gis/bbs/BbsList";
	}
	/**
	 * BBS 목록을 조회한다. (pageing)
	 * 
	 * @param searchVO
	 *            - 조회할 정보가 담긴 BbsDefaultVO
	 * @return "/gis/bbs/BbsList"
	 * @exception Exception
	 */
	@RequestMapping(value = "/gis/bbs/NoticeList")
	public String selectNoticeList(
			@ModelAttribute("searchVO") BbsDefaultVO searchVO, Model model,
			HttpServletRequest request) throws Exception {

		/** EgovPropertyService.sample */
		searchVO.setPageUnit(10);
		searchVO.setPageSize(10);

		/** pageing */
		PaginationInfo paginationInfo = new PaginationInfo();
		paginationInfo.setCurrentPageNo(searchVO.getPageIndex());
		paginationInfo.setRecordCountPerPage(searchVO.getPageUnit());
		paginationInfo.setPageSize(searchVO.getPageSize());

		searchVO.setFirstIndex(paginationInfo.getFirstRecordIndex());
		searchVO.setLastIndex(paginationInfo.getLastRecordIndex());
		searchVO.setRecordCountPerPage(paginationInfo.getRecordCountPerPage());
		searchVO.setBbsType("N");

		List<BbsVO> bbsList = bbsService.selectBbsList(searchVO);
		model.addAttribute("resultList", bbsList);

		int totCnt = bbsService.selectBbsListTotCnt(searchVO);
		paginationInfo.setTotalRecordCount(totCnt);
		model.addAttribute("paginationInfo", paginationInfo);
		model.addAttribute("noticeVO", new BbsVO());

		return "/gis/bbs/NoticeList";
	}
	
	/**
	 * BBS 목록을 조회한다. (none-page)
	 * 
	 * @param searchVO
	 *            - 조회할 정보가 담긴 BbsDefaultVO
	 * @return "/gis/bbs/BbsList"
	 * @exception Exception
	 */
	@RequestMapping(value = "/gis/bbs/NoticeListMain")
	public View selectNoticeListMain(
			@ModelAttribute("searchVO") BbsDefaultVO searchVO, Model model) throws Exception {

		/** EgovPropertyService.sample */
		Date newDate = new Date();
		SimpleDateFormat std = new SimpleDateFormat("yyyy-MM-dd");
		
		java.sql.Date endDate = java.sql.Date.valueOf(std.format(newDate).toString());
		java.sql.Date startDate = java.sql.Date.valueOf(std.format(newDate).toString());
		searchVO.setBbsType("N");
		searchVO.setEndDate(endDate);
		searchVO.setStartDate(startDate);

		List<BbsVO> bbsList = bbsService.selectBbsList(searchVO);
		model.addAttribute("resultList", bbsList);

		model.addAttribute("noticeVO", new BbsVO());

		return jacksonJsonView;
	}
	
	@RequestMapping(value = "/gis/bbs/addBbsView")
	public String addBbsView(@ModelAttribute("searchVO") BbsDefaultVO searchVO,
			Model model, HttpServletRequest request) throws Exception {

		model.addAttribute("bbsVO", new BbsVO());
		return "/gis/bbs/BbsRegister";
	}

	@RequestMapping(value = "/gis/bbs/addBbs", method = RequestMethod.POST)
	public String addBbs(BbsVO bbsVO,
			@ModelAttribute("searchVO") BbsDefaultVO searchVO,
			BindingResult bindingResult, ModelMap model, SessionStatus status,
			HttpSession session) throws Exception {
		
		List<MultipartFile> files = bbsVO.getFiles();
		List<String> fileNames = new ArrayList<String>();
		List<String> newFileNames = new ArrayList<String>();
		String newFileName;
        if(null != files && files.size() > 0) {
            for (MultipartFile multipartFile : files) {
 
                String fileName = multipartFile.getOriginalFilename();
                String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
                fileNames.add(fileName);
                
                //Handle file content - multipartFile.getInputStream()
                try {             
        			String uploadPath = propertiesService.getString("gis.bbs.repository.path");
                	//String uploadPath = propertiesService.getString("attach.gis.repository.path");
        			
                    File file = new File(uploadPath);
            		if (!file.exists() || file.isFile()) {
            			file.mkdirs();
            		}
            		newFileName =  "gis" + (new Date()).getTime()+"."+fileExt;
            		newFileNames.add(newFileName);
            		
            		File file2 = new File(uploadPath + newFileName);
            		multipartFile.transferTo(file2);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        bbsVO.setFileNames(fileNames);
        bbsVO.setNewFileNames(newFileNames);

        try {
        	bbsService.insertBbs(bbsVO);
        } catch (SQLException e) {
            e.printStackTrace();
        }
		

		status.setComplete();

		return "redirect:/gis/bbs/Bbs";
	}
	@RequestMapping(value = "/gis/bbs/fileList")
	public View selectfileList(BbsVO bbsVO,Model model, @RequestParam Integer bbsId) throws Exception {
		bbsVO.setBbsId(bbsId);
		List<String> fileList = bbsService.selectBbsFile(bbsVO);		

		model.addAttribute("result", fileList);

		return jacksonJsonView;
	}
	/**
	 * BBS 첨부파일 다운로드
	 * 
	 * @param searchVO
	 *            - 조회할 정보가 담긴 BbsDefaultVO
	 * @return "/gis/bbs/BbsList"
	 * @exception Exception
	 */
	@RequestMapping(value = "/gis/bbs/downloadfile")
	public void downloadFile(BbsVO bbsVO,
			HttpServletResponse response,
			BindingResult bindingResult, ModelMap model, SessionStatus status,HttpSession session) throws Exception{

		BbsVO vo = bbsService.selectBbsFileDown(bbsVO);
		String orgname = vo.getFileName();
        String newname = vo.getNewFileName();
 
        response.setContentType("application/octet-stream");
       
        orgname = new String(orgname.getBytes("UTF-8"), "iso-8859-1");
       
        // 파일명 지정
        response.setHeader("Content-Disposition", "attachment; filename=\""+orgname+"\"");
       
        OutputStream os = response.getOutputStream();

        String uploadPath = propertiesService.getString("gis.bbs.repository.path");
        FileInputStream fis = new FileInputStream(uploadPath + File.separator + newname);
        int n = 0;
        byte[] b = new byte[512];
        while((n = fis.read(b)) != -1 ) {
            os.write(b, 0, n);
        }
        fis.close();
        os.close();
	}
	
	@RequestMapping(value = "/gis/bbs/deletefile")
	public String deleteFile(BbsVO bbsVO,@ModelAttribute("searchVO") BbsDefaultVO searchVO,
			SessionStatus status, Model model, HttpServletRequest request)
			throws Exception {
		BbsVO oldVO = bbsService.selectBbs(bbsVO);
		List<String> fileList = new ArrayList<String>();

		if ((oldVO.getPwd()).equals(bbsVO.getPwd())) {
			try {             
				String uploadPath = propertiesService.getString("gis.bbs.repository.path");
				BbsVO fileVO = bbsService.selectBbsFileDown(bbsVO);
				File file = new File(uploadPath + fileVO.getNewFileName());
	    		file.delete();
	    		bbsService.deleteFile(bbsVO);
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
			bbsVO.setFileSeq(null);
			fileList = bbsService.selectBbsFile(bbsVO);
			model.addAttribute("fileVO", fileList);
			return "/gis/bbs/BbsUpdate";
		}
		else {
			bbsVO.setFileSeq(null);
			fileList = bbsService.selectBbsFile(bbsVO);
			model.addAttribute(selectBbs(oldVO, searchVO));
			model.addAttribute("fileVO", fileList);
			model.addAttribute("errMsg", "비밀번호가 일치하지 않습니다.");
			return "/gis/bbs/BbsUpdate";
		}
	}
	
	@RequestMapping(value = "/gis/bbs/updateBbsView")
	public String updateBbsView(BbsVO bbsVO, @RequestParam("bbsId") int bbsId,
			@ModelAttribute("searchVO") BbsDefaultVO searchVO, Model model,
			HttpServletRequest request, HttpSession session) throws Exception {
		BbsVO oldVO = bbsService.selectBbs(bbsVO);
		List<String> fileList = bbsService.selectBbsFile(bbsVO);
		
		String errMsg = request.getParameter("errMsg");

		// 댓글 관련 작업 후인 경우 처리
		if (errMsg != null && !"".equals(errMsg)) {
			if (errMsg.equals("bbsTailUpdateSuccess"))
				model.addAttribute("errMsg", "댓글이 정상적으로 수정되었습니다.");

			if (errMsg.equals("bbsTailUpdateFail"))
				model.addAttribute("errMsg", "비밀번호가 일치하지 않습니다.");

			if (errMsg.equals("bbsTailDeleteSucess"))
				model.addAttribute("errMsg", "댓글이 정상적으로 삭제되었습니다.");

			if (errMsg.equals("bbsTailDeleteFail"))
				model.addAttribute("errMsg", "비밀번호가 일치하지 않습니다.");
		}

		bbsService.updateViewCnt(oldVO);
		model.addAttribute("searchVO", searchVO);
		model.addAttribute("bbsVO", oldVO);
		model.addAttribute("fileVO", fileList);

		// 댓글 등록시에 공인인증 처리를 위해 세션에 미리 저장
		session.setAttribute("bbsTailVO", new BbsTailVO());

		return "/gis/bbs/BbsUpdate";
	}

	@RequestMapping(value = "/gis/bbs/selectBbs")
	public @ModelAttribute("bbsVO")
	BbsVO selectBbs(BbsVO bbsVO,
			@ModelAttribute("searchVO") BbsDefaultVO searchVO) throws Exception {
		
		return bbsService.selectBbs(bbsVO);
	}

	@RequestMapping(value = "/gis/bbs/updateBbs")
	public String updateBbs(BbsVO bbsVO,
			@ModelAttribute("searchVO") BbsDefaultVO searchVO,
			SessionStatus status, Model model, HttpServletRequest request)
			throws Exception {
		BbsVO oldVO = bbsService.selectBbs(bbsVO);

		// 작성자인 경우 수정 가능
		if ((oldVO.getPwd()).equals(bbsVO.getPwd())) {
			List<MultipartFile> files = bbsVO.getFiles();
			List<String> fileNames = new ArrayList<String>();
			List<String> newFileNames = new ArrayList<String>();
			String newFileName;
	        if(null != files && files.size() > 0) {
	            for (MultipartFile multipartFile : files) {
	 
	                String fileName = multipartFile.getOriginalFilename();
	                String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
	                fileNames.add(fileName);
	                
	                //Handle file content - multipartFile.getInputStream()
	                try {             
	        			String uploadPath = propertiesService.getString("gis.bbs.repository.path");
	        			
	                    File file = new File(uploadPath);
	            		if (!file.exists() || file.isFile()) {
	            			file.mkdirs();
	            		}
	            		newFileName =  "gis" + (new Date()).getTime()+"."+fileExt;
	            		newFileNames.add(newFileName);
	            		
	            		File file2 = new File(uploadPath + newFileName);
	            		multipartFile.transferTo(file2);
	                } catch (IOException e) {
	                    e.printStackTrace();
	                }
	            }
	        }
	        bbsVO.setFileNames(fileNames);
	        bbsVO.setNewFileNames(newFileNames);
			bbsService.updateBbs(bbsVO);
			status.setComplete();

//			return "redirect:/gis/bbs/Bbs?searchKeyword="
//					+ URLEncoder.encode(searchVO.getSearchKeyword(), "UTF-8") + "&searchCondition="
//					+ searchVO.getSearchCondition() + "&pageIndex="
//					+ searchVO.getPageIndex();
			return "redirect:/gis/bbs/Bbs";
		} else {
			model.addAttribute(selectBbs(oldVO, searchVO));
			model.addAttribute("errMsg", "비밀번호가 일치하지 않습니다.");
			return "/gis/bbs/BbsUpdate";
		}
	}

	@RequestMapping(value = "/gis/bbs/deleteBbs")
	public String deleteBbs(BbsVO bbsVO,
			@ModelAttribute("searchVO") BbsDefaultVO searchVO,
			SessionStatus status, Model model, HttpServletRequest request)
			throws Exception {
		BbsVO oldVO = bbsService.selectBbs(bbsVO);
		List<String> fileList = bbsService.selectBbsFile(bbsVO);

		if ((oldVO.getPwd()).equals(bbsVO.getPwd())) {
			bbsService.deleteBbs(bbsVO);
			String uploadPath = propertiesService.getString("gis.bbs.repository.path");
			File file = new File(uploadPath + File.separator + oldVO.getNewFileName());
				if(file.exists()){
		            file.delete();
		        }
			status.setComplete();
			return "redirect:/gis/bbs/Bbs";
//			return "redirect:/gis/bbs/BbsList?searchKeyword="
//					+ URLEncoder.encode(searchVO.getSearchKeyword(), "UTF-8") + "&searchCondition="
//					+ searchVO.getSearchCondition() + "&pageIndex="
//					+ searchVO.getPageIndex();
		} else {
			model.addAttribute(selectBbs(oldVO, searchVO));
			model.addAttribute("fileVO", fileList);
			model.addAttribute("errMsg", "비밀번호가 일치하지 않습니다.");
			return "/gis/bbs/BbsUpdate";
		}
	}
}