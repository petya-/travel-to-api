const Event = use('Event');

Event.on('new::user', 'User.sendWelcomeEmail');

Event.on('new::tripRequest', 'TripRequest.createConversation');

Event.on('new:message', async message => {
  // TODO: send notification
});
