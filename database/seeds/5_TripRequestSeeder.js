'use strict';

/*
|--------------------------------------------------------------------------
| TripRequestSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const User = use('App/Models/User');

class TripRequestSeeder {
  async run() {
    const passengerUser = await User.findBy('email', 'passenger@travel-to.com');

    await Factory.model('App/Models/TripRequest').create({
      trip_id: 1,
      user_id: 1
    });

    await Factory.model('App/Models/TripRequest').create({
      trip_id: 2,
      user_id: 2,
      status: 'Accepted'
    });

    await Factory.model('App/Models/TripRequest').create({
      trip_id: 3,
      user_id: 3,
      status: 'Rejected'
    });

    await Factory.model('App/Models/TripRequest').create({
      trip_id: 4,
      user_id: 4,
      status: 'Accepted'
    });

    await Factory.model('App/Models/TripRequest').create({
      trip_id: 5,
      user_id: passengerUser.id,
      status: 'Accepted'
    });

    await Factory.model('App/Models/TripRequest').create({
      trip_id: 21,
      user_id: passengerUser.id,
      status: 'Pending'
    });

    await Factory.model('App/Models/TripRequest').create({
      trip_id: 23,
      user_id: passengerUser.id,
      status: 'Pending'
    });
  }
}

module.exports = TripRequestSeeder;
