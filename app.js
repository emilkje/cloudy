var Application = function() {
	this.options = $.jStorage.get("options");
	// this.options.province = "Hedmark";
	// this.options.city = "Hamar";

	this.refresh = function(cb) {
		api.getData(this.options, function(res){
			$("#app").empty();
			$.tmpl("main", res).appendTo("#app");
			if(cb instanceof Function)
				cb();
		});
	}

	this.showWeather = function() {	
		this.refresh(function(){	
			$("#config").hide();
		});
	}

	this.showConfig = function() {
		$("#config").empty();
		$.tmpl("config", app.options).appendTo("#config");
		$("#config").show();
	}

	this.setOptions = function(obj) {
		this.options = obj;
		$.jStorage.set("options", obj);
	}

	this.init = function(callback) {
		
		$.get("views/main.html", function(data){
			$.template("main", data);

			$.get("views/config.html", function(data){
				$.template("config", data);
				callback();
			});
		});
	}
}

app = new Application();

$(function(){
	
	//Get the templates
	app.init(app_ready);

	function app_ready() {

		//The app is ready.
		if(app.options) {
			app.showWeather();
		} else {
			app.showConfig();
		}

	}

});

