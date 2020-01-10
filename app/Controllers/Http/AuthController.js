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
      'phone_number'
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
          'There was a problem creating the user, please try again later.'
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
          data: user
        });
      }
    } catch (error) {
      return response.status(404).json({
        status: 'error',
        message: 'You do not exist in the system. Please register.'
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
    try {
      const { email, password } = request.all();

      // validate the user credentials and generate a JWT token
      const token = await auth.attempt(email, password);

      return response.json({ status: 'success', data: token });
    } catch (err) {
      response.status(403).json({ status: 'error', message: err.message });
    }
  }

  /**
   * Redirect to Facebook
   *
   * @param {object} ctx
   * @param {Ally} ctx.ally
   */
  async redirect({ ally }) {
    await ally.driver('facebook').redirect();
  }

  /**
   * Get user from Facebook
   *
   * @param {object} ctx
   * @param {Ally} ctx.ally
   * @param {Auth} ctx.auth
   */

  async callback({ ally, auth }) {
    try {
      const fbUser = await ally.driver('facebook').getUser();

      // user details to be saved
      const userDetails = {
        name: fbUser.getName(),
        email: fbUser.getEmail(),
        profile_image: fbUser.getAvatar(),
        token: fbUser.getAccessToken(),
        login_source: 'facebook'
      };

      // search for existing user
      const whereClause = {
        email: fbUser.getEmail()
      };

      const user = await User.findOrCreate(whereClause, userDetails);
      await auth.login(user);

      user.token = generateJWTToken(auth, user);

      return response.json({
        status: 'success',
        data: user
      });
    } catch (error) {
      return 'Unable to authenticate. Try again later';
    }
  }
}

async function generateJWTToken(auth, user) {
  const token = await auth.generate(user);
  Object.assign(user, token);
}

module.exports = AuthController;
