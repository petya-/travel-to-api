'use strict';

const Ws = use('Ws');

Ws.channel('conversation:*', 'MessagingController').middleware(['auth']);