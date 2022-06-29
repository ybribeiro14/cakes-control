import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        ean: Sequelize.STRING(14),
        product: Sequelize.STRING,
        description: Sequelize.STRING,
        brand_id: Sequelize.INTEGER,
        unit_id: Sequelize.INTEGER,
        deleted: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Product;
