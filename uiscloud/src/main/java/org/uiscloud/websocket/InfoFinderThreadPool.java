package org.uiscloud.websocket;

import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

import javax.websocket.Session;

import org.apache.log4j.Logger;
import org.springframework.data.redis.core.RedisConnectionUtils;
import org.uiscloud.redis.RedisClusterMgr;
import org.uiscloud.redis.RedisMgr;

import com.google.gson.Gson;
import org.uiscloud.spark.model.redis.GridCoordinateDao;
import org.uiscloud.spark.model.websocket.GeoWebDto;
import org.uiscloud.spark.model.websocket.RequestMapInfo;
import org.uiscloud.spark.util.GeoGridConverter;

public class InfoFinderThreadPool implements Runnable {
	private static final Logger logger = Logger.getLogger(InfoFinderThreadPool.class);
	
	private ExecutorService threadPoolMgr;
	private final static int THREAD_POOL_COUNT = 10;

	private String msg;
	private RequestMapInfo request;

	private Session session;
	private LinkedBlockingQueue<GeoWebDto> responseQueue;

	private GeoGridConverter gridConverter;

	private RedisClusterMgr redis;

	private int sleepTime = 500;

	private boolean stop;
	
	
	public InfoFinderThreadPool(Session session, String request, LinkedBlockingQueue<GeoWebDto> responseQueue) {

		this.threadPoolMgr = Executors.newFixedThreadPool(THREAD_POOL_COUNT);
		// this.threadPoolMgr = Executors.newCachedThreadPool();

		this.responseQueue = responseQueue;
		this.msg = request;
		this.session = session;

		this.gridConverter = new GeoGridConverter();

		this.redis = RedisClusterMgr.getInstance();
		this.stop = false;
	}

	public void run() {
		RequestMapInfo oldRequest = this.request;
		boolean sendCount = false;
		try {
			while (this.session.isOpen() && !this.stop) {
				
				if (this.request == null) {
					Thread.sleep(this.sleepTime);
					continue;
				}
				if (!this.request.equals(oldRequest)) {
					if (this.threadPoolMgr.isShutdown()) {
						this.threadPoolMgr = Executors.newFixedThreadPool(THREAD_POOL_COUNT);
						// this.threadPoolMgr = Executors.newCachedThreadPool();
					}
					oldRequest = this.request;
				}

				if (sendCount) {
					threadPoolMgr.execute(new SearchCountRunnable(this.responseQueue, oldRequest));
				}
				sendCount = !sendCount;
				
				if (!oldRequest.getId().startsWith("daummap") && !oldRequest.getId().startsWith("heatmap")) {
					Thread.sleep(this.sleepTime);
					continue;
				}

				ArrayList<ArrayList<GridCoordinateDao>> inboundPoints = this.gridConverter.getGeoGridLocation(
						oldRequest.getId(), oldRequest.getLevel(), oldRequest.getStartPoint(), oldRequest.getEndPoint(),
						1000);
				int idx = 0;
				for (ArrayList<GridCoordinateDao> keys : inboundPoints) {
					ReadInfoElement rie = new ReadInfoElement(keys, oldRequest.getLevel(), oldRequest.getId(), redis, this.responseQueue);
					rie.setIdx(idx);
					rie.setTotalGridCount(inboundPoints.size());
					threadPoolMgr.execute(rie);
					idx++;
				}
	
				Thread.sleep(this.sleepTime);
				
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		this.stop();

	}

	public void setRequest(String message) {
		this.msg = message;
		this.threadPoolMgr.shutdown();
		this.request = new Gson().fromJson(this.msg, RequestMapInfo.class);
		
		logger.info("set request : "+this.request.getId());
	}

	public synchronized void stop() {
		
		this.threadPoolMgr.shutdown();
		this.stop = true;
		
	}

	public void setSleepTime(int readTime) {
		this.sleepTime = readTime;
	}

}
