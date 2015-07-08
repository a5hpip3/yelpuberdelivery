class HomeController < ApplicationController
  def index
  end

  def search
    parameters = { term: params[:term], limit: 16 }
    coordinates = { latitude: params[:coord_lat], longitude: params[:coord_lng] }
    render json: Yelp.client.search_by_coordinates(coordinates, parameters)
  end
end
