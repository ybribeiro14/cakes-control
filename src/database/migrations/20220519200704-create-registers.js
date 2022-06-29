module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('registers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      purchase_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      delivered_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('registers');
  },
};
