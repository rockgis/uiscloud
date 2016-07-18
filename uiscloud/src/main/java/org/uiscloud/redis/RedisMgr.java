package org.uiscloud.redis;

import java.util.ArrayList;

import org.uiscloud.spark.model.redis.GridCoordinateDao;
import org.uiscloud.spark.model.redis.GridGeometryInfoDao;
import org.uiscloud.spark.model.websocket.RequestMapInfo;
import org.uiscloud.spark.util.GeoGridConverter;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.exceptions.JedisConnectionException;

public class RedisMgr {

	private static String prefixKey = "lvl_%s_%s_%s";

	private Jedis jedis;
	private String url;
	private int port;

	
	private RedisMgr() {

	}

	public static RedisMgr getInstance() {
		return new RedisMgr();
	}

	public void connect() {
		if (this.url == null || this.url.equals("")) {
			return;
		}

		if (this.port <= 0) {
			this.port = 6379;
		}

		if (this.jedis != null && this.jedis.isConnected()) {
			this.jedis.disconnect();
		}

		this.jedis = new Jedis(this.url, this.port);
		this.jedis.connect();
	}


	
	
	public ArrayList<GridGeometryInfoDao> getInfoFromRequest(RequestMapInfo rMap) throws JedisConnectionException {

		GeoGridConverter ggCon = new GeoGridConverter();

		ArrayList<GridCoordinateDao> gridPoints = ggCon.getGeoGridLocation(rMap.getLevel(), rMap.getStartPoint(),rMap.getEndPoint());
		
		
		ArrayList<GridGeometryInfoDao> geometryArr = new ArrayList<GridGeometryInfoDao>();

		ArrayList<String> keys = new ArrayList<String>();

		
		for (GridCoordinateDao cDao : gridPoints) {
			String key = this.createKey(rMap.getLevel(), cDao);
			
			GridGeometryInfoDao ggif = new GridGeometryInfoDao();
			keys.add(key);
			ggif.setCoordinates(cDao);
			
			String value = this.jedis.hget(key, "count");

			if (value != null) {
				try {
					ggif.setCount(Double.parseDouble(value));
					geometryArr.add(ggif);
				} catch (NumberFormatException e) {
				}
			}
			
		}
		

		this.jedis.close();

		return geometryArr;

	}

	public ArrayList<GridGeometryInfoDao> getGridCount(ArrayList<GridCoordinateDao> keys, int level) {
		ArrayList<GridGeometryInfoDao> geometryArr = new ArrayList<GridGeometryInfoDao>();
		for (GridCoordinateDao cDao : keys) {
			String key = this.createKey(level, cDao);
			
			GridGeometryInfoDao ggif = new GridGeometryInfoDao();
			ggif.setCoordinates(cDao);
			String value = this.jedis.hget(key, "count");
			if (value != null) {
				try {
					ggif.setCount(Double.parseDouble(value));
					geometryArr.add(ggif);
				} catch (NumberFormatException e) {
				}
			} else {
				ggif.setCount(0);
			}
			
		}
		this.jedis.close();
		return geometryArr;
	}
	
	
	public long getReceive() {
		
		String vale = this.jedis.hget("INPUTS","total");
		this.jedis.close();
		return Long.parseLong(vale);
	}
	
	public long getReceiveRun() {
		
		String value = this.jedis.hget("OUTPUTS","total");
		this.jedis.close();
		return Long.parseLong(value);
				
	}
	
	public void connect(String url, int port) {
		this.url = url;
		this.port = port;
		this.connect();
	}

	public void connect(String url) {
		this.url = url;
		this.connect();
	}

	public boolean isConnected() {
		return (this.jedis != null) && this.jedis.isConnected();
	}

	public void disconnect() {
		this.jedis.disconnect();
		this.url = null;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	private String createKey(int level, GridCoordinateDao cDao) {
		return String.format(prefixKey, level, cDao.getLon(), cDao.getLat());
	}

}
