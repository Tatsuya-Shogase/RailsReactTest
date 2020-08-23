class PostsController < ApplicationController
    before_action :cookie_check, except: [:update]

    def cookie_check
        if cookies[:session_id].nil? then
            cookies.permanent[:session_id] = session[:session_id]
        elsif !Post.find_by(session_id: Digest::MD5.hexdigest(cookies[:session_id])) then
            cookies.permanent[:session_id] = session[:session_id]
        end
    end

    def index
        @posts = Post.where(:category_id => params[:category_id]).all
        @session_id = Digest::MD5.hexdigest(cookies[:session_id])
        render json: {posts: @posts, session_id: @session_id}
    end

    def create
        @post = Post.create(
            session_id: Digest::MD5.hexdigest(cookies[:session_id]),
            name: params[:name],
            mail: params[:mail],
            subject: params[:subject],
            text: params[:text],
            visible: true,
            category_id: params[:category_id],
            admin: params[:admin],
        )
        render json: @post
    end

    def update
        @post = Post.find(params[:id])
        @post.update(visible: false)
        render json: @post
    end

end
