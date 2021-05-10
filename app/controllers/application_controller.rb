class ApplicationController < ActionController::API
  # SPAっぽい動きをさせるためにロードを加える
  before_action :fake_load
  def fake_load
    sleep(1)
  end
end
