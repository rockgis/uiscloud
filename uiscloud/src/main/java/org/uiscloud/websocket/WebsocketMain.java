package org.uiscloud.websocket;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.atomic.AtomicInteger;

import javax.websocket.CloseReason;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.log4j.Logger;

import org.uiscloud.spark.model.websocket.GeoWebDto;

@ServerEndpoint(value = "/websocket",configurator = WebsocketConfigurator.class)
public class WebsocketMain {

	private static final Logger logger = Logger.getLogger(WebsocketMain.class);
	
	private String nickName;

	private final static String PREFIX = "guest_";

	private final static Set<WebsocketMain> connections = new CopyOnWriteArraySet<WebsocketMain>();
	private final static AtomicInteger connectionIds = new AtomicInteger(0);

	private Session session;

	private Thread mapinfoThread;
	private Thread responseThread;

	private LinkedBlockingQueue<GeoWebDto> responseQueue;

	private InfoFinderThreadPool infoFinder;
	private DividedResponseSender responseSender;
	private ProcessedLocationFinder locationFinder;
	private SearchCountRunnable countSender;
	
	private String request;
	
	public WebsocketMain() {
		this.nickName = PREFIX + connectionIds.getAndIncrement();
		this.responseQueue = new LinkedBlockingQueue<GeoWebDto>();
		this.request = new String();
	
	}

	@OnOpen
	public void start(Session session, EndpointConfig config) {

		logger.info("join the client :" + session.getId());
		this.session = session;
		connections.add(this);
		
		String userAgent = (String) config.getUserProperties().get("user-agent");
	
		this.responseSender = new DividedResponseSender(session, this.responseQueue);
		this.responseThread = new Thread(this.responseSender);
		this.responseThread.start();
		logger.info("response sender start");
		
		this.infoFinder = new InfoFinderThreadPool(this.session, "", this.responseQueue);
		this.mapinfoThread = new Thread(this.infoFinder);
		this.mapinfoThread.start();
		logger.info("location info finder start");
		
		this.locationFinder = new ProcessedLocationFinder(this.session, null, this.responseQueue);
		Thread thread = new Thread(this.locationFinder);
		thread.start();
		
	}

	@OnClose
	public void end(Session session, CloseReason closeReason) {
		
		logger.info("leave the client :" + this.session +" resason : "+closeReason);
		connections.remove(this);

		try {
			this.session.close();
		} catch (IOException e) {
		}

		this.responseQueue.clear();
		this.infoFinder.stop();

	}

	@OnError
	public void onError(Throwable t) {
	}

	@OnMessage
	public void incomming(String message) {
		if(message == null || message.trim().equals("") || this.request.equals(message))
			return;
		
		logger.info("request from "+this.session.getId());
	
		this.responseQueue.clear();
		
		this.infoFinder.setRequest(message);
		this.request = message;
	}

	private void sendMessage(String msg) {
		try {
			this.session.getBasicRemote().sendText(msg);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
