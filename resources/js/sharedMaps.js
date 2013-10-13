/**
 * @class sharedMaps
 *
 * Handle sharedMaps
*/
var sharedMaps = (function() {
	var _socket = null,
		_name   = "socket.sharedMaps";

	return {
		/**
		 * Start the sharedMaps system
		 *
		 * @param decisionId {Integer} The decision id to link with
		 * @param login {String} The login to use (same as general system)
		 * @param password {String} The password to use (same as general system => sha512 one)
	     */
		connect : function(decisionId, login, password) {
			if(_socket !== null) {
				return;
			}

			_socket = new socket("sharedMaps", true);

			_socket.on("connect", function() {
				// Everytime a connect appear, we have to logon again
				_socket.emit("join", {
					login:    login || "",
					password: password || "",
					prefix:   "shared",
					userId:   parseInt(Math.floor((Math.random()*10)+1), 10),
					roomId:   parseInt(1, 10)
				});
			});

			_socket.on("message", function(data) {
				// Debug
				// console.log("message : " + data);
			});

			_socket.on("info", function(data) {
				console.log("info : ");
				console.log(data);
			});

			_socket.on("click", function(data) {
				console.log("click : ");
				console.log(data);
			});

			_socket.connect();
			return _socket;
		},

		/**
		 * Start the sharedMaps
		 * Note: only session leader and above can activate sharedMaps
		 *
		 * @param seconds {Integer} The seconds before release sharedMaps
		 */
		click : function(data) {
			_socket.emit("click", {
				coord   : data,
				prefix  : "personal"
			});
		},

		/**
		 * Stop the sharedMaps system
		 */
		disconnect : function() {
			if(_socket !== null) {
				_socket.disconnect();
				_socket = null;
			}
		}
	};
})();