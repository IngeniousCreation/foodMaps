/**
 * @class socket
 *
 * Create a new web socket (sockjs) connection
 *
 * @param namespace {String} The namespace to register on
 * @param reconnect {Boolean | null} The auto-reconnect state
*/
var socket = function(namespace, reconnect) {
	var _url  = "//"+window.location.hostname,
		_port = (a.environment.get("debug") === true) ? 8585 : 80,

		// Set if the system should auto-reconnect or not
		_reconnect = (reconnect === false) ? false : true,

		// The namespace (like ping, chat, ...)
		_namespace = (a.isString(namespace) && namespace.length > 0) ? namespace : "",

		// Internally store event attached to sockjs
		_event    = [],

		// Internal store for socket (from sockjs)
		_socket   = null;



	/**
	 * On socket event raise corresponding functions
	 *
	 * @param data {Object} The data elements
	*/
	function _onSocketEvent(data) {
		var name  = "",
			value = null,
			i     = _event.length;

		if(!a.isNull(data.name)) {
			name  = data.name;
			value = data.value;
		} else if(!a.isNull(data.data)) {
			name  = data.data.name;
			value = JSON.parse(data.data.data);
		}

		// Generating a new event for given message type
		obj.prototype.dispatch(name, value);

		while(i--) {
			if(name === _event[i].name) {
				_event[i].fn(value);
			}
		}
	};

	function _onDisconnect() {
		if(_socket === null) {
			return;
		}

		_socket.close();
		_socket = null;
	};

	function _onConnect() {
		// If the system is already connected, we don't do anything
		_onDisconnect();

		// We start it again
		_reconnect = (reconnect === false) ? false : true;
		var base = _url;
		if(_port !== 80) {
			base += ":" + _port;
		}
		_socket = new SockJS(base + "/" + _namespace, null, {
			debug : a.environment.get("debug"),
			devel : false
		});

		_socket.onopen = function() {
			obj.prototype.dispatch("connect", {});
			_onSocketEvent({
				name:  "connect",
				value: {}
			});
		};
		_socket.onmessage = function(data) {
			_onSocketEvent({
				name:  "message",
				value: data
			});
			_onSocketEvent(data);
		};
		_socket.onclose = function() {
			obj.prototype.dispatch("disconnect", {});
			_onSocketEvent({
				name:  "disconnect",
				value: {}
			});
			if(_reconnect) {
				a.console.log("WebSocket: reconnecting");
				_onConnect();
			}
		};
	};



	// Starting an object
	var obj = function(){};
	obj.prototype = new a.eventEmitter();
	obj.prototype.constructor = this;

	/**
	 * Emit an event using sockjs. This also take care of login timeout.
	 *
	 * @param name {string} The event name to send to Node.JS
	 * @param json {object} The JSON object to send to sockjs as parameters
	*/
	obj.prototype.emit = function(name, json){
		if(_socket !== null) {
			_socket.send(
				JSON.stringify({
					name: name,
					data: json
				})
			);
		}
	};

	/**
	 * Connect and event from sockjs like qooxdoo event
	 *
	 * @param name {string} The event name to watch
	 * @param fn {function} The function wich will catch event response
	 * @param scope {mixed} A link to this
	*/
	obj.prototype.on = function(name, fn, scope) {
		var fct = null;
		if(!a.isNull(scope)) {
			fct = function() {
				fn.apply(scope, arguments);
			};
		} else {
			fct = fn;
		}
		_event.push({
			name: name,
			fn:   fct
		});
	};

	/**
	 * Connect to server
	*/
	obj.prototype.connect = function() {
		_onConnect();
	};

	/**
	 * Get the reconnect state
	 *
	 * @return {Boolean} True if system automatically reconnect, false in other case
	*/
	obj.prototype.getReconnect = function() {
		return _reconnect;
	};

	obj.prototype.setReconnect = function(val) {
		_reconnect = (val === true) ? true : false;
	};

	/**
	 * Disconnect from server
	*/
	obj.prototype.disconnect = function() {
		_reconnect = false;
		_event = [];
		_onDisconnect();
	};

	var instance = new obj();
	instance.setName("socket." + _namespace);
	return instance;
};