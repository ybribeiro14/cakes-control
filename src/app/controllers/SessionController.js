import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import Response from '../../libs/response';
import ResponseError from '../../libs/response-error';
import User from '../models/User';

class SessionController {
  async newSession(req, res) {
    try {
      const schema = Yup.object().shape({
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

      const { login, password } = req.body;

      const user = await User.findOne({ where: { login } });

      if (!user) {
        return res.json(
          new ResponseError('Usuário não encontrado', 'Falha na validação.')
        );
      }

      if (!(await user.checkPassword(password))) {
        return res.json(
          new ResponseError('Senha não bateu', 'Falha na validação.')
        );
      }

      const { id, name } = user;

      return res.json(
        new Response({
          user: {
            id,
            name,
            login,
          },
          token: jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.expiresIn,
          }),
        })
      );
    } catch (error) {
      return res.json(
        new ResponseError(
          `Erro: ${error}`,
          'Falha ao tentar criar nova sessão.'
        )
      );
    }
  }
}

export default new SessionController();
