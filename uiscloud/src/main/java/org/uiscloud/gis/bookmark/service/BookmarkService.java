package org.uiscloud.gis.bookmark.service;

import java.util.List;
import java.util.Map;
import java.util.Properties;

public interface BookmarkService {
	public List<Map<String, String>> search(BookmarkSearchVO vo);

	public Integer searchTotalCount(BookmarkSearchVO vo);

	public List<Map<String, String>> regionList();

	public List<Map<String, Object>> selectBookmarkDetail(String headOffice, String creator, String title);

	public Integer findLowerTcpInfo(String pnu, String jibunBon, String jibunBu);

	public int insertBookmark(Properties prop) throws Exception;

	public int insertBookmarkHigher(Properties prop) throws Exception;

	public int insertBookmarkLowerByPNU(Properties prop) throws Exception;

	public int insertBookmarkLowerByGPS(Properties prop) throws Exception;

	public List<Map<String, Object>> getHighers(String headOffice, String creator, String title) throws Exception;

	public List<Map<String, Object>> getLowers(int bookmarkHigherRankOfficeId) throws Exception;

}
