import Sequelize, { Model } from 'sequelize';

class Register extends Model {
  static init(sequelize) {
    super.init(
      {
        id_product: Sequelize.INTEGER,
        id_user: Sequelize.INTEGER,
        type: Sequelize.STRING,
        amount: Sequelize.STRING,
        date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Register;
