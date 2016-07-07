package org.uiscloud.admin.service;

import java.util.List;
import java.util.Map;

import org.uiscloud.gis.mapInfo.service.FacilityVO;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapInfo.service.SpbdBuldVO;
import org.uiscloud.gis.mapInfo.service.SpbdEntrcVO;
import org.uiscloud.gis.mapInfo.service.SpotCntcVO;
import org.uiscloud.gis.mapsv.service.GotcCaVO;
import org.uiscloud.gis.mapsv.service.GotcCdVO;
import org.uiscloud.gis.mapsv.service.GotcJpVO;
import org.uiscloud.gis.mapsv.service.GotcMhVO;
import org.uiscloud.gis.mapsv.service.GotcTpoVO;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;
import org.uiscloud.gis.mapsv.service.SpatialMetaInfoVO;

public interface UserAdminService {
	public int insert(UserAdminVO userAdminVO);

	public int update(UserAdminVO userAdminVO);

	public int delete(UserAdminVO userAdminVO);

	List<UserAdminVO> select(UserAdminVO userAdminVO);

}