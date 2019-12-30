'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const TripRequest = use('App/Models/TripRequest');
const Trip = use('App/Models/Trip');

class TripAvailability {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, auth, response }, next) {
    const { user } = auth;
    let trip;

    if (request.params.id) {
      const { id } = request.params;
      const tripRequest = await TripRequest.find(id);
      trip = await Trip.find(tripRequest.trip_id);
    } else {
      trip = await Trip.find(request.input('trip_id'));
    }
    const tripRequests = await trip
      .tripRequests()
      .where('status', 'Accepted')
      .fetch();

    let totalApprovedPassengers = 0;

    if (tripRequests.toJSON().length > 0) {
      // get sum of all approved passengers from trip requests
      totalApprovedPassengers = tripRequests
        .toJSON()
        .reduce(function(prev, cur) {
          return prev + cur.number_of_passengers;
        }, 0);
    }

    if (totalApprovedPassengers < trip.number_of_passengers)
      return await next();

    return response.status(400).json({
      status: 'error',
      message: 'The trip has the maximum number of passengers'
    });
  }
}

module.exports = TripAvailability;
