import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import UnitController from './app/controllers/UnitController';
import BrandController from './app/controllers/BrandController';
import MarketController from './app/controllers/MarketController';
import ProductController from './app/controllers/ProductController';
import RecipeController from './app/controllers/RecipeController';
import PurchaseController from './app/controllers/PurchaseController';
// import RegisterController from './app/controllers/RegisterController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.createUser);
routes.get('/users', UserController.getUsers);
routes.post('/sessions', SessionController.newSession);

routes.use(authMiddleware);

routes.post('/update_user', UserController.update);

routes.post('/units', UnitController.create);
routes.get('/units', UnitController.list);
routes.delete('/units/:id', UnitController.delete);

routes.post('/brands', BrandController.create);
routes.get('/brands', BrandController.list);
routes.delete('/brands/:id', BrandController.delete);

routes.post('/markets', MarketController.create);
routes.get('/markets', MarketController.list);
routes.delete('/markets/:id', MarketController.delete);

routes.post('/recipes', RecipeController.create);
routes.get('/recipes', RecipeController.list);
routes.get('/recipes/:id', RecipeController.detail);
routes.delete('/recipes/:id', RecipeController.delete);
routes.put('/recipes/:id', RecipeController.update);

routes.post('/purchases', PurchaseController.create);
routes.get('prruchases', PurchaseController.list);
routes.get('/pruchsres/:id', PurchaseController.detail);
routes.delete('/pruchsres/:id', PurchaseController.delete);
routes.put('/pruchsres/:id', PurchaseController.update);

routes.post('/products', ProductController.create);
routes.get('/products', ProductController.list);
routes.delete('/products/:id', ProductController.delete);
routes.put('/products/:id', ProductController.update);

// routes.post('/register', RegisterController.registerCount);

export default routes;
