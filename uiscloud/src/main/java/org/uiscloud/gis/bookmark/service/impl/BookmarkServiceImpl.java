package org.uiscloud.gis.bookmark.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.bookmark.service.BookmarkSearchVO;
import org.uiscloud.gis.bookmark.service.BookmarkService;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

@Service("bookmarkService")
public class BookmarkServiceImpl extends AbstractServiceImpl implements BookmarkService {

	@Resource(name = "bookmarkDAO")
	private BookmarkDAO bookmarkDAO;

	@Override
	public List<Map<String, String>> search(BookmarkSearchVO searchVO) {
		List<Map<String, String>> result = bookmarkDAO.search(searchVO);

		return result;
	}

	@Override
	public Integer searchTotalCount(BookmarkSearchVO searchVO) {
		Integer total = 0;

		total = bookmarkDAO.searchTotalCount(searchVO);

		searchVO.setTotalCount(total);

		return total;
	}

	@Override
	public List<Map<String, String>> regionList() {
		List<Map<String, String>> result = bookmarkDAO.regionList();

		Map<String, String> nothing = new HashMap<String, String>();

		nothing.put("regionCode", "");
		nothing.put("regionName", "전체");

		result.add(0, nothing);

		return result;
	}

	@Override
	public List<Map<String, Object>> selectBookmarkDetail(String headOffice, String creator, String title) {
		List<Map<String, Object>> result = bookmarkDAO.selectBookmarkDetail(headOffice, creator, title);

		return result;
	}

	@Override
	public Integer findLowerTcpInfo(String pnu, String jibunBon, String jibunBu) {
		return bookmarkDAO.findLowerTcpInfo(pnu, jibunBon, jibunBu);
	}

	@Override
	public int insertBookmark(Properties prop) throws Exception {
		return bookmarkDAO.insertBookmark(prop);
	}

	@Override
	public int insertBookmarkHigher(Properties prop) throws Exception {
		return bookmarkDAO.insertBookmarkHigher(prop);
	}

	@Override
	public int insertBookmarkLowerByPNU(Properties prop) throws Exception {
		return bookmarkDAO.insertBookmarkLowerByPNU(prop);
	}

	@Override
	public int insertBookmarkLowerByGPS(Properties prop) throws Exception {
		return bookmarkDAO.insertBookmarkLowerByGPS(prop);
	}

	@Override
	public List<Map<String, Object>> getHighers(String headOffice, String creator, String title) throws Exception {
		return bookmarkDAO.getHighers(headOffice, creator, title);
	}

	@Override
	public List<Map<String, Object>> getLowers(int bookmarkHigherRankOfficeId) throws Exception {
		return bookmarkDAO.getLowers(bookmarkHigherRankOfficeId);
	}
}