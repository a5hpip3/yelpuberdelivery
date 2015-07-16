class SessionsController < ApplicationController

	def new
  	end

	def create
		begin
			@user = User.from_omniauth(request.env['omniauth.auth'])
			session[:user_id] = @user.id
			flash[:success] = "Welcome, #{@user.name}"
		rescue
			flash[:warning] = "Error authenticating.."
		end
		redirect_to root_path
	end


	def destroy
		if current_user
			session.delete(:user_id)
			flash[:success] = "Goodbye!"
		end
		redirect_to root_path
	end


	def failure
		render :text => "Sorry, but you need to allow access for this to work!"
  	end

	

end