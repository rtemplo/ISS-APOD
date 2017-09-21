// NASA Space Image of the Day
var key= "bbPOCharYjXyZCE7ZZ1BymfN7mCvprFB2nXIRSDq"
var myUrl = "https://api.nasa.gov/planetary/apod?api_key=" + key
$.ajax({
	url: myUrl,
	method: "GET"
}).done(function(response){
	var spaceImage = response.url;


	$("#nasaImage").attr("src",response.url);
	console.log(response.url);
});