class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :uid, null: false
      t.string :name
      t.string :email
      t.string :token
      t.timestamps
      
    end
  end
end
