class Post < ApplicationRecord
  belongs_to :category

  VALID_EMAIL_REGEX = /\A[\w\-._]+@[\w\-._]+\.[A-Za-z]+\z/
  validates :text, presence: true, on: :create
  validates :mail, format: { with: VALID_EMAIL_REGEX }, allow_blank: true, on: :create
end
