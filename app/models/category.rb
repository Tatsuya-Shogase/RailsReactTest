class Category < ApplicationRecord
    has_many :post, dependent: :destroy
    attr_accessor :posts_count
    validates :name, presence: true
end
