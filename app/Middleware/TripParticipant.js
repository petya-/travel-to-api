'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const TripRequest = use('App/Models/TripRequest');

class TripParticipant {
  /**
   * @param {object} ctx
   * @param {Request} ctx.response
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, auth }, next) {
    const { id } = request.params;
    const { user } = auth;

    const tripRequest = await TripRequest.query()
      .where('id', id)
      .with('trip')
      .first();

    if (
      (tripRequest && tripRequest.user_id === user.id) ||
      tripRequest.toJSON().trip.driver_id === user.id
    ) {
      return await next();
    }
    return response.status(403).json({
      status: 'error',
      message: 'You are not part of the trip that you are trying to access.'
    });
  }
}

module.exports = TripParticipant;
