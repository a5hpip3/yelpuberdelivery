class User < ActiveRecord::Base

	def self.from_omniauth(auth_hash)
		user = find_or_create_by(uid: auth_hash['uid'])
		user.name = auth_hash['info']['name']
		user.email = auth_hash['info']['email']
		user.token = auth_hash['credentials']['token']
		user.save!
		user
	end

end
