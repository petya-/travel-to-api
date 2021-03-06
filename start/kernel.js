'use strict';

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use('Server');
Server.use(['Adonis/Middleware/Cors']);

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/Cors',
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Session',
  'Adonis/Middleware/Shield',
  'Adonis/Middleware/AuthInit',
  'App/Middleware/ConvertEmptyStringsToNull',
  'Adonis/Acl/Init'
];

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  guest: 'Adonis/Middleware/AllowGuestOnly',
  is: 'Adonis/Acl/Is',
  can: 'Adonis/Acl/Can',
  isInConversation: 'App/Middleware/ConversationParticipant',
  isInTrip: 'App/Middleware/TripParticipant',
  isTripDriver: 'App/Middleware/TripCreator',
  isNotTripDriver: 'App/Middleware/IsNotTripDriver',
  isNotFullyBooked: 'App/Middleware/TripAvailability',
  tripCanBeChanged: 'App/Middleware/TripCanBeChanged',
  userIsEnabled: 'App/Middleware/UserIsEnabled'
};

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = ['Adonis/Middleware/Static'];

Server.registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware);
