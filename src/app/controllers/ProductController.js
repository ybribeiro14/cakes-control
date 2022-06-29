import * as Yup from 'yup';
import Product from '../models/Product';
import Brand from '../models/Brand';
import Unit from '../models/Unit';
import Response from '../../libs/response';
import ResponseError from '../../libs/response-error';

class ProductController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        product: Yup.string().required(),
        brand_id: Yup.number().required(),
        unit_id: Yup.number().required(),
        ean: Yup.string(14),
        description: Yup.string(),
      });
      if (!(await schema.isValid(req.body))) {
        return res.json(
          new ResponseError(
            'Erro ao validar informações obrigatórias',
            'Falha na validação.'
          )
        );
      }

      // check unit exist
      const unitExists = await Unit.findOne({
        where: { id: req.body.unit_id },
      });
      if (!unitExists) {
        return res.json(
          new ResponseError(
            'Unidade informada não existe',
            'Falha ao tentar criar novo produto.'
          )
        );
      }

      // check brand exist
      const brandExists = await Brand.findOne({
        where: { id: req.body.brand_id },
      });

      if (!brandExists) {
        return res.json(
          new ResponseError(
            'Marca informada não existe',
            'Falha ao tentar criar novo produto.'
          )
        );
      }

      const where = {
        product: req.body.product,
      };

      if (req.body.ean) {
        where.ean = req.body.ean;
      }

      const productExists = await Product.findOne({
        where,
      });

      if (productExists) {
        return res.json(
          new ResponseError(
            'Produto informado já possui cadastro',
            'Falha ao tentar criar novo produto.'
          )
        );
      }

      const { id, product, description, brand_id, unit_id } =
        await Product.create({ ...req.body, deleted: false });

      return res.json(
        new Response({
          id,
          product,
          description,
          brand_id,
          unit_id,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar criar um produto.')
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
            'Falha na validação ao tentar deletar um produto.'
          )
        );
      }

      const product = await Product.findOne({ where: { id: req.params.id } });

      if (!product) {
        return res.json(
          new ResponseError(
            'Id do produto informado não existe.',
            'Falha na validação ao tentar deletar um produto.'
          )
        );
      }

      await Product.update({ deleted: true }, { where: { id: req.params.id } });

      return res.json(
        new Response({
          message: 'Produto deletado com sucesso',
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(
          `Erro: ${error}`,
          'Falha ao tentar deletar um produto.'
        )
      );
    }
  }

  async list(req, res) {
    try {
      const products = await Product.findAll({
        where: {
          deleted: false,
        },
      });

      return res.json(
        new Response({
          products,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar listar produtos.')
      );
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        ean: Yup.string(),
        product: Yup.string(),
        description: Yup.string(),
        brand_id: Yup.number(),
        unit_id: Yup.number(),
      });
      if (!(await schema.isValid(req.params))) {
        return res.json(
          new ResponseError(
            'Erro ao validar informações obrigatórias',
            'Falha na validação ao tentar deletar um produto.'
          )
        );
      }

      const product = await Product.findOne({
        where: { id: req.params.id, deleted: false },
      });

      if (!product) {
        return res.json(
          new ResponseError(
            'Id do produto informado não existe.',
            'Falha na validação ao tentar deletar um produto.'
          )
        );
      }

      if (req.body.unit_id) {
        // check unit exist
        const unitExists = await Unit.findOne({
          where: { id: req.body.unit_id },
        });

        if (!unitExists) {
          return res.json(
            new ResponseError(
              'Unidade informada não existe',
              'Falha ao tentar editar produto.'
            )
          );
        }
      }
      if (req.body.brand_id) {
        // check brand exist
        const brandExists = await Brand.findOne({
          where: { id: req.body.brand_id },
        });

        if (!brandExists) {
          return res.json(
            new ResponseError(
              'Marca informada não existe',
              'Falha ao tentar editar produto.'
            )
          );
        }
      }

      await Product.update(req.body, { where: { id: req.params.id } });

      return res.json(
        new Response({
          message: 'Produto atualizado com sucesso',
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(
          `Erro: ${error}`,
          'Falha ao tentar atualizar produto.'
        )
      );
    }
  }
}

export default new ProductController();
