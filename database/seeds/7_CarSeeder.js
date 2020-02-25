'use strict';

/*
|--------------------------------------------------------------------------
| CarSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const User = use('App/Models/User');

class CarSeeder {
  async run() {
    const driver_id = (await User.findBy('email', 'driver@travel-to.com')).id;

    await Factory.model('App/Models/Car').createMany(2, {
      driver_id
    });
  }
}

module.exports = CarSeeder;
