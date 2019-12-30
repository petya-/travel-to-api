'use strict';

const Ws = use('Ws');

// Ws.channel('conversation:*', 'MessagingController').middleware(['auth']);
Ws.channel('conversation:*', 'MessagingController');
Ws.channel('notification:*', 'NotificationController').middleware(['auth']);
