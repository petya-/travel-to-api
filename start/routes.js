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
  Route.post('/register', 'AuthController.register');
  Route.post('/login', 'AuthController.login');
})
  .prefix('api/auth')
  .middleware('guest');

Route.group(() => {
  Route.post('/verify', 'AuthController.verify');
})
  .prefix('api/auth')
  .middleware('auth:jwt');

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

Route.group(() => {
  Route.get('/', 'UserController.index');
})
  .prefix('api/users')
  .middleware('auth:jwt', 'can:read_users');

Route.group(() => {
  Route.get('/', 'UserController.show');
  Route.put('/', 'UserController.update');
  Route.put('/changePassword', 'UserController.changePassword');
})
  .prefix('api/user')
  .middleware(['auth:jwt', 'can:read_user_profile', 'can:update_user_profile']);

/*
|--------------------------------------------------------------------------
| Trip Routes
|--------------------------------------------------------------------------
*/
Route.group(() => {
  Route.get('/', 'TripController.index');
  Route.get('/user', 'TripController.indexUserTrips').middleware([
    'auth:jwt',
    'can:read_user_trips'
  ]);
  Route.get('/:id', 'TripController.show').middleware([
    'auth:jwt',
    'can:read_user_trips'
  ]);
  Route.get('/:id/requests', 'TripController.showTripRequests').middleware([
    'can:read_user_trips'
  ]);
  Route.post('/', 'TripController.store').middleware(['can:create_trip']);
  Route.put('/:id', 'TripController.update').middleware([
    'auth:jwt',
    'can:update_trip',
    'isTripDriver'
  ]);
  Route.put('/:id/cancel', 'TripController.cancel').middleware([
    'auth:jwt',
    'can:update_trip',
    'isTripDriver'
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
    'can:create_trip_request'
  ]);
  Route.put('/:id', 'TripRequestController.update').middleware([
    'can:update_trip_request',
    'isInTrip'
  ]);
  Route.put('/:id/accept', 'TripRequestController.accept').middleware([
    'can:accept_trip_request',
    'isInTrip'
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
  .middleware(['auth:jwt']);

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
  Route.post('/:id/message', 'ConversationController.createMessage').middleware(
    ['can:create_message', 'isInConversation']
  );
})
  .prefix('api/conversations')
  .middleware(['auth:jwt']);

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
  .middleware(['auth:jwt']);
