'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @typedef {import('@adonisjs/auth')} Auth */

const User = use('App/Models/User');
const ReportedUser = use('App/Models/ReportedUser');
const Role = use('Role');
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
    try {
      const user = await User.query()
        .where('id', auth.current.user.id)
        .firstOrFail();

      const roles = await user.getRoles();
      user.role = roles.includes('driver') ? 'driver' : 'passenger';

      return response.json({
        status: 'success',
        data: user
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'There was a problem while getting the profile.'
      });
    }
  }

  /**
   * Update an existing user.
   * PUT user/
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
      user.phone_number = request.input('phone_number');
      user.profile_img = request.input('profile_img');
      user.description = request.input('description');

      await user.save();
      return response.json({
        status: 'success',
        message: 'Profile updated!',
        data: user
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'There was a problem updating profile, please try again later.'
      });
    }
  }

  /**
   * Change user password
   * PUT user/changePassword
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async changePassword({ request, auth, response }) {
    try {
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
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'User password could not be updated! Please try again.'
      });
    }
  }

  /**
   * Make passenger a driver
   * PUT users/:id/becomeDriver
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Params} ctx.params
   */
  async becomeDriver({ params, response }) {
    try {
      const { id } = params;
      const user = await User.find(id);

      const driverRole = await Role.findBy('slug', 'driver');
      await user.roles().attach(driverRole.id);
      user.role = 'driver';

      response.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'User role could not be updated! Please try again.'
      });
    }
  }

  /**
   * Report a user
   * POST users/report
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async report({ request, response, auth }) {
    try {
      const { user_id, reason } = request.all();

      const userToReport = new ReportedUser();
      userToReport.reason = reason;
      userToReport.reported_id = user_id;
      userToReport.reporter_id = auth.user.id;
      await userToReport.save();

      response.status(200).json({
        status: 'success',
        data: userToReport
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'User could not be reported! Please try again.'
      });
    }
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
