'use strict';

const TripRequest = (exports = module.exports = {});
const Conversation = use('App/Models/Conversation');
const Notification = use('App/Models/Notification');
const {
  broadcastMessage,
  broadcastNotification
} = require('../utils/socket.utils');

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
    broadcastMessage(conversation.id, 'conversation:newMessage', message);
  } catch (error) {
    throw error;
  }
};
TripRequest.sendNotification = async (tripRequest, user) => {
  try {
    const trip = await tripRequest.trip().fetch();
    let message, user_id;

    if (tripRequest.status == 'Pending') {
      message = `You have a new trip request from ${user.name} for your trip from ${trip.from} to ${trip.to}.`;
      user_id = trip.driver_id;
    }

    if (tripRequest.status == 'Accepted') {
      message = `Your trip request from ${trip.from} to ${trip.to} was accepted by ${user.name}.`;
      user_id = tripRequest.user_id;
    }

    if (tripRequest.status == 'Rejected') {
      message = `Your trip request from ${trip.from} to ${trip.to} was rejected by ${user.name}.`;
      user_id = tripRequest.user_id;
    }

    if (tripRequest.status == 'Cancelled') {
      message = `The trip request from ${trip.from} to ${trip.to} was cancelled by ${user.name}.`;
      user_id = trip.driver_id;
    }

    const notification = new Notification();
    notification.message = message;
    notification.user_id = user_id;
    notification.trip_id = trip.id;
    notification.trip_request_id = tripRequest.id;
    await notification.save();

    // broadcast notification
    broadcastNotification(
      notification.user_id,
      'notification:newNotification',
      notification
    );
  } catch (error) {
    throw error;
  }
};
