package org.uiscloud.gis.interactiveUi.service;

import java.util.List;

import org.uiscloud.gis.mapInfo.service.MapInfoCaSearchVO;

public interface InteractiveService {

	public List<InteractiveVO> searchNodes(MapInfoCaSearchVO vo);
	
	public List<InteractiveVO> searchLinks(MapInfoCaSearchVO vo);
}