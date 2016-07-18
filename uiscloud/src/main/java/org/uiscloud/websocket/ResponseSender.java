package org.uiscloud.websocket;

import java.io.IOException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import javax.websocket.Session;

import com.google.gson.Gson;
import org.uiscloud.spark.model.websocket.GeoWebDto;


/**
 * response를 전송 하기 위한 class
 *
 */
public class ResponseSender implements Runnable{
	
	private Session session;
	
	private BlockingQueue<GeoWebDto> queue;
	
	public ResponseSender(Session session, ArrayBlockingQueue<GeoWebDto> responseQueue) {
		this.session = session;
		
		this.queue = responseQueue;
		
	}
	
	public void run() {
		
		while(this.session.isOpen()) {
			if(this.queue.size() > 0) {
				try {
					GeoWebDto wDto = this.queue.take();
					this.sendMessage(new Gson().toJson(wDto));
					Thread.sleep(100);
				} catch (InterruptedException e) {
					break;
				} catch (IOException e) {
					break;
				}
				
			}
		}
		
	}
	
	private void sendMessage(String msg) throws IOException {
		this.session.getBasicRemote().sendText(msg);
	}
	
}
