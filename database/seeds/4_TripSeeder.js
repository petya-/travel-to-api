'use strict';
/*
|--------------------------------------------------------------------------
| TripSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const User = use('App/Models/User');
const { DateTime } = require('luxon');

class TripSeeder {
  async run() {
    const driverUser = await User.findBy('email', 'driver@travel-to.com');
    const trips = await Factory.model('App/Models/Trip').createMany(20, {
      driver_id: driverUser.id
    });
    await Factory.model('App/Models/Trip').create({
      from: 'Copenhagen',
      to: 'Oslo',
      departureTime: DateTime.fromISO('2019-12-24', {
        zone: 'utc'
      }).toISO(),
      driver_id: driverUser.id
    });
  }
}

module.exports = TripSeeder;
