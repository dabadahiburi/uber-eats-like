module Api
  module V1
    class LineFoodsController<ApplicationController
      before_action :set_food, only: %i[create replace]


        def index
          #food取得
          line_foods=LineFood.active
          #データが存在するか真偽をかける
          if line_foods.exists?
            #ある場合
            render json: {
              line_food_ids: line_foods.map{|line_food| line_food_id},
              restaurant: line_foods[0].restaurant,
              count: line_foods.sum{|line_food| line_food[:count]},
              amount:line_foods.sum{|linefood| line_food.total_amount}.
            },status: :ok
          else
            remder json: {}, status: :no_count
          end
        end


        def create
          #例外パターン
          if LineFood.active.other_restaurant(ordered_food.restaurant.id).exusts?
            return render json: {
              existing_restaurant:LineFood.other_restaurant(@ordered_food.restaurant.id).first.restaurant.name,
              new_restaurant:Food.find(params[:food_id]).restaurant.name,
            }, status: :not_acceptable
          end
          #food注文生成
          set_line_food(@ordered_food)

          if @line_food.save
            render json: {
              line_food: @line_food
            },status: :created
          else
            render json: {},status: :internal_server_erroor
          end
        end


        def replace
          LineFood.active.other_restaurant(@ordered_food,restaurant.id).each do |line_food|
            line_food.update_attribute(:active,false)
          end

          set_line_food(@ordered_food)
          #foodの生成、保存
          if @line_food.save
            render json: {
              line_food: @line_food
            }, status: :created
          else
            render json: {}, status: :internal_server_error
          end
        end


        privete

        def set_food
          @ordered_food=Food.find(params[:food_id])
        end

        def set_line_food(orderd_food)
          if orderd_food.line_food.present?
            @line_food=ordered_food.line_food
            @line_food.attributes={
              count: ordered_food.line_food.count+params[:count],
              active: true
            }
          else
            @line_food=ordered_food.build_line_food(
              count: params[:count],
              restaurant: orderd_food.restaurant,
              active: true
            )
          end
        end
    end
  end
end