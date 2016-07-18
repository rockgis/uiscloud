package org.uiscloud.websocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import javax.websocket.Session;

import org.uiscloud.redis.RedisMgr;

import com.google.gson.Gson;
import org.uiscloud.mongodb.LocationCollectionMgr;
import org.uiscloud.spark.model.mongodb.LocationDao;
import org.uiscloud.spark.model.mongodb.ResponseDao;
import org.uiscloud.spark.model.redis.GridGeometryInfoDao;
import org.uiscloud.spark.model.websocket.GeoWebDto;
import org.uiscloud.spark.model.websocket.PropertyDto;
import org.uiscloud.spark.model.websocket.RequestMapInfo;
import org.uiscloud.spark.model.websocket.WebFeature;
import org.uiscloud.spark.model.websocket.WebGeometry;


@Deprecated
public class MapInfoFinder implements Runnable {

	private enum QueryEnum{
		aggregate,
		find,
		redis
	}
	
	
	private QueryEnum query = QueryEnum.redis;
	
	private boolean stop;
	
	private int skip;
	private final static int LIMIT_COUNT = 2056;
	
	private LocationCollectionMgr locationMgr;
	private RedisMgr redisMgr;
	
	private String msg;
	private RequestMapInfo request;

	private Session session;
	ArrayBlockingQueue<GeoWebDto> responseQueue;
	
	
	public MapInfoFinder(Session session , String request, ArrayBlockingQueue<GeoWebDto> responseQueue) {
		this.msg = new String();
		this.setRequest(request);

		this.session = session;
		
		this.locationMgr = LocationCollectionMgr.getInstance();
		this.locationMgr.connect();

		this.responseQueue = responseQueue;
		this.stop = false;
	}

	public void run() {
		
		this.skip = 0;
		try {
			while (this.session.isOpen() && !this.stop) {
				ArrayList<ResponseDao> response = new ArrayList<ResponseDao>();
				if(this.request == null) {
					Thread.sleep(100);
					continue;
				}
				
				RequestMapInfo oldRequest = this.request;
				int maxCount = 0;
				GeoWebDto wDto = new GeoWebDto();
				long first = System.currentTimeMillis();
				switch(query) {
				case redis:
					wDto = this.getLocationFromRedis(this.request);
					break;
				case find:
					wDto = this.getLcationsByFind(this.request);
					break;
				case aggregate:
					wDto = this.getLocationByAggregate(this.request);
					break;
				}
				
				
				if(oldRequest.equals(this.request) ) {
					this.responseQueue.put(wDto);
				}
//				this.sendMessage(new Gson().toJson(wDto));
				
				Thread.sleep(500);
			}
		} catch (InterruptedException e) {
				e.printStackTrace();
		} catch (Exception e) {
			System.out.println(Thread.currentThread().getName()+" --->");
			e.printStackTrace();
		}
		synchronized (this) {
			this.stop();
		}
		System.out.println(Thread.currentThread().getName()+" find thread terminated!!");
	}

	private GeoWebDto getLocationFromRedis(RequestMapInfo request) {
		GeoWebDto wDto = new GeoWebDto();
		if(this.redisMgr == null) {
			this.redisMgr = RedisMgr.getInstance();
		}
		
		if(!this.redisMgr.isConnected()) {
			this.redisMgr.connect("192.168.0.117");
		}
		
		ArrayList<GridGeometryInfoDao> geoArr  = this.redisMgr.getInfoFromRequest(this.request);
		
		synchronized (this) {	
			wDto.setFeatures(converToGeoFeautreFromRedis(geoArr));
			wDto.setTotalCount(this.locationMgr.getCount(this.request.getLevel()));
			wDto.setAllCollectionCount(this.locationMgr.getCountAllCollection());
			wDto.setReqId(this.request.getId());
		}
		
		return wDto;
	}
	
	private GeoWebDto getLocationByAggregate(RequestMapInfo request) {
		ArrayList<ResponseDao> response = new ArrayList<ResponseDao>();
		
		
		GeoWebDto wDto = new GeoWebDto();
		int maxCount = 0;
		
//		maxCount = this.locationMgr.aggreagteBox(this.request,response);
		maxCount = this.locationMgr.getRowCount(this.request,response);
			
		synchronized (this) {	
			wDto.setFeatures(converToGeoFeautreFromAggregate(response));
			wDto.setTotalCount(this.locationMgr.getCount(this.request.getLevel()));
			wDto.setAllCollectionCount(this.locationMgr.getCountAllCollection());
			wDto.setReqId(this.request.getId());
		}
		
		return wDto;
		
	}
	
