'use strict';

const Message = (exports = module.exports = {});
const Notification = use('App/Models/Notification');
const { broadcastNotification } = require('../utils/socket.utils');

Message.sendNotification = async (message, request, user) => {
  try {
    const conversation = await message.conversation().fetch();

    const notification = new Notification();
    notification.message = `You have a new message from ${user.name}`;
    notification.user_id = message.receiver_id;
    notification.trip_id = conversation.trip_id;
    notification.trip_request_id = conversation.trip_request_id;
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
