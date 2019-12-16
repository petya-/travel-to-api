const Event = use('Event');
const Mail = use('Mail');

Event.on('new::user', 'User.sendWelcomeEmail');

Event.on('new::tripRequest', 'TripRequest.createConversation');

Event.on('new:message', async message => {
  // send notification
});