	private GeoWebDto getLcationsByFind(RequestMapInfo request) {
		ArrayList<LocationDao> response = new ArrayList<LocationDao>();
		
		RequestMapInfo oldRequest = this.request;
		
		GeoWebDto wDto = new GeoWebDto();
		int maxCount = 0;
		
		maxCount = this.locationMgr.findByBox(this.request, response, this.skip, 1000);
			
		synchronized (this) {	
			wDto.setFeatures(converToGeoFeautreFromFind(response));
			wDto.setTotalCount(this.locationMgr.getCount(this.request.getLevel()));
			wDto.setAllCollectionCount(this.locationMgr.getCountAllCollection());
			wDto.setReqId(this.request.getId());
		}
		
		return wDto;
	}
	
	private ArrayList<WebFeature> converToGeoFeautreFromFind(ArrayList<LocationDao> location) {
		ArrayList<WebFeature> features = new ArrayList<WebFeature>();
		for (Iterator<LocationDao> iter = location.iterator(); iter.hasNext();) {
			LocationDao lDao = iter.next();

			WebFeature feature = new WebFeature();
			
			PropertyDto pDto = new PropertyDto();
			pDto.setWeight((double)lDao.getCount());
			
			feature.setProperties(pDto);
			
			WebGeometry geo = new WebGeometry();
			
			double[] coord = { lDao.getGeometry().getCoordinates().getLon(),
					lDao.getGeometry().getCoordinates().getLat() };
			
			geo.setCoordinates(coord);

			feature.setGeometry(geo);

			features.add(feature);
		}
		
		return features;
	}
	
	private ArrayList<WebFeature> converToGeoFeautreFromRedis(ArrayList<GridGeometryInfoDao> location) {
		ArrayList<WebFeature> features = new ArrayList<WebFeature>();
		for (Iterator<GridGeometryInfoDao> iter = location.iterator(); iter.hasNext();) {
			GridGeometryInfoDao lDao = iter.next();

			WebFeature feature = new WebFeature();
			
			PropertyDto pDto = new PropertyDto();
			pDto.setWeight((double)lDao.getCount());
			
			feature.setProperties(pDto);
			
			WebGeometry geo = new WebGeometry();
			
			double[] coord = { lDao.getCoordinates().getLon(),
					lDao.getCoordinates().getLat() };
			
			geo.setCoordinates(coord);

			feature.setGeometry(geo);

			features.add(feature);
		}
		
		return features;
	}
	
	
	
	private ArrayList<WebFeature> converToGeoFeautreFromAggregate(ArrayList<ResponseDao> location) {
		ArrayList<WebFeature> features = new ArrayList<WebFeature>();
		int totalCount = 0;
		for (Iterator<ResponseDao> iter = location.iterator(); iter.hasNext();) {
			ResponseDao lDao = iter.next();

			WebFeature feature = new WebFeature();
			
			PropertyDto pDto = new PropertyDto();
			pDto.setWeight((double)lDao.getMaxCount());
			
			totalCount+=lDao.getMaxCount();
			
			feature.setProperties(pDto);
			
			WebGeometry geo = new WebGeometry();
			
			double[] coord = { lDao.get_id().getCoordinates().getLon(),
					lDao.get_id().getCoordinates().getLat() };
			
			geo.setCoordinates(coord);

			feature.setGeometry(geo);

			features.add(feature);
		}
		
		return features;
	}

	public void setRequest(String message) {
		if(message == null || this.msg.equals(message) || message.equals("")){
			return;
		}
		
		this.responseQueue.clear();

		synchronized (this) {
			this.msg = message;
			this.request = new Gson().fromJson(this.msg, RequestMapInfo.class);
			this.skip = 0;
		}
	}

	private void sendMessage(String msg) throws IOException {
		this.session.getBasicRemote().sendText(msg);
	}

	public void stop() {
//		this.stop = true;
		if(this.redisMgr.isConnected()) {
			this.redisMgr.disconnect();
		}
	}
	
}
