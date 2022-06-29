import * as Yup from 'yup';
import { parseISO } from 'date-fns';
import Purchase from '../models/Purchase';
import Market from '../models/Market';
import ProductsPerPurchase from '../models/ProductsPerPurchase';
import Response from '../../libs/response';
import ResponseError from '../../libs/response-error';

class PurchaseController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        market_id: Yup.number().required(),
        date: Yup.string().required(),
        obs: Yup.string(),
        products: Yup.array()
          .of(
            Yup.object().shape({
              id: Yup.number().required(),
              amount: Yup.number().required(),
            })
          )
          .required(),
      });
      if (!(await schema.isValid(req.body))) {
        return res.json(
          new ResponseError(
            'Erro ao validar informações obrigatórias',
            'Falha na validação ao tentar criar uma compra.'
          )
        );
      }

      // Validar se o mercado existe

      const marketExists = await Market.findOne({
        where: { id: req.body.market_id },
      });

      if (!marketExists) {
        return res.json(
          new ResponseError(
            'Mercado informado não possui cadastro',
            'Falha ao tentar criar nova compra.'
          )
        );
      }

      // Criar receita

      const { id } = await Purchase.create({
        market_id: req.body.market_id,
        date: parseISO(req.body.date),
        obs: req.body.obs,
      });

      // Validar listagem de produtos
      Promise.all(
        req.body.products.map(async (product) => {
          await ProductsPerPurchase.create({
            product_id: product.id,
            amount: product.amount,
            purchase_id: id,
          });
        })
      );

      return res.json(
        new Response({
          message: 'Compra cadastrada com sucesso!',
          id,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(
          `Erro: ${error}`,
          'Falha ao tentar criar nova receita.'
        )
      );
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        products: Yup.array()
          .of(
            Yup.object().shape({
              id: Yup.number().required(),
              amount: Yup.number().required(),
            })
          )
          .required(),
      });
      if (!(await schema.isValid(req.body))) {
        return res.json(
          new ResponseError(
            'Erro ao validar informações obrigatórias',
            'Falha na validação ao tentar atualizar uma receita.'
          )
        );
      }

      const recipeExists = await Recipe.findOne({
        where: { id: req.params.id },
      });

      if (!recipeExists) {
        return res.json(
          new ResponseError(
            'Receita informado não existe',
            'Falha ao tentar editar receita.'
          )
        );
      }

      // deletar produtos
      await ProductsPerRecipe.destroy({
        where: {
          recipe_id: req.params.id,
        },
      });

      // salvar nova lista de produtos
      Promise.all(
        req.body.products.map(async (product) => {
          await ProductsPerRecipe.create({
            product_id: product.id,
            amount: product.amount,
            recipe_id: req.params.id,
          });
        })
      );

      return res.json(
        new Response({
          message: 'Receita editada com sucesso',
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(
          `Erro: ${error}`,
          'Falha ao tentar atualizar receita.'
        )
      );
    }
  }

  async delete(req, res) {
    try {
      const schema = Yup.object().shape({
        id: Yup.string().required(),
      });
      if (!(await schema.isValid(req.params))) {
        return res.json(
          new ResponseError(
            'Erro ao validar informações obrigatórias',
            'Falha na validação ao deletar uma receita.'
          )
        );
      }

      const recipe = await Recipe.findOne({ where: { id: req.params.id } });

      if (!recipe) {
        return res.json(
          new ResponseError(
            'Id da receita informado não existe.',
            'Falha na validação ao tentar deletar uma receita.'
          )
        );
      }

      await Recipe.destroy({ where: { id: req.params.id } });

      // deletar produtos
      await ProductsPerRecipe.destroy({
        where: {
          recipe_id: req.params.id,
        },
      });

      return res.json(
        new Response({
          message: 'Receita deletada com sucesso',
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar deletar receita.')
      );
    }
  }

  async list(req, res) {
    try {
      const recipes = await Recipe.list();

      let recipesGrouped = [];
      recipes.forEach((recipe) => {
        const findInList = recipesGrouped.find(
          (item) => item.recipe_id === recipe.recipe_id
        );
        if (findInList) {
          recipesGrouped = recipesGrouped.map((recipeItem) => {
            if (recipeItem.recipe_id === recipe.recipe_id) {
              return {
                ...recipeItem,
                products: [
                  ...recipeItem.products,
                  {
                    product_id: recipe.product_id,
                    product: recipe.product,
                    description: recipe.description,
                    brand: recipe.brand,
                    amount: recipe.amount,
                    unit: recipe.unit,
                  },
                ],
              };
            }
            return recipeItem;
          });
        } else {
          recipesGrouped.push({
            recipe_id: recipe.recipe_id,
            name: recipe.name,
            products: [
              {
                product_id: recipe.product_id,
                product: recipe.product,
                description: recipe.description,
                brand: recipe.brand,
                amount: recipe.amount,
                unit: recipe.unit,
              },
            ],
          });
        }
      });

      return res.json(
        new Response({
          recipes: recipesGrouped,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar listar receitas.')
      );
    }
  }

  async detail(req, res) {
    try {
      const recipe = await Recipe.listByID(req.params.id);
      if (!recipe.length) {
        return res.json(
          new ResponseError(
            'Id da receita informado não existe.',
            'Falha na validação ao tentar listar uma receita.'
          )
        );
      }

      const products = [];
      recipe.forEach((item) => {
        products.push({
          product_id: item.product_id,
          product: item.product,
          description: item.description,
          brand: item.brand,
          amount: item.amount,
          unit: item.unit,
        });
      });

      return res.json(
        new Response({
          recipe: {
            recipe_id: recipe[0].recipe_id,
            name: recipe[0].name,
            products,
          },
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar listar receitas.')
      );
    }
  }
}

export default new PurchaseController();
