package org.uiscloud.gis.mapsv.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapsv.service.SpatialInfoService;
import org.uiscloud.gis.mapsv.service.SpatialInfoVO;
import org.uiscloud.gis.mapsv.service.SpatialMetaInfoVO;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

@Service("spatialInfoService")
public class SpatialInfoServiceImpl extends AbstractServiceImpl implements SpatialInfoService {

	@Resource(name="spatialInfoDAO")
	private SpatialInfoDAO spatialInfoDAO;
	
	@Override
	public Map<String, Map<String, Object>> selectSpatialInfo(SpatialInfoVO spatialInfoVO) {
		Map<String, Map<String, Object>> result = new HashMap<String, Map<String, Object>>();
		
		String targetTableNameList = spatialInfoVO.getTargetTableNameList();
		String targetTableKorNameList = spatialInfoVO.getTargetTableKorNameList();
		String[] tList = targetTableNameList.split(";");
		String[] tKorList = targetTableKorNameList.split(";");
		
		for(int i=0 ; i<tList.length ; i++) {
			String tableName = tList[i];
			
			Map<String, Object> tableObj = new HashMap<String, Object>();
			tableObj.put("korName", tKorList[i]);
			
			spatialInfoVO.setTableName(tableName);
			
			
			if(tableName.equalsIgnoreCase("TL_SPBD_BULD_11000")) {
				tableObj.put("datas", spatialInfoDAO.selectTlSpbdBuld11000(spatialInfoVO));
			}
			else if(tableName.equalsIgnoreCase("GOTC_CA")) {
				tableObj.put("datas", spatialInfoDAO.selectGotcCa(spatialInfoVO));
			}
			else if(tableName.equalsIgnoreCase("GOTC_CD")) {
				tableObj.put("datas", spatialInfoDAO.selectGotcCd(spatialInfoVO));
			}
			else if(tableName.equalsIgnoreCase("GOTC_JP")) {
				tableObj.put("datas", spatialInfoDAO.selectGotcJp(spatialInfoVO));	
			}
			else if(tableName.equalsIgnoreCase("GOTC_MH")) {
				tableObj.put("datas", spatialInfoDAO.selectGotcMh(spatialInfoVO));
			}
			else if(tableName.equalsIgnoreCase("GOTC_TPO")) {
				tableObj.put("datas", spatialInfoDAO.selectGotcTpo(spatialInfoVO));
			}
			else if(tableName.equalsIgnoreCase("GNET_RING_MAP")) {
				tableObj.put("datas", spatialInfoDAO.selectSktRingMap(spatialInfoVO));
			}
			else if(tableName.equalsIgnoreCase("ETE_LINK")) {
				tableObj.put("datas", spatialInfoDAO.selectEteLink(spatialInfoVO));
			}
			
			result.put(tableName, tableObj);
		}
		
		return result;
	}

	@Override
	public List<Map<String, Object>> selectSpatialDetailInfo(String params) {
		JsonParser jsonParser = new JsonParser();
		JsonArray jsonArray = (JsonArray)jsonParser.parse(params);
		
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		for(int i=0, len=jsonArray.size(); i < len; i++) {
			SpatialInfoVO spatialInfoVO = new SpatialInfoVO();
			JsonObject tableObj = (JsonObject) jsonArray.get(i);
			String tableName = tableObj.get("tableName").getAsString();
			spatialInfoVO.setTableName(tableName);
			JsonArray gidArray = (JsonArray)tableObj.get("gids");
			List<Integer> gids = new ArrayList<Integer>();
			for(int j=0, jLen=gidArray.size(); j < jLen; j++) {
				gids.add(gidArray.get(j).getAsInt());
			}
			spatialInfoVO.setGids(gids);
			
			Map<String, Object> tableMap = new HashMap<String, Object>();
			tableMap.put("tableName", tableName);
			tableMap.put("columns", spatialInfoDAO.selectSpatialMetaColumn(tableName));
			if(spatialInfoVO.getGid() != null || spatialInfoVO.getGids() != null) {
				if(tableName.equalsIgnoreCase("GOTC_CA")) {
					tableMap.put("datas", spatialInfoDAO.selectGotcCa(spatialInfoVO));
				}
				else if(tableName.equalsIgnoreCase("GOTC_CD")) {
					tableMap.put("datas", spatialInfoDAO.selectGotcCd(spatialInfoVO));
				}
				else if(tableName.equalsIgnoreCase("GOTC_JP")) {
					tableMap.put("datas", spatialInfoDAO.selectGotcJp(spatialInfoVO));	
				}
				else if(tableName.equalsIgnoreCase("GOTC_MH")) {
					tableMap.put("datas", spatialInfoDAO.selectGotcMh(spatialInfoVO));
				}
				else if(tableName.equalsIgnoreCase("GOTC_TPO")) {
					tableMap.put("datas", spatialInfoDAO.selectGotcTpo(spatialInfoVO));
				}	
				else if(tableName.equalsIgnoreCase("ETE_LINK")) {
					tableMap.put("datas", spatialInfoDAO.selectEteLinkDetail(spatialInfoVO));
				}
			}
			result.add(tableMap);
			
		}
		return result;
	}

	@Override
	public List<SpatialMetaInfoVO> selectSpatialMetaTable(SpatialMetaInfoVO spatialMetaInfoVO) {
		return spatialInfoDAO.selectSpatialMetaTable(spatialMetaInfoVO);
	}
	
}
