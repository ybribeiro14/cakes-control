import * as Yup from 'yup';
import Unit from '../models/Unit';
import Response from '../../libs/response';
import ResponseError from '../../libs/response-error';

class UnitController {
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

      const unitExists = await Unit.findOne({ where: { name: req.body.name } });

      if (unitExists) {
        return res.json(
          new ResponseError(
            'Unidade informado já possui cadastro',
            'Falha ao tentar criar nova unidade.'
          )
        );
      }

      const { id, name } = await Unit.create(req.body);

      return res.json(
        new Response({
          id,
          name,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(
          `Erro: ${error}`,
          'Falha ao tentar criar nova unidade.'
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
            'Falha na validação.'
          )
        );
      }

      const unit = await Unit.findOne({ where: { id: req.params.id } });

      if (!unit) {
        return res.json(
          new ResponseError(
            'Id da unidade informado não existe.',
            'Falha na validação.'
          )
        );
      }

      await Unit.destroy({ where: { id: req.params.id } });

      return res.json(
        new Response({
          message: 'Unidade deletada com sucesso',
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar deletar unidade.')
      );
    }
  }

  async list(req, res) {
    try {
      const units = await Unit.findAll();

      return res.json(
        new Response({
          units,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar listar unidades.')
      );
    }
  }
}

export default new UnitController();
