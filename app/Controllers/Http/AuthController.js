'use strict';
const User = use('App/Models/User');
const Mail = use('Mail');

class AuthController {
  async register({
    request,
    auth,
    response
  }) {
    let user = await User.findBy('email', request.input('email'));
    if (user)
      return response.json({
        message: 'The email address is already in use by another account'
      });

    try {
      user = await User.create(request.all());
      const token = await auth.generate(user);
      Object.assign(user, token);
      return response.json(user);
    } catch (err) {
      throw err;
    }
  }

  async login({
    request,
    auth,
    response
  }) {
    let {
      email,
      password
    } = request.all();
    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email);

        if (!user.emailVerified) {
          return response.json({
            message: 'Your email address is not confirmed!'
          });
        }
        if (!user.enabled) {
          return response.json({
            message: "You've been banned from the system!"
          });
        }

        const token = await auth.generate(user);
        Object.assign(user, token);
        return response.json(user);
      }
    } catch (e) {
      console.log(e);
      return response.json({
        message: 'You are not registered!'
      });
    }
  }
}

module.exports = AuthController;
