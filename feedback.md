#### Feedback on the Uber API ####

# Rails Oauth authentication

The documentation to authenticate with Rails is quite minimal. Besides the endpoints and curl statements, there really isn't much guidance for the developer. 

Example: headers and parameters to send, scopes to request.

Python is documented well and the tutorial allows a developer to get up and running very quickly. It would be nice to have a tutorial on Rails Uber authentication to get the user going. 

I ended up using an Oauth Uber strategy, and once configured properly was able to get the authentication system going. However, after getting everything up and running it turned out that the "request" scope was unavailable. Due to this reason, I was unable to get a user to actually make a request to Uber and dispatch a vehicle. I did figure out how to fix this issue using NetHttp requests, however, this protocol is old and cumbersome. 

Multiple end locations for ride - It would be very useful, in my opinion, if there was a way of having an Uber pickup/dropoff at multiple locations in one ride. An idea I was toying with earlier would use this concept to create an UberTour around a city of all the best locations. This would be really convenient for tourists - call a tour on demand. 


# CORS communication from Javascript

The API reference page mentions the support for CORS for communicating with Javascript. There's even a little bit of code snippet to create an XMLHttpRequest. However, when trying to run an XMLHttpRequest for a price estimate using this method, I got a "No 'Access-Control-Allow-Origin' header is present on the requested resource." error. XHR code that I wrote is below:

	var xhr = new XMLHttpRequest();
  	var params = "start_latitude=" + lat + "&start_longitude=" + lng + "&end_latitude=" + userLat + "&end_longitude=" + userLng
  	var url = "https://api.uber.com/v1/estimates/price"
  	xhr.open('GET', url+"?"+params, true);
  	xhr.setRequestHeader("Authorization", "Token" + uberServerToken);
  	xhr.onreadystatechange = function() {

  			/// Do something with xhr.responseText

  	}

After multiple attempts to get the data, I finally switched to doing a server side call - this is better anyways. 


I would look into why this error is happening, specially considering that the code snippet comes directly from the api-reference website: https://developer.uber.com/v1/api-reference/  Also, setRequestHeader must be after connection has been Opened, not before. 



