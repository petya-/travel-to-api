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
      await generateJWTToken(auth, user);

      await Mail.send('emails.welcome', user.toJSON(), message => {
        message
          .to(user.email)
          .from('<from-email>')
          .subject('Welcome to TravelTo app!');
      });

      return response.json(user);
    } catch (err) {
      throw err;
    }
  }

  async verify({
    params,
    auth,
    response
  }) {
    let user = await auth.getUser();

    if (user) {
      user.emailVerified = true;
      user.save();
      user.revokeTokens();
      await generateJWTToken(auth, user);
      return response.json(user);
    }

    return response.json({
      message: 'You do not exist in the system. Please register.'
    });
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

        await generateJWTToken(auth, user);
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

async function generateJWTToken(auth, user) {
  const token = await auth.generate(user);
  Object.assign(user, token);
}

module.exports = AuthController;
