package org.uiscloud.websocket;

import java.util.concurrent.Callable;
import java.util.concurrent.LinkedBlockingQueue;

import org.uiscloud.mongodb.LocationCollectionMgr;
import org.uiscloud.spark.model.websocket.GeoWebDto;
import org.uiscloud.spark.model.websocket.RequestMapInfo;
import org.uiscloud.redis.RedisClusterMgr;
import org.uiscloud.redis.RedisMgr;


/**
 * DB에 저장된 좌표들의 카운트 전송을 위한 class 
 */
public class SearchCountRunnable implements  Runnable {

	private final static String ID_PREFIX = "count_";

	private LocationCollectionMgr mongoDBMgr;
	private LinkedBlockingQueue<GeoWebDto> responseQueue;

	private RequestMapInfo request;

	private RedisClusterMgr redis;
	public SearchCountRunnable(LinkedBlockingQueue<GeoWebDto> responseQueue, RequestMapInfo request) {
		this.mongoDBMgr = LocationCollectionMgr.getInstance();
		this.request = request;

		this.responseQueue = responseQueue;
	
		this.redis = RedisClusterMgr.getInstance();
	}

	public void run() {
		
	
		if (this.request != null) {
			GeoWebDto wDto = new GeoWebDto();
			wDto.setReqId(ID_PREFIX + this.request.getId());
			wDto.setIdx(String.valueOf(this.request.getLevel()));
			wDto.setTotalCount(this.redis.getReceiveRun());
			wDto.setAllCollectionCount(this.redis.getReceive());
			this.responseQueue.add(wDto);
		}
	}

	public GeoWebDto call() throws Exception {
	
		GeoWebDto wDto = new GeoWebDto();
		if (this.request != null) {
			wDto.setReqId(ID_PREFIX + this.request.getId());
			wDto.setIdx(String.valueOf(this.request.getLevel()));
			wDto.setTotalCount(this.redis.getReceiveRun());
			wDto.setAllCollectionCount(this.redis.getReceive());
//			this.responseQueue.add(wDto);
		}
		
		return wDto;
	}
}
