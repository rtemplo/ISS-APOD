// var config = {
//   apiKey: "AIzaSyD9VMvEg1NjT1YI4-t4W_DUUE5I6T1JDrU",
//   authDomain: "isstracker-e210a.firebaseapp.com",
//   databaseURL: "https://isstracker-e210a.firebaseio.com",
//   projectId: "isstracker-e210a",
//   storageBucket: "",
//   messagingSenderId: "197740641033"
// };

// firebase.initializeApp(config);

var PROXIMITYJS = {
	const: 6371e3,
	//firebase related
	// functions: require(['firebase-functions']),
	// nodemailer: require(['nodemailer']),
	// servEmail: encodeURIComponent(functions.config().gmail.email),
	// gmailPassword: encodeURIComponent(functions.config().gmail.password),
	// mailTransport: nodemailer.createTransport('smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com'),
	//firebase related end
	userContact: {
		phone: null,
		email: "rutcampisstracker@gmail.com",
		distance: 1000,
		dType: "mi"
	},
	checkProx: function (){
		//1 = iss, 2 = user
		//RETURNS DISTANCE BETWEEN LOCATIONS IN *METERS*
		console.log("PROXIMITYJS checkProx Entered");
		var p1 = PROXIMITYJS.toRadians(issLatitude),
			p2 = PROXIMITYJS.toRadians(userLatitude),
			dlat = PROXIMITYJS.toRadians(userLatitude - issLatitude),
			dlong = PROXIMITYJS.toRadians(userLongitude - issLongitude);

		var a = Math.sin(dlat/2) * Math.sin(dlat/2) + 
						Math.cos(p1) * Math.cos(p2) * Math.sin(dlong/2) * Math.sin(dlong/2);

		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		var d = PROXIMITYJS.const * c;
		console.log(d);
		console.log("---------checkProx End-------------");
		return d;
	},
	toRadians: function(n){
		return (n*Math.PI)/180;
	},
	storeContact: function (){
		PROXIMITYJS.phone = "1-800-THIS-ISAPHONENUMBER";
		PROXIMITYJS.email = "getoffmylawn@gmail.com";
		PROXIMITYJS.distance = 1000;
		PROXIMITYJS.dType = "km";
	},
	distConv: function (){
		var temp;
		switch(PROXIMITYJS.userContact.dType){
			case (PROXIMITYJS.userContact.dType === "km"):
				temp = Math.round(checkProx() / 1000);
				return temp;
				break;
			case (PROXIMITYJS.userContact.dType === "mi"):
				temp = Math.round(checkProx() * 0.000621371192);
				return temp;
				break;
		}
	},
	sendMessage: function (){
		if (PROXIMITYJS.distConv() >= PROXIMITYJS.userContact.distance){
			alert("The ISS is close to you!");
		}
		//sparkpost related 
		// $.ajax({
		// 	url: "https://api.sparkpost.com/api/v1/transmissions",
		// 	method: "POST",
		// 	headers: {
		// 		"Content-type":'application/json',
		// 		"Authentication": '683043ea594acf8605a5478d677e2e48b273f6e8'
		// 	},
		// 	data: JSON.stringify({
		// 	    "options": {
		// 	      "sandbox": true
		// 	    },
		// 	    "content": {
		// 	      "from": "sandbox@sparkpostbox.com",
		// 	      "subject": "Thundercats are GO!!!",
		// 	      "text": "Sword of Omens, give me sight BEYOND sight"
		// 	    },
		// 	    "recipients": [{ "address": "kung.ge8@gmail.com" }]
		// 	})
		// });
		//sparkpost related end
		// I give up on firebase email
		// const mailOptions = {
		// 	from: 'ISSTracker <noreply@firebase.com>',
		// 	to: PROXIMITYJS.userContact.email,
		// 	subject: 'testing',
		// 	text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem tenetur dolor amet impedit, fugit explicabo obcaecati quos, optio architecto consequuntur non in magni similique minus nemo. Provident pariatur totam quaerat!'
		// }

		// return mailTransport.sendMail(mailOptions).then(() => {
		// 	console.log('Email sent!');
		// })
		//firebase related end
		// if(PROXIMITYJS.distConv() <= PROXIMITYJS.distance){
		// } else {
		// }
	}
}