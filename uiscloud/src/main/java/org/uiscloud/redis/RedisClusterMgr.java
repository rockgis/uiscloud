package org.uiscloud.redis;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

import org.apache.log4j.Logger;

import org.uiscloud.spark.model.redis.GridCoordinateDao;
import org.uiscloud.spark.model.redis.GridGeometryInfoDao;
import org.uiscloud.spark.model.websocket.RequestMapInfo;
import org.uiscloud.spark.util.GeoGridConverter;

import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.exceptions.JedisConnectionException;

public class RedisClusterMgr {

	private static RedisClusterMgr instance;
	private static String prefixKey = "lvl_%s_%s_%s";
	
	private static final Logger logger = Logger.getLogger(RedisClusterMgr.class);
	
	private RedisClusterMgr() {
	
	}

	public static RedisClusterMgr getInstance() {
		if(instance == null) {
			instance = new RedisClusterMgr();
		}
		return instance;
	}
	
	private JedisCluster connect() {
		HostAndPort hAndP = new HostAndPort("192.168.0.115", 6379);
		Set<HostAndPort> nodesSet = new HashSet<HostAndPort>();
		nodesSet.add(hAndP);
		
		JedisCluster jCluster = new JedisCluster(nodesSet);
		return jCluster;
	}
	public ArrayList<GridGeometryInfoDao> getInfoFromRequest(RequestMapInfo rMap) throws JedisConnectionException {

		JedisCluster jCluster = this.connect();
		
		GeoGridConverter ggCon = new GeoGridConverter();

		ArrayList<GridCoordinateDao> gridPoints = ggCon.getGeoGridLocation(rMap.getLevel(), rMap.getStartPoint(),rMap.getEndPoint());
		
		
		ArrayList<GridGeometryInfoDao> geometryArr = new ArrayList<GridGeometryInfoDao>();

		ArrayList<String> keys = new ArrayList<String>();

		
		for (GridCoordinateDao cDao : gridPoints) {
			String key = this.createKey(rMap.getLevel(), cDao);
			
			GridGeometryInfoDao ggif = new GridGeometryInfoDao();
			keys.add(key);
			ggif.setCoordinates(cDao);
			
			String value = jCluster.hget(key, "count");

			if (value != null) {
				try {
					ggif.setCount(Double.parseDouble(value));
					geometryArr.add(ggif);
				} catch (NumberFormatException e) {
				}
			}
			
		}

		try {
			jCluster.close();
		} catch (IOException e) {
			logger.warn(e.getMessage());
		}

		return geometryArr;

	}

	public ArrayList<GridGeometryInfoDao> getGridCount(ArrayList<GridCoordinateDao> keys, int level) {
		JedisCluster jCluster = this.connect();
		ArrayList<GridGeometryInfoDao> geometryArr = new ArrayList<GridGeometryInfoDao>();
		for (GridCoordinateDao cDao : keys) {
			String key = this.createKey(level, cDao);
			
			GridGeometryInfoDao ggif = new GridGeometryInfoDao();
			ggif.setCoordinates(cDao);
			String value = jCluster.hget(key, "count");
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
		try {
			jCluster.close();
		} catch (IOException e) {
			logger.warn(e.getMessage());
		}
		return geometryArr;
	}
	
	
	public long getReceive() {
		JedisCluster jCluster = this.connect();
		
		String vale = jCluster.hget("INPUTS","total");
		try {
			jCluster.close();
		} catch (IOException e) {
			logger.warn(e.getMessage());
		}
		
		return Long.parseLong(vale);
	}
	
	public long getReceiveRun() {
		JedisCluster jCluster = this.connect();
		String value = jCluster.hget("OUTPUTS","total");
		
		try {
			jCluster.close();
		} catch (IOException e) {
			logger.warn(e.getMessage());
		}
		
		return Long.parseLong(value);
	}
	
	private String createKey(int level, GridCoordinateDao cDao) {
		return String.format(prefixKey, level, cDao.getLon(), cDao.getLat());
	}
	
}
