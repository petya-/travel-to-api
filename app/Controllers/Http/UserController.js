'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth')} Auth */

const User = use('App/Models/User');
const Hash = use('Hash');

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Get a list of all users.
   * GET users
   *
   * @param {Object} response
   */
  async index({ response }) {
    const users = await User.all();
    response.status(200).json({
      status: 'success',
      data: users
    });
  }

  /**
   * Get a single user.
   * GET account
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async show({ auth, response }) {
    const user = await User.query()
      .where('id', auth.current.user.id)
      .firstOrFail();

    return response.json({
      status: 'success',
      data: user
    });
  }

  /**
   * Update an existing user.
   * PUT account/
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async update({ auth, request, response }) {
    try {
      // get currently authenticated user
      const user = auth.current.user;

      // update with new data entered
      user.name = request.input('name');
      user.email = request.input('email');
      user.phoneNumber = request.input('phoneNumber');
      user.profileImg = request.input('profileImg');
      user.description = request.input('description');

      await user.save();
      return response.json({
        status: 'success',
        message: 'Profile updated!',
        data: user
      });
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem updating profile, please try again later.'
      });
    }
  }

  async changePassword({ request, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user;

    // verify if current password matches
    const verifyPassword = await Hash.verify(
      request.input('password'),
      user.password
    );

    // display appropriate message
    if (!verifyPassword) {
      return response.status(400).json({
        status: 'error',
        message: 'Current password could not be verified! Please try again.'
      });
    }

    // hash and save new password
    user.password = request.input('newPassword');
    await user.save();

    return response.json({
      status: 'success',
      message: 'Password updated!'
    });
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = UserController;
