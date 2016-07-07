package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapInfo.service.BuildingService;

@Service("buildingService")
public class BuildingServiceImpl implements BuildingService {
	/** buildingServiceDAO */
    @Resource(name="buildingDAO")
    private BuildingDAO buildingDAO;

	public BuildingDAO getBuildingDAO() {
		return buildingDAO;
	}

	public void setBuildingDAO(BuildingDAO buildingDAO) {
		this.buildingDAO = buildingDAO;
	}
	
	@Override
	public List<Map<String, String>> selectSido() {
		return buildingDAO.selectSido();
	}

	@Override
	public List<Map<String, String>> selectSggBySidoPnu(String pnu) {
		return buildingDAO.selectSggBySidoPnu(pnu);
	}

	@Override
	public List<Map<String, String>> selectEmdlBySggPnu(String pnu) {
		return buildingDAO.selectEmdlBySggPnu(pnu);
	}

	@Override
	public List<Map<String, String>> selectBuilding(Map<String, Object> searchConditionMap) {
		return buildingDAO.selectBuilding(searchConditionMap);
	}
}