import * as Yup from 'yup';
import Market from '../models/Market';
import Response from '../../libs/response';
import ResponseError from '../../libs/response-error';

class MarketController {
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

      const marketExists = await Market.findOne({
        where: { name: req.body.name },
      });

      if (marketExists) {
        return res.json(
          new ResponseError(
            'Marca informado já possui cadastro',
            'Falha ao tentar criar nova unidade.'
          )
        );
      }

      const { id, name } = await Market.create(req.body);

      return res.json(
        new Response({
          id,
          name,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar criar um mercado.')
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

      const market = await Market.findOne({ where: { id: req.params.id } });

      if (!market) {
        return res.json(
          new ResponseError(
            'Id do mercado informado não existe.',
            'Falha na validação.'
          )
        );
      }

      await Market.destroy({ where: { id: req.params.id } });

      return res.json(
        new Response({
          message: 'Mercado deletado com sucesso',
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(
          `Erro: ${error}`,
          'Falha ao tentar deletar um mercado.'
        )
      );
    }
  }

  async list(req, res) {
    try {
      const markets = await Market.findAll();

      return res.json(
        new Response({
          markets,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar listar mercados.')
      );
    }
  }
}

export default new MarketController();
