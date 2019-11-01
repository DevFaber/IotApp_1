import User from '../models/User';

export default {
  async store(req, res) {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email });

    if (!user) {
      user = await User.create({ email, password });
    }
    return res.json(user);
  },
};

// index - retorna listagem
// show - retorna unico registro
// store - cria um novo registro
// update - altera um registro
// destroy - apaga um registro
//
