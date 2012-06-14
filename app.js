var Application = function() {
	this.options = $.jStorage.get("options");
	// this.options.province = "Hedmark";
	// this.options.city = "Hamar";

	this.refresh = function(cb) {
		me = this;
		api.getData(this.options, function(res){
			$("#app").empty();
			var items = Array();
			if(res) {
				$.each(res.forecast.tabular.time, function(index, forecast){
					obj = {	
						temp : forecast.temperature.attr.value, 
						day : forecast.day,
						date : forecast.date,
						time : forecast.time,
						city: res.location.name,
						icon : forecast.symbol.attr.number,
						condition: forecast.symbol.attr.name,
						province: me.options.province
					}
					items.push(obj);
				});
				$.tmpl("main", items.shift()).appendTo("#app");
				$.tmpl("alt", items.shift()).appendTo("#app").addClass("second");
				$.tmpl("alt", items.shift()).appendTo("#app").addClass("third");
				$.tmpl("alt", items.shift()).appendTo("#app").addClass("fourth");
			}
			if(cb instanceof Function)
				cb(res);
		});
	}

	this.showWeather = function() {	
		this.refresh(function(success){	
			if(success) {
				$("#config").hide();
			} else {
				alert("Fant ikke vær for dette stedet");
			}
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

				$.get("views/alt.html", function(data) {
					$.template('alt', data);
					callback();
				});
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

	$('#config form').live('submit', function(e){
		options = {
			city: $("#city", this).val(),
			province : $("#province", this).val()
		}
		console.log(options);
		app.setOptions(options);
		app.showWeather();
		e.preventDefault();	
	});

	$(".config a").live('click', function(e) {
		app.showConfig();
		e.preventDefault();
	});

	$(".refresh a").live('click', function(e) {
		app.refresh();
		e.preventDefault();
	});

});

