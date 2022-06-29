import Sequelize, { Model } from 'sequelize';

import rawSequelize from '../../database/rawConnection';

class Recipes extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

Recipes.list = async () => {
  const results = await rawSequelize.query(
    `SELECT 
    R.id as recipe_id,
    R.name,
    P.id as product_id,
    P.product,
    P.description,
    B.name as brand,
    PR.amount as amount,
    U.name as unit
    FROM products_per_recipes PR
    LEFT JOIN recipes R  ON R.id = PR.recipe_id
    LEFT JOIN products P  ON PR.product_id = P.id
    LEFT JOIN brands B ON P.brand_id = B.id
    LEFT JOIN units U ON P.unit_id = U.id;`
  );
  return results[0];
};

Recipes.listByID = async (id) => {
  const results = await rawSequelize.query(
    `SELECT 
    R.id as recipe_id,
    R.name,
    P.id as product_id,
    P.product,
    P.description,
    B.name as brand,
    PR.amount as amount,
    U.name as unit
    FROM products_per_recipes PR
    LEFT JOIN recipes R  ON R.id = PR.recipe_id
    LEFT JOIN products P  ON PR.product_id = P.id
    LEFT JOIN brands B ON P.brand_id = B.id
    LEFT JOIN units U ON P.unit_id = U.id
    WHERE R.id = ${id};`
  );
  return results[0];
};

export default Recipes;
