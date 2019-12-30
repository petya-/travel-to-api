'use strict';

class MessagingController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;
    console.log('A new subscription for conversation topic', socket.topic);
  }

  onMessage(message) {
    console.log('got message', message);
  }

  onClose() {
    console.log(
      'Closing subscription for conversation topic',
      this.socket.topic
    );
  }
}

module.exports = MessagingController;
