class CreatePosts < ActiveRecord::Migration[6.0]
  def change
    create_table :posts do |t|
      t.string :session_id, null: false
      t.string :name
      t.string :mail
      t.string :subject
      t.text :text, null: false
      t.boolean :visible
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
