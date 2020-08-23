Rails.application.routes.draw do
    resources :categories do
        resources :posts
    end

    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/logged_in', to: 'sessions#is_logged_in?'

    resources :users, only: [:create]
end
