'use strict';

const TripRequest = (exports = module.exports = {});
const Trip = use('App/Models/Trip');
const { broadcast } = require('../utils/socket.utils');

TripRequest.createConversation = async (tripRequest, request, user) => {
  try {
    // create new conversation
    const trip = await Trip.findOrFail(request.input('trip_id'));

    const conversation = await trip.conversations().create({
      creator_id: user.id,
      trip_request_id: tripRequest.id
    });

    // create new message fromr request
    const message = await conversation.messages().create({
      message: request.input('message'),
      sender_id: user.id,
      receiver_id: trip.driver_id
    });
    // broadcast conversation
    broadcast(conversation.id, 'conversation:newMessage', message);

    // call new:message event
  } catch (error) {
    throw error;
  }
};
