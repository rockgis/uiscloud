package org.uiscloud.mongodb;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.uiscloud.spark.model.mongodb.AggregateGeometryDao;
import org.uiscloud.spark.model.mongodb.AggregateGroupDao;
import org.uiscloud.spark.model.mongodb.CoordinateDao;
import org.uiscloud.spark.model.mongodb.GeoIntersectsDao;
import org.uiscloud.spark.model.mongodb.GeometryAggregateDao;
import org.uiscloud.spark.model.mongodb.GeometryDao;
import org.uiscloud.spark.model.mongodb.LocationDao;
import org.uiscloud.spark.model.mongodb.LocationInfoDao;
import org.uiscloud.spark.model.mongodb.MatchDao;
import org.uiscloud.spark.model.mongodb.MaxCountDao;
import org.uiscloud.spark.model.mongodb.ResponseDao;
import org.uiscloud.spark.model.mongodb.SumCountDao;
import org.uiscloud.spark.model.websocket.RequestMapInfo;

import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.Block;
import com.mongodb.Function;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoIterable;

public class LocationCollectionMgr {
	public final static int COLLECTION_COUNT = 20;

	private final static String DB_NAME = "uiscloud";
	private final static String COLLECTION_NAME_PREFIX = "output_";
	private final static String DATE_FORMAT="yyyyMMdd";
	
	private final static String URL = "192.168.0.114";
	private final static int PORT = 27017;

	private MongoClient mongoClient;
	private MongoDatabase mongoDB;

	private static LocationCollectionMgr locationCollectionMgr;

	private ArrayList<LocationDao> locations;

	private LocationCollectionMgr() {

	}

	public static LocationCollectionMgr getInstance() {
//		if (locationCollectionMgr == null) {
//			locationCollectionMgr = new LocationCollectionMgr();
//		}
//
//		return locationCollectionMgr;
		
		return new LocationCollectionMgr();
	}

	public void connect() {

		if (this.mongoClient == null) {
			this.mongoClient = new MongoClient(new ServerAddress(URL, PORT));
		}

		if (this.mongoDB == null) {
			this.mongoDB = this.mongoClient.getDatabase(DB_NAME);
		}

	}
	

	public ArrayList<LocationInfoDao> findStatistic(ObjectId objectId,int skip , int limit,int order) {
		SimpleDateFormat df = new SimpleDateFormat(DATE_FORMAT);
		Date date = new Date();
		String today = df.format(date);
		
		MongoCollection<Document> collection = this.mongoDB.getCollection(COLLECTION_NAME_PREFIX +  this.getToday());

		BasicDBObject sort = new BasicDBObject("_id",order);

		BasicDBObject wh = null;
		if(objectId != null)
			wh = new BasicDBObject("_id", new BasicDBObject("$gt", objectId));
		
		FindIterable<Document> result = null;
		
		if(wh != null)
			result = collection.find(wh).sort(sort).skip(skip).limit(limit);
		else 
			result = collection.find().sort(sort).skip(skip).limit(limit);
		
		//{ _id:{$gt: ObjectId("56bbfcf3d736b007b056cee0")} }
		
		MongoIterable<LocationInfoDao> res = result.map(new Function<Document, LocationInfoDao>() {
			public LocationInfoDao apply(Document t) {
				LocationInfoDao gs = new Gson().fromJson(t.toJson(), LocationInfoDao.class);
				gs.set_id((ObjectId)(t.get("_id")));
				return gs;
			}
		});


		final ArrayList<LocationInfoDao> rDao = new ArrayList<LocationInfoDao>();
		res.forEach(new Block<LocationInfoDao>() {

			public void apply(LocationInfoDao t) {
				rDao.add(t);
			}
		});
		
		return rDao;
	}

	public long getCount() {
		MongoCollection<Document> collection = this.mongoDB.getCollection(COLLECTION_NAME_PREFIX + this.getToday());
		return collection.count();
	}
	
	public void close() {
		System.out.println("closed");
		this.mongoClient.close();

		this.mongoClient = null;
		this.mongoDB = null;

	}

