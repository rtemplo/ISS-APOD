// JavaScript Document
var imageInterval, imageIdx;
var NASA_key= "bbPOCharYjXyZCE7ZZ1BymfN7mCvprFB2nXIRSDq"
var NASA_API_URL = "https://api.nasa.gov/planetary/apod?api_key=" + NASA_key;
var promises = [];
var imageArr = [];

function setBackground(imgsrc) {
	$("#iodModal").modal('hide');
	$(".main").css('background-image', 'url('+imgsrc+')');
}

function autoRotateIOD() {
	imageInterval = setInterval(rotateBackground, 10000);
}

function pauseIODRotation() {
	clearInterval(imageInterval);
}

function rotateBackground() {
	if (imageIdx === undefined || imageIdx === imageArr.length) {
		imageIdx = 0;
	} else {
		imageIdx++;
		setBackground(imageArr[imageIdx].imgURL);
	}
}

$(function() {
	$("#datepicker").datepicker({
		changeMonth:true,
		dateFormat: "yy-mm-dd",
		maxDate: 0,
		onSelect: function(date) {
			var requestURL = NASA_API_URL + "&date=" + date;
			requestImage(requestURL).done(function (response) {
				pauseIODRotation();
				setBackground(response.url);
			});
        }
	});
});

$("#locEntryForm").submit(function(event){
	event.preventDefault();
	getAddressLocation();
}); 

function requestImage(reqUrl) {
	var reqObj = 	$.ajax({
						url: reqUrl,
						method: "GET",
						dataType: "json"
					});	
	return reqObj;
}

function loadAPODImages () {
	for (var i = 0; i < 8; i++) {

		var dateObj = moment().subtract(i, "days");
		var dayName = dateObj.format("dddd");
		var dateArg = dateObj.format("YYYY-MM-DD");

		imageArr.push({day:dayName, dateArg: dateArg, imgURL: ""});

		var requestURL = NASA_API_URL + "&date=" + dateArg;
		/* $.ajax returns a promise*/     

		var request = requestImage(requestURL);

	   	promises.push(request);
		
	}

	$.when.apply(null, $.map(promises, function(p) {
		return p.then(null, function() {
			return $.Deferred().resolveWith(this, arguments);
		});
	})).done(function(){
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			//console.log(arg[0].url);
			imageArr[i].imgURL = arg[0].url;
		}

		//Default Background image to current image of the day
		setBackground(imageArr[0].imgURL);

		//Generaye Image of the Day drop down menu list items
		build_IOD_DropDownMenu();
		autoRotateIOD();
	});
	
}

function build_IOD_DropDownMenu() {
	var ddList = $("#IOD-ddList");
	
	for (var x = imageArr.length - 1; x >= 0; x--) {
		var dayLabel = (x===0)?("Today"):(imageArr[x].day + " - " + imageArr[x].dateArg);
		ddList.prepend('<a class="dropdown-item iod-item" href="#" data-imgurl="'+imageArr[x].imgURL+'">'+dayLabel+'</a>');
	}
	
}

$(document).ready(function () {
	loadAPODImages();
	
	$(document).on("click", ".iod-item", function (e) {
		e.preventDefault();
		
		$("#selected-iod").attr("src", $(this).attr("data-imgurl"));
		$("#iodModal").modal('show');
		
	});
	
	$("#selected-iod").on("click", function () {
		pauseIODRotation();
		setBackground($(this).attr("src"));
	});
	
	$("#auto-play-iod").on("click", autoRotateIOD);
	
	$(document).on("click", ".pt-row", WEATHERJS.writeWeather);
});