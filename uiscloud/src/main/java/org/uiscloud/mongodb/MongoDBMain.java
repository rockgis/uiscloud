package org.uiscloud.mongodb;


import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Locale;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class MongoDBMain {

	private String url;
	private int port;
	private String dbName;
	
	private MongoClient mongoClient;
	private MongoDatabase mongoDb;
	
	private final static String COLLECTION_NAME="clusterData";
	private final static String DB_NAME="uiscloud_dr";
	
	
	public MongoDBMain() {
		super();
		this.url = "localhost";
		this.port = 27017;
		this.dbName = "test";
	
	}


	public MongoDBMain(String url, int port, String dbName) {
		super();
		this.url = url;
		this.port = port;
		this.dbName = dbName;
		
	}

	public void connect() {
		
		if(this.url == null || this.url.equals("")) {
			System.out.println(" url is null");
			return;
		}
		
		if(port <= 0) {
			
			this.port = 27017;
			System.out.println("port is under 0 -> set to "+this.port);
		}
		
		if(this.dbName == null || this.dbName.equals("")) {
			System.out.println(" db name is null");
			return;
		}
		
		this.mongoClient = new MongoClient(new ServerAddress(this.url, this.port));
		
		this.mongoDb = this.mongoClient.getDatabase(this.dbName);
		
		System.out.println(this.mongoDb.getName());
	
		
		for(String str : this.mongoClient.listDatabaseNames()) {
			System.out.println("db Name : " + str);
		}
		
		for(String str : this.mongoDb.listCollectionNames()) {
			System.out.println(this.dbName + "'s collection name : " + str);
		}
		
	}
	
	public void close() {
		this.mongoClient.close();
	}
	
	public void insertData(String collection, boolean isNew) throws ParseException {
		MongoCollection<Document> clusterData = this.mongoDb.getCollection(COLLECTION_NAME);
		if(isNew && clusterData.count() > 0) {
			clusterData.deleteMany(new Document());
		} 
		
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.KOREAN);
		//TODO : download/test.josn 정제 후 mongodb 삽입( x, y ,count)
		clusterData.insertOne(
		        new Document("address",
		                new Document()
		                        .append("street", "2 Avenue")
		                        .append("zipcode", "10075")
		                        .append("building", "1480")
		                        .append("coord", Arrays.asList(-73.9557413, 40.7720266)))
		                .append("borough", "Manhattan")
		                .append("cuisine", "Italian")
		                .append("grades", Arrays.asList(
		                        new Document()
		                                .append("date", format.parse("2014-10-01T00:00:00Z"))
		                                .append("grade", "A")
		                                .append("score", 11),
		                        new Document()
		                                .append("date", format.parse("2014-01-16T00:00:00Z"))
		                                .append("grade", "B")
		                                .append("score", 17)))
		                .append("name", "Vella")
		                .append("restaurant_id", "41704620"));
		
	}
	
	
	
	
	public static void main(String... args) {
		MongoDBMain dbMain = new MongoDBMain();
		dbMain.setUrl("192.168.0.114");
		dbMain.setDbName(DB_NAME);
		dbMain.connect();
		try {
			dbMain.insertData(COLLECTION_NAME, true);
		} catch (ParseException e) {
			e.printStackTrace();
		}
	
		dbMain.close();
	
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


	public String getDbName() {
		return dbName;
	}


	public void setDbName(String dbName) {
		this.dbName = dbName;
	}
	
}
