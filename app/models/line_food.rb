class LineFood<AplicationRecord
  belongs_to :food
  belongs_to :restaurant
  belongs_to :order,optional: true

  validates :count, numericality: {greater_than: 0}

  scope :activem -> {where(active: true)}
  scope :other_restaurant,->(picked_restaurant_id){where.not(restaurant_id: picked_restaurant_id)}

  def total_amount
    food.price*count
  end
end