	/*
	 * TODO util class로 이
	 */
	public String getToday() {
		SimpleDateFormat df = new SimpleDateFormat(DATE_FORMAT);
		Date date = new Date();
		String today = df.format(date);
		return today;
	}
	
	public boolean isConnect() {

		return (this.mongoClient != null) && (this.mongoDB != null);
	}

	/*
	 * db 변경  
	 */
	@Deprecated
	public void insert(ArrayList<LocationDao> locationArr) {
		if (this.mongoDB == null)
			return;
		ArrayList<Document> documnets = new ArrayList<Document>();
		for (int i = 0; i < locationArr.size(); i++) {
			LocationDao lDao = locationArr.get(i);
			MongoCollection<Document> collection = this.mongoDB.getCollection(COLLECTION_NAME_PREFIX + i);
			Document document = this.getDoucmnet(lDao);
			collection.insertOne(document);
		}
	}

	/*
	 * 사용 db 변경 
	 */
	@Deprecated
	public long getCount(double[] location, int level) {
		MongoCollection<Document> collection = this.mongoDB.getCollection(COLLECTION_NAME_PREFIX + level);
		BasicDBObject wh = new BasicDBObject();
		wh.put("geometry.coordinates.lon", location[0]);
		wh.put("geometry.coordinates.lat", location[1]);
		long res = collection.count(wh);
		return res;
	}

	/*
	 * 사용 db 변경 
	 */
	@Deprecated
	public ArrayList<LocationDao> createLocationCollections(double[] coordinates) {
		ArrayList<LocationDao> locationCollections = new ArrayList<LocationDao>();

		for (int level = 0; level < COLLECTION_COUNT; level++) {
			LocationDao lDao = new LocationDao();
			GeometryDao gDao = convertToIndexLocation(coordinates, level);
			lDao.setGeometry(gDao);
			double[] coords = { gDao.getCoordinates().getLon(), gDao.getCoordinates().getLat() };
			lDao.setCount((int) getCount(coords, level) + 1);
			locationCollections.add(lDao);
		}

		return locationCollections;
	}

	/*
	 * level에 따른 좌표 변경
	 * TODO util class 로 변경 
	 */
	private GeometryDao convertToIndexLocation(double[] coordinates, int level) {
		GeometryDao gDao = new GeometryDao();

		double[] boundary = { 360, 180 };

		double[] location = this.convertLocationForZoomLevel(coordinates, boundary, level);
		CoordinateDao coordinate = new CoordinateDao();

		coordinate.setLon(location[0]);
		coordinate.setLat(location[1]);

		gDao.setCoordinates(coordinate);
		return gDao;
	}

	/*
	 * level 에 따른 좌표간 offset 
	 */
	
	private double getOffeset(double length, int level) {
		return length / ((double) COLLECTION_COUNT * Math.pow(2, level));
	}

	/*
	 * level에 따른 좌표 변경
	 * TODO util class 로 변경 
	 */
	private double[] convertLocationForZoomLevel(double[] coordinates, double[] boundary, int level) {
		double[] location = new double[coordinates.length];

		for (int i = 0; i < location.length; i++) {
			double offset = this.getOffeset(boundary[i], level);
			double plainLoc = (boundary[i] / 2) + coordinates[i];
			int idx = (int) (plainLoc / (offset * (double) (i + 1)));

			location[i] = (double) idx * offset + ((offset) / (double) 2) - ((boundary[i]) / 2);
		}

		return location;
	}
	
	@Deprecated
	private Document getDoucmnet(LocationDao lDao) {
		Gson gson = new Gson();
		Document document = Document.parse(gson.toJson(lDao));
		return document;
	}

	/*
	 * 컬렉션 삭제
	 * db 변경에 따른 삭제
	 */
	@Deprecated
	public void dropCollections() {
		for (int i = 0; i < COLLECTION_COUNT; i++) {
			MongoCollection<Document> collection = this.mongoDB.getCollection(COLLECTION_NAME_PREFIX + i);
			collection.drop();
		}

	}

