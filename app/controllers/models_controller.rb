class ModelsController < ApplicationController
  before_action :require_user, :has_customer_privillege?
  protect_from_forgery with: :null_session
  def index
    @models = Model.where share: true
  end
  def my_models
    @models = Model.where user_id: @current_user.id
  end
  def new
    @upload = Model.new
  end
  def create
    @upload = Model.new(get_model_data)
    @upload.share = get_share_option
    @upload.user_id = @current_user.id
    if @upload.save!
      redirect_to controller: "orders", action: "new", model: "#{ @upload.id }"
    else
      redirect_to '/upload'
    end
  end
  private
  def get_model_data
    params.require(:upload).permit(:model)
  end
  def get_share_option
    params.require(:upload).permit(:share)
  end
end
