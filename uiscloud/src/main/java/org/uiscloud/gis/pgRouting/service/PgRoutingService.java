package org.uiscloud.gis.pgRouting.service;

import java.util.List;

public interface PgRoutingService {

	public List<NetworkVO>  selectAllNetwork();

	public List<StandardInformationVO> selectAllStandardInformation();
}