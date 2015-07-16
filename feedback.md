#### Feedback on the Uber API ####

# Rails Oauth authentication

The documentation to authenticate with Rails is quite minimal. Besides the endpoints and curl statements, there really isn't much guidance for the developer. 

Example: headers and parameters to send, scopes to request.

Python is documented well and the tutorial allows a developer to get up and running very quickly. It would be nice to have a tutorial on Rails Uber authentication to get the user going. 

I ended up using an Oauth Uber strategy, and once configured properly was able to get the authentication system going. However, after getting everything up and running it turned out that the "request" scope was unavailable. Due to this reason, I was unable to get a user to actually make a request to Uber and dispatch a vehicle. I did figure out how to fix this issue using NetHttp requests, however, this protocol is old and cumbersome. 

Multiple end locations for ride - It would be very useful, in my opinion, if there was a way of having an Uber pickup/dropoff at multiple locations in one ride. An idea I was toying with earlier would use this concept to create an UberTour around a city of all the best locations. This would be really convenient for tourists - call a tour on demand. 

