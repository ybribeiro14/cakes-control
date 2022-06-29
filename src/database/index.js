import Sequelize from 'sequelize';

import User from '../app/models/User';
import Register from '../app/models/Register';
import Product from '../app/models/Product';
import Unit from '../app/models/Unit';
import Market from '../app/models/Market';
import Brand from '../app/models/Brand';
import Recipe from '../app/models/Recipe';
import ProductsPerRecipe from '../app/models/ProductsPerRecipe';
import Purchase from '../app/models/Purchase';
import ProductsPerPurchase from '../app/models/ProductsPerPurchase';

import databaseConfig from '../config/database';

const models = [
  User,
  Register,
  Product,
  Unit,
  Market,
  Brand,
  Recipe,
  ProductsPerRecipe,
  Purchase,
  ProductsPerPurchase,
]; // Array com todos os models da aplicação

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
    // .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
