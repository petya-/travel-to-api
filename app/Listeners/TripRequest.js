'use strict';

const TripRequest = (exports = module.exports = {});
const Conversation = use('App/Models/Conversation');
const { broadcast } = require('../utils/socket.utils');

TripRequest.createConversation = async (tripRequest, request, user) => {
  try {
    const trip = await tripRequest.trip().fetch();
    // create new conversation
    const conversation = new Conversation();
    conversation.creator_id = user.id;
    conversation.trip_id = tripRequest.trip_id;
    conversation.trip_request_id = tripRequest.id;
    await conversation.save();

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