	/*
	 * bbox 사용
	 * db 변경에 따른 미사
	 */
	@Deprecated
	public int getRowCount(final RequestMapInfo rMap, final ArrayList<ResponseDao> rDao) {
		MongoCollection<Document> collection = this.mongoDB.getCollection(COLLECTION_NAME_PREFIX + rMap.getLevel());
		Document doc = new Document();

		AggregateGeometryDao cArrDao = new AggregateGeometryDao();

		List<double[]> polygon = this.getPolygonLocate(rMap);

		cArrDao.setCoordinates(Arrays.asList(polygon));

		GeoIntersectsDao gDao = new GeoIntersectsDao();
		gDao.set$geometry(cArrDao);

		GeometryAggregateDao gaDao = new GeometryAggregateDao();
		gaDao.set$geoIntersects(gDao);

		MatchDao matchDao = new MatchDao();
		matchDao.setGeometry(gaDao);

		final Gson gson = new Gson();

		doc.append("$match", Document.parse(gson.toJson(matchDao)));

		Document group = new Document();
		AggregateGroupDao groupCount = new AggregateGroupDao();
		groupCount.setMaxCount(new SumCountDao());
		group.append("$group", Document.parse(gson.toJson(groupCount)));

		AggregateIterable<Document> result = collection.aggregate(Arrays.asList(doc, group));
		int count = 0;

		MongoIterable<ResponseDao> res = result.map(new Function<Document, ResponseDao>() {
			public ResponseDao apply(Document t) {
				ResponseDao gs = gson.fromJson(t.toJson(), ResponseDao.class);
				gs.setReqId(rMap.getId());
				return gs;
			}

		});
		long first = System.currentTimeMillis();
		// for(Iterator<ResponseDao> iter = res.iterator() ; iter.hasNext();) {
		// ResponseDao da = iter.next();
		// count += da.getMaxCount();
		// rDao.add(da);
		// }

		res.forEach(new Block<ResponseDao>() {

			public void apply(ResponseDao t) {
				rDao.add(t);
			}
		});

		System.out.println(rMap.getId() + " time : " + (System.currentTimeMillis() - first));
		return count;
	}

	
	/*
	 * aggregate 사용
	 * db 변경에 따른 미사
	 */
	@Deprecated
	public int aggreagteBox(RequestMapInfo rMap, ArrayList<ResponseDao> rDao) {
		MongoCollection<Document> collection = this.mongoDB.getCollection(COLLECTION_NAME_PREFIX + rMap.getLevel());
		Document doc = new Document();

		//
		// collection.aggregate(Arrays.asList(
		// new Document("$match", new Document("borough",
		// "Queens").append("cuisine", "Brazilian")),
		// new Document("$group", new Document("_id",
		// "$address.zipcode").append("count", new Document("$sum", 1)))));

		AggregateGeometryDao cArrDao = new AggregateGeometryDao();

		List<double[]> polygon = this.getPolygonLocate(rMap);

		cArrDao.setCoordinates(Arrays.asList(polygon));

		GeoIntersectsDao gDao = new GeoIntersectsDao();
		gDao.set$geometry(cArrDao);

		GeometryAggregateDao gaDao = new GeometryAggregateDao();
		gaDao.set$geoIntersects(gDao);

		MatchDao matchDao = new MatchDao();
		matchDao.setGeometry(gaDao);

		Gson gson = new Gson();

		doc.append("$match", Document.parse(gson.toJson(matchDao)));
		Document group = new Document();
		AggregateGroupDao groupCount = new AggregateGroupDao();
		groupCount.setMaxCount(new MaxCountDao());
		group.append("$group", Document.parse(gson.toJson(groupCount)));

		AggregateIterable<Document> result = collection.aggregate(Arrays.asList(doc, group));

		long first = System.currentTimeMillis();
		int count = 0;
		for (MongoCursor<Document> iter = result.iterator(); iter.hasNext();) {
			Document resDoc = iter.next();
			ResponseDao gs = gson.fromJson(resDoc.toJson(), ResponseDao.class);
			gs.setReqId(rMap.getId());
			rDao.add(gs);
			count += gs.getMaxCount();
		}

		return count;
	}

