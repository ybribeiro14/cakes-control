import * as Yup from 'yup';
import Brand from '../models/Brand';
import Response from '../../libs/response';
import ResponseError from '../../libs/response-error';

class BrandController {
  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
      });
      if (!(await schema.isValid(req.body))) {
        return res.json(
          new ResponseError(
            'Erro ao validar informações obrigatórias',
            'Falha na validação.'
          )
        );
      }

      const brandExists = await Brand.findOne({
        where: { name: req.body.name },
      });

      if (brandExists) {
        return res.json(
          new ResponseError(
            'Marca informado já possui cadastro',
            'Falha ao tentar criar nova unidade.'
          )
        );
      }

      const { id, name } = await Brand.create(req.body);

      return res.json(
        new Response({
          id,
          name,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar criar nova marca.')
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
            'Falha na validação.'
          )
        );
      }

      const brand = await Brand.findOne({ where: { id: req.params.id } });

      if (!brand) {
        return res.json(
          new ResponseError(
            'Id da marca informado não existe.',
            'Falha na validação.'
          )
        );
      }

      await Brand.destroy({ where: { id: req.params.id } });

      return res.json(
        new Response({
          message: 'Marca deletada com sucesso',
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(
          `Erro: ${error}`,
          'Falha ao tentar deletar nova marca.'
        )
      );
    }
  }

  async list(req, res) {
    try {
      const brands = await Brand.findAll();

      return res.json(
        new Response({
          brands,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar listar marcas.')
      );
    }
  }
}

export default new BrandController();
