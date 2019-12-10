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

class TripSeeder {
  async run() {
    const driverUser = await User.findBy('email', 'driver@travel-to.com');
    const trips = await await Factory.model('App/Models/Trip').createMany(20, {
      driver_id: driverUser.id
    });
  }
}

module.exports = TripSeeder;
