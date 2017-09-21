var userLocInput;

var issLatitude = 0;
var issLongitude = 0;

var userLatitude = 0;
var userLongitude = 0;

var isUserAddress = false;

var issPassTimes;


function findISS(){
	$.ajax({
		url: "https://open-notify-proxy.herokuapp.com/",
		method: "GET",
		dataType: "json"
	}).done(function(response){

		issLatitude = parseFloat(response.iss_position.latitude);
		issLongitude = parseFloat(response.iss_position.longitude);

		if (isUserAddress) {
			initUserMap();
		} else{
			initMap();
		}
	});
};

function writePassTimes(key, dateDisp, dur, w_cond, d_cond) {
	$("#passTimeRow").append('<tr class="pt-row" id="pt_'+key+'"><td>'+dateDisp+'</td><td>'+dur+'</td><td>'+w_cond+'</td><td>'+d_cond+'</td></tr>');
}

var passTimesObj = [];
var pt_Promises = [];

function findISSPasses(){
	var n = 100
	var myUrl = "https://open-notify-proxy.herokuapp.com/iss-pass.json?lat=" + userLatitude + "&lon=" + userLongitude + "&n=" + n;

	passTimesObj = [];
	$("#passTimeRow").empty();
	
	//Find ISS passes
	$.ajax({
		url: myUrl,
		method: "GET",
		dataType: "json"
	}).done(function(response){

		issPassTimes = SORTS.lowToHigh((SORTS.highToLow(response.response).slice(0,5)));
		var riseTime;
		
		//load ISS pass times to table for display
		for (var i = 0; i < issPassTimes.length; i++) {
			riseTime = issPassTimes[i].risetime;
			
			//Get Sunset and Sunrise Data for User Location
			var timezoneUrl = "https://maps.googleapis.com/maps/api/timezone/json?location=" + userLatitude + "," + userLongitude + "&timestamp=" + riseTime + "&key=AIzaSyBuWbn6QuWQ6-CsQN6N_0hpkmTGXJQooAg";
			var totalOffset = 0

			var request = $.ajax({
				url: timezoneUrl,
				method: "GET",
				dataType: "json",
				myKey: i
			}).done(function(response){
				var outerAJAXKey = this.myKey;
				//obtain the UTC offset from google timezones
				var finalTime = issPassTimes[outerAJAXKey].risetime + response.rawOffset + response.dstOffset
				var passOverTime = moment.unix(finalTime).format("MMMM Do YYYY, h:mm:ss a");
				
				//calculate total offset from UTC from daylight savings time and timezone
				totalOffset = response.rawOffset + response.dstOffset
				
//				console.log("Total Offset: "+totalOffset)
//				//passover time in UTC
//				console.log("Pass Over Time: " + moment.unix(riseTime).format("MMMM Do YYYY, h:mm:ss a"));
//				//passover time in local time
//				console.log("Pass Over Time Modified by Timezone: " + moment.unix(finalTime).format("MMMM Do YYYY, h:mm:ss a"));
				
				passTimesObj.push({key:outerAJAXKey, date:passOverTime, duration:issPassTimes[outerAJAXKey].duration, weather:"####", daylight: "$$$$"});
								
				//Get Sunset and Sunrise Data for User Location
				var year = moment.unix(finalTime).format("YYYY")
				var month = moment.unix(finalTime).format("MM")
				var day = moment.unix(finalTime).format("DD")

				var sunsetDate = year + "-" + month + "-" + day
				var sunsetUrl = "https://api.sunrise-sunset.org/json?lat=" + userLatitude +"&lng=" + userLongitude +"&date="+ sunsetDate + "&callback=mycallback";

				$.ajax({
					url: sunsetUrl,
					method: "GET",
					dataType: "jsonp",
					myKey2: outerAJAXKey
				}).done(function(response){
					//console.log("Twilight Begin UTC: " + response.results.astronomical_twilight_begin);

					var ts_begin = moment(sunsetDate + ", " + response.results.astronomical_twilight_begin, "YYYY-MM-DD, h:mm:ss a").valueOf();
					var sunRiseTimeStamp = moment(ts_begin)/1000;

					//console.log("sunRiseTimeStamp: " + sunRiseTimeStamp);
					//console.log("sunRiseTimeStamp Datetime: " + moment.unix(sunRiseTimeStamp).format("YYYY-MM-DD, h:mm:ss a"));

					var adjustedSunRiseTimeStamp = sunRiseTimeStamp + totalOffset;
					//console.log("adjustedSunRiseTimeStamp: " + adjustedSunRiseTimeStamp);
					//console.log("adjustedSunRiseTimeStamp Datetime: " + moment.unix(adjustedSunRiseTimeStamp).format("YYYY-MM-DD, hh:mm:ss a"));

					var ts_end = moment(sunsetDate + ", " + response.results.astronomical_twilight_end, "YYYY-MM-DD, h:mm:ss a").valueOf();
					var sunSetTimeStamp = moment(ts_end)/1000;
					var adjustedSunSetTimeStamp = sunSetTimeStamp + totalOffset;

					if ((finalTime > adjustedSunRiseTimeStamp) && (finalTime < adjustedSunSetTimeStamp)) {
						$("#pt_"+this.myKey2 +" td:nth-child(4)").html("Day");
					} else{
						$("#pt_"+this.myKey2 +" td:nth-child(4)").html("Night");
					}				
				
				});				
				
				
				
			});
			
			pt_Promises.push(request);

			
			
		} //end for
		
		//pt_Promises
		//This is a simpler version which doesn't check to see whether the promise was resolved or rejected 
		$.when.apply(null, pt_Promises).done(function(){
			//console.log("passTimesObj: " + passTimesObj);
			
			var reSort = function (val1, val2) {
				//just change the < symbol to > to sort in reverse
				if (val1.key < val2.key) {
					return -1;
				} else {
					return 1;
				}
			}
			
			passTimesObj.sort(reSort);
			
			for (var i=0; i < passTimesObj.length; i++) {
				writePassTimes(passTimesObj[i].key, passTimesObj[i].date, passTimesObj[i].duration, passTimesObj[i].weather, passTimesObj[i].daylight);
				WEATHERJS.isClear(passTimesObj[i].key);
			}
			
			
		});		
		
	});//outermost done


	
};

