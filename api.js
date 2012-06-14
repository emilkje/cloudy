Api = function() {
	this.getData = function(params, cb) {
		$.get("weather_api", params, function(data) {
			data = data.replace("/\@attributes/g", "attributes");
			data = $.parseJSON(data);
			cb(data);
		});
	}
}

api = new Api();
