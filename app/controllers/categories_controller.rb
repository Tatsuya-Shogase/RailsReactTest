class CategoriesController < ApplicationController
    before_action :check_admin, except: [:index]

    def index
        @category = Category.all.left_joins(:post).group(:id).select('categories.*, COUNT(`posts`.`id`) AS posts_count')
        render json: @category
    end
    def create
        @category = Category.create(name: params[:category])
        render json: @category
    end
    def update
        @category = Category.find(params[:id])
        @category.update(name: params[:category])
        @category = Category.all.left_joins(:post).group(:id).select('categories.*, COUNT(`posts`.`id`) AS posts_count').find(params[:id])
        render json: @category
    end
    def destroy
        @category = Category.find(params[:id])
        if @category.destroy
            head :no_content, status: :ok
        else
            render json: @category.errors, status: :unprocessable_entity
        end
    end

end