//find ISS location at time interval
setInterval(findISS, 100000);

//find ISS location on start
findISS();



function initMap() {
	
	var locationISS = {lat: issLatitude, lng: issLongitude};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 3,
		mapTypeId: 'hybrid',
		center: locationISS
	});
	
	var marker2 = new google.maps.Marker({
		position: locationISS,
		map: map
	});
}

function initUserMap() {
	var locationUser = {lat: userLatitude, lng: userLongitude};
	var locationISS = {lat: issLatitude, lng: issLongitude};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 5,
		mapTypeId: 'hybrid',
		center: locationUser
	});
	var marker = new google.maps.Marker({
		position: locationUser,
		map: map
	});
	
	var marker2 = new google.maps.Marker({
		position: locationISS,
		map: map
	});
}

$(document).on("click", "#weatherSubmit", getAddressLocation);

function getAddressLocation(){
	$("#iss").show();
	$("#eonet").hide();
	
	event.preventDefault();
	
	userLocInput = $("#input-address").val().trim();
	
	$.ajax({
		url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + userLocInput +"&key=AIzaSyBuWbn6QuWQ6-CsQN6N_0hpkmTGXJQooAg",
		method: "GET"
	}).done(function(response){

		userLatitude = response.results[0].geometry.location.lat;
		userLongitude = response.results[0].geometry.location.lng;

		initUserMap();
		findISSPasses();

		isUserAddress = true;

		WEATHERJS.searchWeather(userLocInput);
	});
};

