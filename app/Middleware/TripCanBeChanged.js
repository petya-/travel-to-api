'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Trip = use('App/Models/Trip');
const { DateTime } = require('luxon');

class TripCanBeChanged {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    // call next to advance the request
    const { id } = request.params;

    const trip = await Trip.find(id);
    const tomorrow = DateTime.utc().plus({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0
    });

    const { hours } = tomorrow
      .diff(DateTime.fromJSDate(trip.departure_time), 'hours')
      .toObject();

    if (hours > 24) {
      let updateType = request.url().includes('cancel') ? 'cancel' : 'update';
      return response.status(400).json({
        status: 'error',
        message: `You cannot ${updateType} a trip less that 24h before the departure time.`
      });
    }

    await next();
  }
}

module.exports = TripCanBeChanged;
