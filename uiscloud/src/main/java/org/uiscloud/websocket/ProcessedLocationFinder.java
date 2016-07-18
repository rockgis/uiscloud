package org.uiscloud.websocket;

import java.util.ArrayList;
import java.util.concurrent.LinkedBlockingQueue;

import javax.websocket.Session;

import org.bson.types.ObjectId;

import org.uiscloud.mongodb.LocationCollectionMgr;
import org.uiscloud.spark.model.mongodb.LocationInfoDao;
import org.uiscloud.spark.model.websocket.GeoWebDto;
import org.uiscloud.spark.model.websocket.PropertyDto;
import org.uiscloud.spark.model.websocket.WebFeature;
import org.uiscloud.spark.model.websocket.WebGeometry;
import org.uiscloud.spark.utils.DateUtils;

public class ProcessedLocationFinder implements Runnable{

	private ObjectId objectId;
	private LocationCollectionMgr mongoMgr;
	private LinkedBlockingQueue<GeoWebDto> queue;

	private Session session;

	private boolean running;

	private final static int LIMIT = 1000;
	public final static String DATE_FORMAT="yyyyMMdd";
	
	public ProcessedLocationFinder(Session session, ObjectId objectId, LinkedBlockingQueue<GeoWebDto> queue) {
		this.objectId = objectId;

		this.mongoMgr = LocationCollectionMgr.getInstance();

		this.queue = queue;
		this.session = session;

		this.running = false;
	}

	public void run() {
		int skip = 0;
		if (!this.mongoMgr.isConnect()) {
			this.mongoMgr.connect();
		}

		long total = this.mongoMgr.getCount();
		this.running = true;

		String today = DateUtils.getToday(DATE_FORMAT);
		this.objectId = null;
		this.findNewLocation(0, -1, LIMIT);


		while (this.session.isOpen()) {

			if (!today.equals(DateUtils.getToday(DATE_FORMAT))) {
				this.objectId = null;
			}
			
			this.findNewLocation(1, 1, LIMIT);
			try {
				Thread.sleep(50);
			} catch (InterruptedException e) {
				break;
			}
		}

		this.running = false;

		this.mongoMgr.close();
	}

	private ArrayList<WebFeature> converToGeoFeautreFromRedis(ArrayList<LocationInfoDao> arrs) {
		ArrayList<WebFeature> features = new ArrayList<WebFeature>();
		for (LocationInfoDao locationDao : arrs) {

			PropertyDto pDto = new PropertyDto();
			pDto.setLevel(locationDao.getLevel());
			pDto.setWeight((double) locationDao.getCount());

			WebFeature feature = new WebFeature();
			feature.setProperties(pDto);

			WebGeometry geo = new WebGeometry();
			double[] coord = { locationDao.getLon(), locationDao.getLat() };
			geo.setCoordinates(coord);
			feature.setGeometry(geo);
			features.add(feature);

		}

		return features;
	}

	public boolean isRunning() {
		return running;
	}

	public ObjectId getObjectId() {
		return objectId;
	}

	public void setObjectId(ObjectId objectId) {
		this.objectId = objectId;
	}

	private void findNewLocation(int skip, int orderby, int limit) {
		
		ArrayList<LocationInfoDao> arrs = this.mongoMgr.findStatistic(this.objectId,skip,LIMIT,orderby);
		
		GeoWebDto wDto = new GeoWebDto();
		wDto.setFeatures(converToGeoFeautreFromRedis(arrs));
		wDto.setReqId("statics");
		
		try {
			if(wDto.getFeatures().size() > 0)
				this.queue.put(wDto);
		 } catch (InterruptedException e) {
			 e.printStackTrace();
		
		 }
		
		 if(arrs.size() > 0 ) {
			 int idx = orderby == 1 ? arrs.size()-1:0;
			 this.objectId = arrs.get(idx).get_id();
		 }
	}
}
