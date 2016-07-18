package org.uiscloud.websocket;

import java.io.IOException;
import java.util.concurrent.LinkedBlockingQueue;

import javax.websocket.Session;

import com.google.gson.Gson;
import org.uiscloud.mongodb.LocationCollectionMgr;
import org.uiscloud.spark.model.websocket.GeoWebDto;
import org.uiscloud.spark.model.websocket.RequestMapInfo;

public class DividedResponseSender implements Runnable {

	private Session session;
	
	private LinkedBlockingQueue<GeoWebDto>  queue;
	private int sleepTime = 10;
	
	private boolean stop;
	
	public DividedResponseSender(Session session, LinkedBlockingQueue<GeoWebDto> responseQueue) {
		this.session = session;
		this.queue = responseQueue;
		this.stop = false;
	}
	
	public void run() {
		
		while(this.session.isOpen() && !this.stop) {
			if(this.queue.size() > 0) {
				try {
					
					GeoWebDto wDto = this.queue.take();
					this.sendMessage(new Gson().toJson(wDto));
					Thread.sleep(this.sleepTime);
				} catch(IllegalStateException e){
					e.printStackTrace();
				}catch (InterruptedException e) {
					break;
				} catch (IOException e) {
					break;
				} 
				
			}
		
		}
		
		System.out.println("response sender close");
	}
	
	private void sendMessage(String msg) throws IOException {
		
		this.session.getBasicRemote().sendText(msg);
		this.session.getBasicRemote().flushBatch();

	}

	public void setSleepTime(int sleepTime) {
		this.sleepTime = sleepTime;
	}
	
	public void stop() {
		this.stop = true;
	}
}
