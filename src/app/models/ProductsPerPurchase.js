import Sequelize, { Model } from 'sequelize';

class ProductsPerPurchase extends Model {
  static init(sequelize) {
    super.init(
      {
        product_id: Sequelize.INTEGER,
        purchase_id: Sequelize.INTEGER,
        amount: Sequelize.NUMBER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default ProductsPerPurchase;
