'use strict';

/*
|--------------------------------------------------------------------------
| ConversationSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const User = use('App/Models/User');
const TripRequest = use('App/Models/TripRequest');

class ConversationSeeder {
  async run() {
    const driverUser = await User.findBy('email', 'driver@travel-to.com');
    const passengerUser = await User.findBy('email', 'passenger@travel-to.com');
    const tripRequest = await TripRequest.findBy('user_id', passengerUser.id);
    const trip = await tripRequest.trip().fetch();

    const conversation = await Factory.model('App/Models/Conversation').create({
      trip_request_id: tripRequest.id,
      trip_id: trip.id,
      creator_id: passengerUser.id
    });

    await Factory.model('App/Models/Message').create({
      sender_id: passengerUser.id,
      receiver_id: driverUser.id,
      conversation_id: conversation.id
    });
  }
}

module.exports = ConversationSeeder;
