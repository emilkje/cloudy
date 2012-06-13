Api = function() {
	this.getData = function(params, cb) {
		$.get("weather_api", params, function(data) {
			cb(data);
		});
	}
}

api = new Api();
