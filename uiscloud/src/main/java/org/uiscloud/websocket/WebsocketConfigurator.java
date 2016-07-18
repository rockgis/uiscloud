package org.uiscloud.websocket;

import java.util.List;

import javax.websocket.Extension;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;
import javax.websocket.server.ServerEndpointConfig.Configurator;

public class WebsocketConfigurator extends Configurator {

	@Override
	public void modifyHandshake(ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response) {
		if (request.getHeaders().containsKey("user-agent")) {
			sec.getUserProperties().put("user-agent", request.getHeaders().get("user-agent").get(0)); // lower-case!
        }
	}

	@Override
	public List<Extension> getNegotiatedExtensions(List<Extension> installed, List<Extension> requested) {
		// TODO Auto-generated method stub
		for(Extension e : requested) {
		}
		
		return super.getNegotiatedExtensions(installed, requested);
	}
	
	 
}
