var SORTS = {
	highToLow: function(array){
		//sort a PASS TIME RESPONSE ARRAY BASED ON DURATIONfrom highest duration to lowest
		// console.log("HIGHSORT ENTER");
		if(array.length <2) {
			// console.log(array);
			return array;
		}

		var pivot = array[0].duration,
				lesser = [],
				greater = [];

		for(var i=1; i < array.length; i++) {
			if(array[i].duration > pivot){
				lesser.push(array[i]);
			} else {
				greater.push(array[i]);
			}
		}

		return SORTS.highToLow(lesser).concat(array[0], SORTS.highToLow(greater));
	},
	lowToHigh: function(array){
		//sort a PASS TIME RESPONSE ARRAY BASED ON RISETIME nearest to furthest
		// console.log("LOWSORT ENTER");
		if(array.length <2) {
			// console.log(array);
			return array;
		}

		var pivot = array[0].risetime,
				lesser = [],
				greater = [];

		for(var i=1; i < array.length; i++) {
			if(array[i].risetime < pivot){
				lesser.push(array[i]);
			} else {
				greater.push(array[i]);
			}
		}

		return SORTS.lowToHigh(lesser).concat(array[0], SORTS.lowToHigh(greater));
	}
}