'use strict';

const { test, trait, before, after } = use('Test/Suite')('TripRequest');
const Trip = use('App/Models/Trip');
const User = use('App/Models/User');
const Event = use('Event');

trait('Test/ApiClient');
trait('Auth/Client');

let passengerUser, driverUser, adminUser, trip, newTripRequest;

before(async () => {
  passengerUser = await User.findBy('email', 'passenger@travel-to.com');
  driverUser = await User.findBy('email', 'driver@travel-to.com');
  adminUser = await User.findBy('email', 'admin@travel-to.com');

  trip = await Trip.findBy('from', 'Copenhagen');
  newTripRequest = {
    number_of_passengers: 2,
    trip_id: trip.id,
    message: 'Hi, I would like to travel with you. Where are you leaving from?'
  };
});

test('passenger can create a trip request', async ({ client, assert }) => {
  Event.fake();

  const response = await client
    .post('api/tripRequests')
    .send(newTripRequest)
    .loginVia(passengerUser, 'jwt')
    .end();

  const { status, data } = response.body;
  newTripRequest.id = data.id;

  response.assertStatus(200);
  assert.equal(status, 'success');
  assert.equal(data.trip_id, newTripRequest.trip_id);
  assert.equal(data.number_of_passengers, newTripRequest.number_of_passengers);
  assert.equal(data.status, 'Pending');

  const recentEvent = Event.pullRecent();
  assert.equal(recentEvent.event, 'new::tripRequest');

  Event.restore();
});

test('passenger can get a trip request by id if he created it', async ({
  client
}) => {
  const response = await client
    .get(`api/tripRequests/${newTripRequest.id}`)
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(200);
});

test('driver can get a trip request by id if he created the trip', async ({
  client
}) => {
  const response = await client
    .get(`api/tripRequests/${newTripRequest.id}`)
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
});

test('user that is not part of a trip cannot get trip request', async ({
  client
}) => {
  const response = await client
    .get(`api/tripRequests/${newTripRequest.id}`)
    .loginVia(adminUser, 'jwt')
    .end();

  response.assertStatus(403);
  response.assertError({
    status: 'error',
    message: 'You are not part of the trip that you are trying to access.'
  });
});

test('passenger cannot accept a trip request', async ({ client }) => {
  const response = await client
    .put(`api/tripRequests/${newTripRequest.id}/accept`)
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(403);
  response.assertError(
    'ForbiddenException: Access forbidden. You are not allowed to this resource.'
  );
});
test('passenger cannot reject a trip request', async ({ client }) => {
  const response = await client
    .put(`api/tripRequests/${newTripRequest.id}/reject`)
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(403);
  response.assertError(
    'ForbiddenException: Access forbidden. You are not allowed to this resource.'
  );
});

test('driver can accept a trip request', async ({ client, assert }) => {
  const response = await client
    .put(`api/tripRequests/${newTripRequest.id}/accept`)
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body.data.status, 'Accepted');
});

test('driver cannot reject an already accepted request', async ({ client }) => {
  const response = await client
    .put(`api/tripRequests/${newTripRequest.id}/reject`)
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(400);
  response.assertError({
    status: 'error',
    message: 'You can reject only a Pending request'
  });
});

test('passenger cannot create a trip request if it exceeds the number of people', async ({
  client,
  assert
}) => {
  Event.fake();

  const tripRequest = {
    number_of_passengers: 4,
    trip_id: trip.id,
    message: 'Hi, I would like to travel with you. Where are you leaving from?'
  };

  const response = await client
    .post('api/tripRequests')
    .send(tripRequest)
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(403);
  response.assertError({
    status: 'error',
    message: 'The trip has the maximum number of passengers'
  });

  Event.restore();
});
