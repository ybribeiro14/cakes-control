import Sequelize, { Model } from 'sequelize';

class ProductsPerRecipe extends Model {
  static init(sequelize) {
    super.init(
      {
        product_id: Sequelize.INTEGER,
        recipe_id: Sequelize.INTEGER,
        amount: Sequelize.NUMBER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default ProductsPerRecipe;
