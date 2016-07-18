package org.uiscloud.websocket;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.concurrent.Callable;
import java.util.concurrent.LinkedBlockingQueue;

import javax.websocket.Session;

import org.uiscloud.redis.RedisClusterMgr;
import org.uiscloud.redis.RedisMgr;

import org.uiscloud.spark.model.redis.GridCoordinateDao;
import org.uiscloud.spark.model.redis.GridGeometryInfoDao;
import org.uiscloud.spark.model.websocket.GeoWebDto;
import org.uiscloud.spark.model.websocket.PropertyDto;
import org.uiscloud.spark.model.websocket.WebFeature;
import org.uiscloud.spark.model.websocket.WebGeometry;

public class ReadInfoElement implements Runnable,Callable<GeoWebDto> {

	private RedisClusterMgr redis;
	private ArrayList<GridCoordinateDao> keys;
	private int level;
	private String id;

	private Session session;

	LinkedBlockingQueue<GeoWebDto> responseQueue;

	private int idx = -1;
	private int totalGridCount = -1;
	
	
	public ReadInfoElement(ArrayList<GridCoordinateDao> keys, int level, String id, RedisClusterMgr redis, Session session) {
		super();
		this.redis = RedisClusterMgr.getInstance();
		this.keys = keys;
		this.level = level;
		this.id = id;

		this.session = session;

	}

	public ReadInfoElement(ArrayList<GridCoordinateDao> keys, int level, String id, RedisClusterMgr redis,
			LinkedBlockingQueue<GeoWebDto> responseQueue) {
		super();
		this.redis = RedisClusterMgr.getInstance();
		this.keys = keys;
		this.level = level;
		this.id = id;

		this.responseQueue = responseQueue;
	}

	public ReadInfoElement(ArrayList<GridCoordinateDao> keys, int level, String id, RedisClusterMgr redis, Session session,
			int idx) {
		super();
		this.redis = RedisClusterMgr.getInstance();
		this.keys = keys;
		this.level = level;
		this.id = id;

		this.idx = idx;

		this.session = session;
	}

	public void run() {

		if (this.keys == null || this.keys.size() <= 0) {
			return;
		}

		ArrayList<GridGeometryInfoDao> arr = this.redis.getGridCount(this.keys, this.level);

		GeoWebDto wDto = new GeoWebDto();

		wDto.setFeatures(converToGeoFeautreFromRedis(arr));
		wDto.setReqId(this.id);
		
		if (this.idx > -1)
			wDto.setIdx(String.valueOf(this.idx));
		wDto.setTotalCount(this.totalGridCount);
		
		this.responseQueue.add(wDto);

	}

	public void setIdx(int idx) {
		this.idx = idx;
	}

	private ArrayList<WebFeature> converToGeoFeautreFromRedis(ArrayList<GridGeometryInfoDao> location) {
		ArrayList<WebFeature> features = new ArrayList<WebFeature>();
		for (Iterator<GridGeometryInfoDao> iter = location.iterator(); iter.hasNext();) {
			GridGeometryInfoDao lDao = iter.next();

			WebFeature feature = new WebFeature();

			PropertyDto pDto = new PropertyDto();
			pDto.setWeight((double) lDao.getCount());

			feature.setProperties(pDto);

			WebGeometry geo = new WebGeometry();

			double[] coord = { lDao.getCoordinates().getLon(), lDao.getCoordinates().getLat() };

			geo.setCoordinates(coord);

			feature.setGeometry(geo);

			features.add(feature);
		}

		return features;
	}

	public GeoWebDto call() throws Exception {
	
		GeoWebDto wDto = new GeoWebDto();
		if (this.keys == null || this.keys.size() <= 0) {
			return wDto;
		}

		ArrayList<GridGeometryInfoDao> arr = this.redis.getGridCount(this.keys, this.level);


		wDto.setFeatures(converToGeoFeautreFromRedis(arr));
		wDto.setReqId(this.id);
		
		if (this.idx > -1)
			wDto.setIdx(String.valueOf(this.idx));
		wDto.setTotalCount(this.totalGridCount);
		return wDto;
	}

	public void setTotalGridCount(int gridCount) {
		this.totalGridCount = gridCount;
	}
}
