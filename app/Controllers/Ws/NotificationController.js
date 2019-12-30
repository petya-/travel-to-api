'use strict';

class NotificationController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;
    console.log('A new subscription for notification channel', socket.topic);
  }

  onClose() {
    console.log(
      'Closing subscription for notification channel',
      this.socket.topic
    );
  }
}

module.exports = NotificationController;
