import * as Yup from 'yup';
import User from '../models/User';
import Response from '../../libs/response';
import ResponseError from '../../libs/response-error';

class UserController {
  async createUser(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        login: Yup.string().required(),
        password: Yup.string().required(),
      });
      if (!(await schema.isValid(req.body))) {
        return res.json(
          new ResponseError(
            'Erro ao validar informações obrigatórias',
            'Falha na validação.'
          )
        );
      }

      const userExists = await User.findOne({
        where: { login: req.body.login },
      });

      if (userExists) {
        return res.json(
          new ResponseError(
            'Login informado já existe',
            'Falha ao tentar criar usuário.'
          )
        );
      }

      const { id, name, login, job } = await User.create(req.body);

      return res.json(
        new Response({
          id,
          name,
          login,
          job,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar criar usuário.')
      );
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        login: Yup.string().required(),
        oldPassword: Yup.string(),
        password: Yup.string().when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      });
      if (!(await schema.isValid(req.body))) {
        return res.json(
          new ResponseError(
            'Erro ao validar informações obrigatórias',
            'Falha na validação.'
          )
        );
      }

      const { login, oldPassword } = req.body;

      const user = await User.findOne({ where: { login } });

      if (!user) {
        return res.json(
          new ResponseError(
            'Login informado não existe.',
            'Falha na validação.'
          )
        );
      }

      if (!(await user.checkPassword(oldPassword))) {
        return res.json(
          new ResponseError('Senha antiga não confere.', 'Falha na validação.')
        );
      }
      const { id, name } = await user.update(req.body);

      return res.json(
        new Response({
          id,
          name,
          login,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(
          `Erro: ${error}`,
          'Falha ao tentar atualizar usuário.'
        )
      );
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.findAll();

      return res.json(
        new Response({
          users,
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(`Erro: ${error}`, 'Falha ao tentar listar usuários.')
      );
    }
  }
}

export default new UserController();
