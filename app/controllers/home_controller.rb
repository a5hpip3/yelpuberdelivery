class HomeController < ApplicationController
  
  def index
  	
  end

  def search
    parameters = { term: params[:term], limit: 16 }
    coordinates = { latitude: params[:coord_lat], longitude: params[:coord_lng] }
    render json: Yelp.client.search_by_coordinates(coordinates, parameters)
  end

  def getest
  	@uberServerToken = "DLJgLTxr89OWSKRD9sAxhZH9uWaYzqF0rM9u3Ng2"
  	lat = params[:startlat]
    lng = params[:startlng]
    userLat = params[:endlat]
    userLng = params[:endlng]
    @url = "https://api.uber.com/v1/estimates/price?start_latitude=#{lat}&start_longitude=#{lng}&end_latitude=#{userLat}&end_longitude=#{userLng}"
    result = Unirest.get @url, headers: {'Authorization' => "Token #{@uberServerToken}"}
  	render :json => result.raw_body
  end

  def makereq
  	startlat = params[:startlat]
  	startlng = params[:startlng]
  	endlat = params[:endlat]
  	endlng = params[:endlng]
  	prod_id = params[:prodid]

  	if current_user
  		@user = current_user
  		@token = "Authorization: Bearer #{@user.token}"
  		@uri = "https://sandbox-api.uber.com/v1/requests"
  		response = Unirest.post @uri, headers:{ "Accept" => "application/json", "Authorization" => "Bearer #{@user.token}"}, parameters:{"start_latitude" => startlat, "start_longitude" => startlng, "end_latitude" => endlat, "end_longitude" => endlng} 
  		render :json => response.body
  	else
  		redirect_to ("/login")
  	end
  end

  
end
