import Sequelize from 'sequelize';
import databaseConfig from '../../config/database';

const rawSequelize = new Sequelize(databaseConfig);

export default rawSequelize;
