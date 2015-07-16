# "BringItToMe" - A Yelp & Uber powered food delivery system.

To install and run the app, clone the repository, download and install rvm+ruby-gems, then run bundle install. Once complete, make sure to export environment vairables for API keys as listed below:

### API Keys

API keys are set and used from environment variables.

YELP:

	YELP_CONSUMER_KEY 	
	YELP_CONSUMER_SECRET
	YELP_TOKEN   		
	YELP_TOKEN_SECRET	

GOOGLE MAPS:

 	GOOGLE_MAPS			

UBER:

	uberClientId 		
	uberServerToken 	
	uberClientSecret	


#### Yelp

You'll need to register an account and get API keys from the [developer site](http://www.yelp.com/developers/getting_started/api_access).

#### Google Maps

You can get a Google Maps key from the [Google Developer Console](https://console.developers.google.com/). Enable the Geocoding API and Google Maps Javascript API v3 to get the map working.

#### Uber

You'll need to register an account on Uber developers and get API keys [developer site](https://developer.uber.com). Once you have set up an app on Uber, configure your origin and redirect urls. Redirect URL should be in the form (http://YOUR-SERVER/auth/uber/callback).

#### ``config/database.yml``

The database file is fairly empty and is set to work with a clean/default PostgreSQL installation.
Please do run a rake db:migrate to initiate user tables which are requried for authentication.

#### ``config/secrets.yml``

Every rails application employs a secret key to verify signed cookies. To keep people from using the same secret keys we've removed them here. You should generate new ones with ``rake secret`` before starting development.


### ToDo - improvements ###

Implement NetHttp requests for authentication and authorization. This will allow the right scope to be requested and let the user actually call a ride (currently non functional). 
	Extra credit: develop Oauth strategy further to include request scope. 

Add user profiles to track orders placed and dispatched, cancellations etc. Track profile data. 

Implement Ajax modal when clicked on a restaurant to allow user to:
	1) Order food directly through online ordering system (if available)
	2) Get time till order ready from online ordering system or have user enter time-till-ready manually. 

Instead of a manual call to Uber, implement an automatic Uber dispatch based on food order confirmation and time-till-ready.

Send push or sms notifications to user when Uber dispatched, and/or when Uber close by with order.


##### Credits

This app is built on top of this Yelp+Rails example: https://github.com/Yelp/yelp-rails-example
It utilizes the Yelp gem to make calls and get results from yelp. 

We use an Omniauth strategy gem for Uber: https://github.com/tmilewski/omniauth-uber
This gem is used for authentication in conjunction with Oauth2. The gem quickly builds a strategy for Uber authentication with Omniauth. 



