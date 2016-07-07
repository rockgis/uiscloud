package org.uiscloud.gis.bookmark.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.bookmark.service.BookmarkSearchVO;

@Repository("bookmarkDAO")
public class BookmarkDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;

	public List<Map<String, String>> search(BookmarkSearchVO searchVO) {
		return sqlSession.selectList("bookmarkDAO.search", searchVO);
	}

	public Integer searchTotalCount(BookmarkSearchVO searchVO) {
		return (Integer) sqlSession.selectOne("bookmarkDAO.searchTotalCount", searchVO);
	}

	public List<Map<String, String>> regionList() {
		return sqlSession.selectList("bookmarkDAO.regionList");
	}

	public List<Map<String, Object>> selectBookmarkDetail(String headOffice, String creator, String title) {
		Map<String, String> param = new HashMap<String, String>();

		param.put("headOffice", headOffice);
		param.put("creator", creator);
		param.put("title", title);

		return sqlSession.selectList("bookmarkDAO.searchDetail", param);
	}

	public Integer findLowerTcpInfo(String pnu, String jibunBon, String jibunBu) {
		Map<String, String> param = new HashMap<String, String>();

		param.put("pnu", pnu);
		param.put("jibunBon", jibunBon);
		param.put("jibunBu", jibunBu);

		return sqlSession.selectOne("bookmarkDAO.findLowerTcpInfoByPNU", param);
	}

	public int insertBookmark(Properties prop) {
		sqlSession.delete("bookmarkDAO.deleteBookmark", prop);
		return sqlSession.insert("bookmarkDAO.insertBookmark", prop);
	}

	public int insertBookmarkHigher(Properties prop) {
		return sqlSession.insert("bookmarkDAO.insertBookmarkHigher", prop);
	}

	public int insertBookmarkLowerByPNU(Properties prop) {
		return sqlSession.insert("bookmarkDAO.insertBookmarkLowerByPNU", prop);
	}

	public int insertBookmarkLowerByGPS(Properties prop) {
		return sqlSession.insert("bookmarkDAO.insertBookmarkLowerByGPS", prop);
	}

	public List<Map<String, Object>> getHighers(String headOffice, String creator, String title) {
		Map<String, String> param = new HashMap<String, String>();

		param.put("headOffice", headOffice);
		param.put("creator", creator);
		param.put("title", title);

		return sqlSession.selectList("bookmarkDAO.getHighers", param);
	}

	public List<Map<String, Object>> getLowers(int bookmarkHigherRankOfficeId) {
		return sqlSession.selectList("bookmarkDAO.getLowers", bookmarkHigherRankOfficeId);
	}
}