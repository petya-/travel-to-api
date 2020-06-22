'use strict';
const User = use('App/Models/User');
const Event = use('Event');
const Role = use('Role');
class AuthController {
  /**
   * Register user
   * POST auth/register
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async register({ request, auth, response }) {
    // get user data from signup form
    const userData = request.only([
      'name',
      'email',
      'password',
      'phone_number',
    ]);
    const role = request.input('role');

    try {
      // save user to database
      const user = await User.create(userData);
      // generate JWT token for user
      const token = await auth.generate(user);

      // fire user created event
      Event.fire('new::user', user, token.token);

      // attach driver role if set
      if (role && role === 'driver') {
        const driverRole = await Role.findBy('slug', 'driver');
        await user.roles().attach(driverRole.id);
      }

      return response.json({ status: 'success', data: token });
    } catch (err) {
      return response.status(400).json({
        status: 'error',
        message:
          'There was a problem creating the user, please try again later.',
      });
    }
  }

  /**
   * Verify user
   * PUT auth/verify
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async verify({ auth, response }) {
    try {
      let user = await auth.getUser();

      if (user) {
        user.email_verified = true;
        await user.save();

        await auth.authenticator('jwt').revokeTokens();
        await generateJWTToken(auth, user);

        const roles = await user.getRoles();
        user.role = roles.includes('driver') ? 'driver' : 'passenger';
        return response.json({
          status: 'success',
          data: user,
        });
      }
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'You do not exist in the system. Please register.',
      });
    }
  }

  /**
   * Login user
   * POST auth/login
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async login({ request, auth, response }) {
    const { email, password } = request.all();

    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email);
        let token = await auth.generate(user);

        user.tokens().create(token);
        Object.assign(user, token);
        return response.json({ status: 'success', data: user });
      }
    } catch (err) {
      console.log(err);

      response
        .status(403)
        .json({ status: 'error', message: 'You are not registered!' });
    }
  }

  /**
   * Redirect to Facebook
   *
   * @param {object} ctx
   * @param {Ally} ctx.ally
   * @param {Response} ctx.response
   */
  async redirectToProvider({ ally, params, response }) {
    const url = await ally.driver(params.provider).getRedirectUrl();
    return response.json({ status: 'success', data: url });
  }

  /**
   * Get user from Facebook
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Request} ctx.response
   * @param {Auth} ctx.auth
   */

  async handleProviderCallback({ params, request, auth, response }) {
    const provider = params.provider;
    try {
      // const userData = await ally.driver(params.provider).getUser();
      const userData = request.only([
        'name',
        'email',
        'user_id',
        'accessToken',
      ]);

      // user details to be saved
      const userDetails = {
        name: userData.name,
        email: userData.email,
        token: userData.accessToken,
        provider_id: userData.user_id,
        provider: provider,
        email_verified: true,
        enabled: true,
      };

      // search for existing user
      const whereClause = {
        email: userData.email,
      };

      const user = await User.findOrCreate(whereClause, userDetails);
      await generateJWTToken(auth, user);

      return response.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ status: 'error', message: error });
    }
  }

  async logout({ auth, response }) {
    await auth.logout();
    return response.json({
      status: 'success',
      message: 'You were logged out!',
    });
  }
}

async function generateJWTToken(auth, user) {
  const token = await auth.generate(user);
  Object.assign(user, token);
}

module.exports = AuthController;
