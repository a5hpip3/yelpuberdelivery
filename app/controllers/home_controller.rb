class HomeController < ApplicationController
  
  def index
  	
  end

  def search
    parameters = { term: params[:term], limit: 16 }
    coordinates = { latitude: params[:coord_lat], longitude: params[:coord_lng] }
    render json: Yelp.client.search_by_coordinates(coordinates, parameters)
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
  		response = Unirest.post @uri, headers:{ "Content-Type": "application/json", "Authorization": "Bearer #{@user.token}"}, parameters:{"start_latitude" => startlat, "start_longitude" => startlng, "end_latitude" => endlat, "end_longitude" => endlng} 
  		render :json => response.body
  	else
  		redirect_to ("/login")
  	end
  end

  
end
