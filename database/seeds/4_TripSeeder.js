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

    await Factory.model('App/Models/Trip').createMany(20, {
      driver_id: driverUser.id
    });

    await Factory.model('App/Models/Trip').create({
      from: 'Copenhagen',
      to: 'Oslo',
      departure_time: DateTime.fromISO('2019-12-24', {
        zone: 'utc'
      }).toISO(),
      driver_id: driverUser.id,
      number_of_passengers: 2
    });

    await Factory.model('App/Models/Trip').create({
      from: 'Plovdiv',
      to: 'Sofia',
      departure_time: DateTime.utc()
        .minus({
          days: 1,
          hours: 2,
          minutes: 0,
          seconds: 0
        })
        .toISO(),
      driver_id: driverUser.id
    });

    await Factory.model('App/Models/Trip').create({
      from: 'Sofia',
      to: 'Plovdiv',
      departure_time: DateTime.utc()
        .plus({
          days: 3,
          hours: 0,
          minutes: 0,
          seconds: 0
        })
        .toISO(),
      contact: true,
      driver_id: driverUser.id
    });
  }
}

module.exports = TripSeeder;
