class CategoriesController < ApplicationController
    before_action :check_admin, except: [:index]

    def store_posts_count()
        if @category.is_a?(Object)
            if @category.instance_of?(Category)
                @category.posts_count = Post.where(:category_id => @category.id).count
            else
                posts = Post.group(:category_id).count
                @category.each_with_index do |v, i|
                    post = posts.find { |m| m[0] == v.id }
                    @category[i].posts_count = post.is_a?(Array) ? post[1] : 0
                end
            end
        end
    end

    def index
        @category = Category.all
        store_posts_count()
        render json: @category, methods: :posts_count
    end

    def create
        @category = Category.create(name: params[:category])
        store_posts_count()
        if @category.valid?
            render json: @category, methods: :posts_count
        else
            render status: 400, json: { status: 400, message: 'Bad Request' }
        end
    end

    def update
        @category = Category.find(params[:id])
        @category.update(name: params[:category])
        store_posts_count()
        if @category.valid?
            render json: @category, methods: :posts_count
        else
            render status: 400, json: { status: 400, message: 'Bad Request' }
        end
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
