'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class UserIsEnabled {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle({ auth, response }, next) {
    const { user } = auth;

    if (!user.enabled) {
      return response.status(403).json({
        status: 'error',
        message: "You've been banned from the system!"
      });
    }

    if (!user.email_verified) {
      return response.status(403).json({
        status: 'error',
        message: 'Your email address is not confirmed!'
      });
    }

    // call next to advance the request
    await next();
  }
}

module.exports = UserIsEnabled;
