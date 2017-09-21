var WEATHERJS = {
	APIkey: "fa89ff476fdecb19b7416bfaf4fcf6e1",
	searchWeather: function(address){
		var temp = "https://api.openweathermap.org/data/2.5/weather?q=" + address + "&appid=" + WEATHERJS.APIkey;
		//console.log(temp);
		$.ajax({
			url: temp,
			method: "GET"
		}).done(function(re){
			//console.log(re);
			$("#weatherWrite").html(re.main.temp + "<br>" +
															re.visibility + "<br>" +
															re.clouds.all);
		});
	},
	setClearIcon: function(){

	},
	isClear: function (key){
		var temp = "https://api.openweathermap.org/data/2.5/forecast?q=" + userLocInput + "&appid=" + WEATHERJS.APIkey;
		$.ajax({
			url: temp,
			method: "GET",
			key: key
		}).done(function(re){
			var temp = 9999999999, temp2, closest;
			
			for(let i = 0; i < re.list.length; i++){
				temp2 = Math.abs(issPassTimes[this.key].risetime - parseInt(re.list[i].dt));
				if (temp2 < temp){
					temp = temp2;
					//console.log(re.list[i]);
					closest = re.list[i];
				}
			}
						
			if(closest.weather[0].main === 'Clear'){
				//console.log("Show clear icon");
				$("#pt_" + this.key + " td:nth-child(3)").text("CLEAR SKIES");
			} else {
				//console.log("Hide clear icon");
				$("#pt_" + this.key + " td:nth-child(3)").text("NOT CLEAR SKIES");
			}

			//write closest to table row
			$("#pt_"+this.key).data("fcast", closest);
		});
	},
	writeWeather: function(event){
		//console.log(event);
		//console.log(this);
		let obj = $(this).data("fcast");
		//console.log(obj);
		$("#weather-icon-display").addClass("owi owi-10x owi-" + obj.weather[0].icon);
		$("#temp-display").text((obj.main.temp * (9/5) - 459.67).toFixed(2) + "F");
		//$("#weather-text-display").text(obj.weather[0].main);
		$("#weather-desc-display").text(obj.weather[0].description);
		$("#precip-chance-display").text((isNaN(obj.rain))?"NA":(obj.rain * 100).toString() + "%");
		$("#humidity-display").text(obj.main.humidity);
		$("#wind-speed-display").text(obj.wind.speed + "mph");
	}

}

//WEATHERJS.getForecast("london", 1506122908);
// WEATHERJS.isClear("capetown", 1506122908);