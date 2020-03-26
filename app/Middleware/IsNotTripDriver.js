'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Trip = use('App/Models/Trip');

class IsNotTripDriver {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   * @param {Function} next
   */
  async handle({ request, response, auth }, next) {
    // call next to advance the request
    const { id } = request.params;
    const { user } = auth;

    const trip = await Trip.find(id);

    if (!trip || trip.driver_id === user.id) {
      return response.status(403).json({
        status: 'error',
        message: 'You cannot review a trip where you are not a passenger.'
      });
    }
    await next();
  }
}

module.exports = IsNotTripDriver;
