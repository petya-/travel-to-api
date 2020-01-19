'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.on('/').render('welcome');
/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.post('auth/register', 'AuthController.register').validator('StoreUser');
  Route.post('auth/login', 'AuthController.login');
  Route.get('auth/:provider', 'AuthController.redirectToProvider').as(
    'social.login'
  );
  Route.post(
    'authenticated/:provider',
    'AuthController.handleProviderCallback'
  ).as('social.login.callback');
})
  .prefix('api/')
  .middleware('guest');

Route.group(() => {
  Route.put('/verify', 'AuthController.verify');
})
  .prefix('api/auth')
  .middleware('auth:jwt');

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

Route.group(() => {
  Route.get('/', 'UserController.index').middleware(['can:read_users']);
  Route.put('/:id/becomeDriver', 'UserController.becomeDriver').middleware([
    'can:update_user_profile'
  ]);
  Route.post('/report', 'UserController.report').validator('ReportUser');
})
  .prefix('api/users')
  .middleware(['auth:jwt', 'userIsEnabled']);

Route.group(() => {
  Route.get('/', 'UserController.show');
  Route.put('/', 'UserController.update');
  Route.put('/changePassword', 'UserController.changePassword');
})
  .prefix('api/user')
  .middleware([
    'auth:jwt',
    'userIsEnabled',
    'can:read_user_profile',
    'can:update_user_profile'
  ]);

/*
|--------------------------------------------------------------------------
| Trip Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/', 'TripController.index');
  Route.get('/user', 'TripController.indexUserTrips').middleware([
    'auth:jwt',
    'userIsEnabled',
    'can:read_user_trips'
  ]);
  Route.get('/:id', 'TripController.show').middleware([
    'auth:jwt',
    'userIsEnabled',
    'can:read_user_trips'
  ]);
  Route.get('/:id/requests', 'TripController.showTripRequests').middleware([
    'can:read_user_trips'
  ]);
  Route.post('/', 'TripController.store').middleware(['can:create_trip']);
  Route.put('/:id', 'TripController.update').middleware([
    'auth:jwt',
    'userIsEnabled',
    'can:update_trip',
    'isTripDriver',
    'tripCanBeChanged'
  ]);
  Route.put('/:id/cancel', 'TripController.cancel').middleware([
    'auth:jwt',
    'userIsEnabled',
    'can:update_trip',
    'isTripDriver',
    'tripCanBeChanged'
  ]);
}).prefix('api/trips');

/*
|--------------------------------------------------------------------------
| Trip Request Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/', 'TripRequestController.index').middleware([
    'can:read_trip_requests'
  ]);
  Route.get('/:id', 'TripRequestController.show').middleware([
    'can:read_trip_request',
    'isInTrip'
  ]);
  Route.post('/', 'TripRequestController.store').middleware([
    'can:create_trip_request',
    'isNotFullyBooked'
  ]);
  Route.put('/:id', 'TripRequestController.update').middleware([
    'can:update_trip_request',
    'isInTrip'
  ]);
  Route.put('/:id/accept', 'TripRequestController.accept').middleware([
    'can:accept_trip_request',
    'isInTrip',
    'isNotFullyBooked'
  ]);
  Route.put('/:id/reject', 'TripRequestController.reject').middleware([
    'can:reject_trip_request',
    'isInTrip'
  ]);
  Route.put('/:id/cancel', 'TripRequestController.cancel').middleware([
    'can:cancel_trip_request',
    'isInTrip'
  ]);
})
  .prefix('api/tripRequests')
  .middleware(['auth:jwt', 'userIsEnabled']);

/*
|--------------------------------------------------------------------------
| Conversation Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/', 'ConversationController.indexForUser').middleware([
    'can:read_conversations'
  ]);
  Route.get('/:id', 'ConversationController.show').middleware([
    'can:read_conversations',
    'isInConversation'
  ]);
  Route.put('/:id', 'ConversationController.update').middleware([
    'can:update_conversation',
    'isInConversation'
  ]);
  Route.post(
    '/:id/message',
    'ConversationController.createMessage'
  ).middleware(['can:create_message', 'isInConversation']);
})
  .prefix('api/conversations')
  .middleware(['auth:jwt', 'userIsEnabled']);

/*
|--------------------------------------------------------------------------
| Messaging Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.put('/:id', 'ConversationController.markAsRead').middleware([
    'can:update_message'
  ]);
})
  .prefix('api/messages')
  .middleware(['auth:jwt', 'userIsEnabled']);

/*
|--------------------------------------------------------------------------
| Notification Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/', 'NotificationController.indexForUser').middleware([
    'can:read_notifications'
  ]);
  Route.put('/:id', 'NotificationController.markAsRead').middleware([
    'can:update_notification'
  ]);
})
  .prefix('api/notifications')
  .middleware(['auth:jwt', 'userIsEnabled']);
