'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const TripRequest = use('App/Models/TripRequest');
const Trip = use('App/Models/Trip');

class TripParticipant {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, auth }, next) {
    const { id } = request.params;
    const { user } = auth;

    if (request.match(['/api/trips/:id/review'])) {
      const trip = await Trip.query()
        .where('id', id)
        .where('status', 'Completed')
        .whereHas('tripRequests', builder => {
          builder.where('user_id', user.id);
        })
        .fetch();

      if (trip) return await next();
      return response.status(403).json({
        status: 'error',
        message:
          'You are not part of the trip or the trip is not yet completed.'
      });
    }
    const tripRequest = await TripRequest.query()
      .where('id', id)
      .with('trip')
      .first();
    if (
      tripRequest &&
      (tripRequest.user_id === user.id ||
        tripRequest.toJSON().trip.driver_id === user.id)
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
