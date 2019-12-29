'use strict';

const Trip = (exports = module.exports = {});
const Notification = use('App/Models/Notification');
const { broadcastNotification } = require('../utils/socket.utils');

Trip.sendNotification = async (trip, request, user) => {
  try {
    // TODO: for each trip request user, send notification that trip was cancelled
  } catch (error) {
    throw error;
  }
};
