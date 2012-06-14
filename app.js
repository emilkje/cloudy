var Application = function() {
	this.options = {};

	this.refresh = function(cb) {
		me = this;
		api.getData(this.options, function(res){
			$("#app .first .content").empty();
			$("#app .small").empty();
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
						country: res.location.country
					}
					items.push(obj);
				});
				$.tmpl("main", items.shift()).appendTo("#app .first .content");
				$.tmpl("alt", items.shift()).appendTo("#app .small").addClass("second");
				$.tmpl("alt", items.shift()).appendTo("#app .small").addClass("third");
				$.tmpl("alt", items.shift()).appendTo("#app .small").addClass("fourth");
			}
			// $(".refresh a").removeClass("active");
			if(cb instanceof Function)
				cb(res);
		});
	}

	this.showWeather = function() {	
		me = this;
		this.refresh(function(success){	
			if(success) {
				$("#config").hide();
			} else {
				alert("Kunne ikke vise vær for dette stedet");
				localStorage.removeItem('options');
				me.showConfig();
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
		localStorage.options = $.toJSON(obj);
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

	this.search = function(query) {
		me = this;
		api.search(query, function(data) {
			var ul = $('<ul></ul>');
			$.each(data.result, function(index, item){
				var link = $('<a href="#activate" data-url="' + item[1] + '">' + item[2] + '</a>');
				ul.append($('<li></li>').append(link));
			});
			$("#search_results").html(ul);
			$("#search_results ul li a").live('click', function(e){
				me.setOptions({url: $(this).data('url')});
				me.showWeather();
				e.preventDefault();
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
		if(localStorage.options) {
			app.options = $.parseJSON(localStorage.options);
			app.showWeather();
		} else {
			app.showConfig();
		}

	}

	$('#config form').live('submit', function(e){
		options = {query : $("#search", this).val()};
		app.search(options);
		e.preventDefault();	
	});

	$("#config .close").live('click', function(e) {
		e.preventDefault();
	});


	$(".config a").live('click', function(e) {
		app.showConfig();
		e.preventDefault();
	});

	$(".refresh a").live('click', function(e) {
		var btn = $(this), timer = true;
		btn.addClass("active");
		setTimeout(function(){timer = false; btn.removeClass("active");}, 1000);
		app.refresh(function(){if(!timer){btn.removeClass("active");}});
		e.preventDefault();
	});

});

