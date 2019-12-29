'use strict';

class NotificationController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;
    console.log('A new subscription for notification id', socket.topic);
  }

  onClose() {
    console.log('Closing subscription for notification id', this.socket.topic);
  }
}

module.exports = NotificationController;
