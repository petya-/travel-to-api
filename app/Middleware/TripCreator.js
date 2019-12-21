'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Trip = use('App/Models/Trip');

class TripCreator {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, auth, response }, next) {
    // call next to advance the request
    const { id } = request.params;
    const { user } = auth;

    const trip = await Trip.query()
      .where('id', id)
      .where('driver_id', user.id)
      .first();

    if (!conversation) {
      return response.status(403).json({
        status: 'error',
        message: 'You are the creator of the trip.'
      });
    }

    await next();
  }
}

module.exports = ConversationParticipant;
