const Event = use('Event');

Event.on('new::user', 'User.sendWelcomeEmail');

Event.on('new::tripRequest', 'TripRequest.createConversation');
Event.on('new::tripRequest', 'TripRequest.sendNotification');
Event.on('accept::tripRequest', 'TripRequest.sendNotification');
Event.on('reject::tripRequest', 'TripRequest.sendNotification');
Event.on('cancel::tripRequest', 'TripRequest.sendNotification');

Event.on('cancel::trip', 'Trip.sendNotification');
Event.on('cancel::trip', 'Trip.cancelTripRequests');

Event.on('new:message', 'Message.sendNotification');
