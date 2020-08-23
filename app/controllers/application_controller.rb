class ApplicationController < ActionController::API
    include ActionController::Cookies
    helper_method :login!, :logged_in?, :check_admin, :current_user, :authorized_user?, :logout!

    def login!
        session[:user_id] = @user.id
    end

    def logged_in?
        !!session[:user_id]
    end

    def check_admin
        if logged_in?
            @admin = User.find(session[:user_id])
            unless @admin.admin
                head :unauthorized
                return false
            end
        else
            head :unauthorized
            return false
        end
    end

    def current_user
        @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end

    def authorized_user?
        @user == current_user
    end

    def logout!
        session.clear
    end
end