	/*
	 *유효 바운더리로 변경 
	 */
	private List<double[]> getPolygonLocate(RequestMapInfo rMap) {

		rMap.setStartPoint(new double[] { rMap.getStartPoint()[0] < -180.0 ? -180.0 : rMap.getStartPoint()[0],
				rMap.getStartPoint()[1] < -90.0 ? -90.0 : rMap.getStartPoint()[1] });
		rMap.setEndPoint(new double[] { rMap.getEndPoint()[0] > 180.0 ? 180.0 : rMap.getEndPoint()[0],
				rMap.getEndPoint()[1] > 90.0 ? 90.0 : rMap.getEndPoint()[1] });

		double sX = rMap.getStartPoint()[0];
		double sY = rMap.getStartPoint()[1];
		double eX = rMap.getEndPoint()[0];
		double eY = rMap.getEndPoint()[1];
		double hX = (sX + eX) / (double) 2;
		double hY = (sY + eY) / (double) 2;

		double[] start = rMap.getStartPoint();
		double[] endPoint = rMap.getEndPoint();

		double[] loc2 = { start[0], endPoint[1] };
		double[] loc4 = { endPoint[0], start[1] };

		return Arrays.asList(start, loc4, endPoint, loc2, start);
	}

	/*
	 * 레벨 카운드
	 * db 변경에 따른 미사용 
	 */
	@Deprecated
	public long getCount(int level) {
		MongoCollection<Document> collection = this.mongoDB.getCollection(COLLECTION_NAME_PREFIX + level);
		return collection.count();
	}

	/*
	 * 레벨 전체  카운드
	 * db 변경에 따른 미사용 
	 */
	public long getCountAllCollection() {
		long count = 0;
		for (int i = 0; i < COLLECTION_COUNT; i++) {
			count += getCount(i);
		}
		return count;
	}

	/*
	 * bbox 사용
	 * db 변경에 따른 미사용 
	 */
	@Deprecated
	public int findByBox(RequestMapInfo rMap, ArrayList<LocationDao> responseDao, int skip, int limit) {

		MongoCollection<Document> collection = this.mongoDB.getCollection(COLLECTION_NAME_PREFIX + rMap.getLevel());
		List box = new ArrayList();
		box.add(rMap.getStartPoint()); // Starting coordinate
		box.add(rMap.getEndPoint()); // Ending coordinate
		BasicDBObject wh = new BasicDBObject("geometry", new BasicDBObject("$within", new BasicDBObject("$box", box)));

		FindIterable<Document> res = collection.find(wh);

		System.out.println(wh.toString());
		int count = 0;
		Gson gson = new Gson();
		long first = System.currentTimeMillis();
		for (MongoCursor<Document> iter = res.iterator(); iter.hasNext();) {
			Document doc = iter.next();
			LocationDao gs = gson.fromJson(doc.toJson(), LocationDao.class);
			gs.setReqId(rMap.getId());
			this.compareMaxCount(responseDao, gs);
			count++;
		}
		System.out.println(System.currentTimeMillis() - first);

		return count;
	}

	@Deprecated
	private boolean compareMaxCount(ArrayList<LocationDao> locations, LocationDao lDao) {
		boolean hasLoc = false;
		for (Iterator<LocationDao> iter = locations.iterator(); iter.hasNext();) {
			LocationDao loc = iter.next();
			CoordinateDao oDao = loc.getGeometry().getCoordinates();
			CoordinateDao nDao = lDao.getGeometry().getCoordinates();
			if (oDao.getLat() == nDao.getLat() && oDao.getLon() == nDao.getLon()) {
				hasLoc = true;
				if (loc.getCount() < lDao.getCount()) {
					locations.remove(loc);
					locations.add(lDao);
					return true;
				}
			}

		}
		if (!hasLoc)
			locations.add(lDao);
		return false;
	}

}
