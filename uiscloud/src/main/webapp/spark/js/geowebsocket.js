/**
 * 
 */

function GeoWebsocket() {
	this.socket = null;
	this.messageListener = null;
}

GeoWebsocket.prototype = {

	connect : function(host, callback) {

		if ('WebSocket' in window) {
			this.socket = new WebSocket(host);
		} else if ('MozWebSocket' in window) {
			this.socket = new MozWebSocket(host);
		} else {
			console.log('Error: WebSocket is not supported by this browser.');
			return;
		}

		// 서버에 접속이 되면 호출되는 콜백함수
		this.socket.onopen = function() {
			console.log('Info: WebSocket connection opened.');
			// 채팅입력창에 메시지를 입력하기 위해 키를 누르면 호출되는 콜백함수
			callback("connect");

		};

		// 연결이 끊어진 경우에 호출되는 콜백함수
		this.socket.onclose = function() {
			console.log('Info: WebSocket closed.');
		};

		// 서버로부터 메시지를 받은 경우에 호출되는 콜백함수
		this.socket.onmessage = function(message) {
			// 수신된 메시지를 화면에 출력함
			callback(message.data);
		};

	},

	setListener : function(listener) {

		this.socket.listener = listener;

	},

	initialize : function(listener) {
		if (window.location.protocol == 'http:') {
			var url = window.location.hostname + ":" + window.location.port;
			this.connect('ws://' + url + '/demo', function(msg) {
				listener(msg);
			});
		} else {
			this.connect('wss://' + window.location.host + '/demo');
		}
	},

	sendMessage : function(msg) {
		this.socket.send(msg);
	}
}
