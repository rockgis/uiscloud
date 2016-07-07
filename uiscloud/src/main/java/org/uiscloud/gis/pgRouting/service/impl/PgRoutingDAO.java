package org.uiscloud.gis.pgRouting.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;
import org.uiscloud.gis.pgRouting.service.NetworkVO;
import org.uiscloud.gis.pgRouting.service.StandardInformationVO;

/**
 * @author NPIMSKJM
 *
 */
@Repository("pgRoutingDAO")
public class PgRoutingDAO {
	public List<NetworkVO> selectAllNetwork() {
		List<NetworkVO> result = new ArrayList<NetworkVO>();
		
		result.add(new NetworkVO("1", "WWW"));
		result.add(new NetworkVO("2", "FTP"));
		result.add(new NetworkVO("3", "SMTP"));
		result.add(new NetworkVO("4", "POP"));
		result.add(new NetworkVO("5", "SSH"));
		result.add(new NetworkVO("6", "TELNET"));
		result.add(new NetworkVO("7", "SFTP"));
		
		return result;
	}
	
	public List<StandardInformationVO> selectAllStandardInformation() {
		List<StandardInformationVO> result = new ArrayList<StandardInformationVO>();
		
		result.add(new StandardInformationVO("1", "서부원점"));
		result.add(new StandardInformationVO("2", "중부원점"));
		result.add(new StandardInformationVO("3", "동부원점"));
		result.add(new StandardInformationVO("4", "동해원점"));
		
		return result;
	}	
}