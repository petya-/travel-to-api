'use strict';

const Trip = (exports = module.exports = {});
const Notification = use('App/Models/Notification');
const { broadcastNotification } = require('../utils/socket.utils');

Trip.sendNotification = async (trip, user) => {
  try {
    const tripRequests = await trip.tripRequests().fetch();

    if (tripRequests.toJSON().length > 0) {
      await broadcastNotifications(
        trip,
        tripRequests.toJSON(),
        `The trip from ${trip.from} to ${trip.to} was cancelled by ${user.name}.`
      );
    }
  } catch (error) {
    throw error;
  }
};

Trip.cancelTripRequests = async (trip, user) => {
  try {
    const tripRequests = await trip.tripRequests().fetch();
    if (tripRequests.toJSON().length > 0) {
      await tripRequests.toJSON().forEach(async tripRequest => {
        tripRequest.status = 'Rejected';
        await tripRequest;
      });
    }
  } catch (error) {
    throw error;
  }
};

Trip.updateTrip = async (trip, user) => {
  try {
    const tripRequests = await trip.tripRequests().fetch();
    if (tripRequests.toJSON().length > 0) {
      await broadcastNotifications(
        trip,
        tripRequests.toJSON(),
        `The trip from ${trip.from} to ${trip.to} was updated by ${user.name}.`
      );
    }
  } catch (error) {
    throw error;
  }
};

async function broadcastNotifications(trip, tripRequests, message) {
  tripRequests.forEach(async tripRequest => {
    const notification = new Notification();
    notification.message = message;
    notification.user_id = tripRequest.user_id;
    notification.trip_id = trip.id;
    notification.trip_request_id = tripRequest.id;
    await notification.save();

    // broadcast notification
    broadcastNotification(
      notification.user_id,
      'notification:newNotification',
      notification
    );
  });
}
