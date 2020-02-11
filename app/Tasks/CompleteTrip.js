'use strict';

const Task = use('Task');
const Trip = use('App/Models/Trip');
const { DateTime } = require('luxon');

class CompleteTrip extends Task {
  static get schedule() {
    return '0 23 * * *';
  }

  async handle() {
    console.log('String Task CompleteTrip handle');

    const today = DateTime.utc()
      .endOf('day')
      .toISO();

    const completedTrips = await Trip.query()
      .where('status', 'Pending')
      .where('departure_time', '<', today)
      .update({
        status: 'Completed'
      });

    console.log(`Marked ${completedTrips} trip requests as completed`);
  }
}

module.exports = CompleteTrip;
