'use strict';

const Task = use('Task');
const Trip = use('App/Models/Trip');
const TripRequest = use('App/Models/TripRequest');
const { DateTime } = require('luxon');

class CompleteTripRequest extends Task {
  static get schedule() {
    return '45 22 * * *';
  }

  async handle() {
    console.log('Starting Task CompleteTripRequest handle');
    const today = DateTime.utc()
      .endOf('day')
      .toISO();

    const completedTripsIds = await Trip.query()
      .where('status', 'Pending')
      .where('departure_time', '<', today)
      .ids();

    console.log(completedTripsIds);

    const completedTripRequests = await TripRequest.query()
      .where('status', 'Pending')
      .whereIn('trip_id', completedTripsIds)
      .update({
        status: 'Rejected'
      });
    console.log(`Marked ${completedTripRequests} trip requests as rejected`);
  }
}

module.exports = CompleteTripRequest;
