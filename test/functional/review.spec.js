'use strict';
const { test, trait, before } = use('Test/Suite')('Review');
const User = use('App/Models/User');
const Trip = use('App/Models/Trip');
const { DateTime } = require('luxon');

trait('Test/ApiClient');
trait('Auth/Client');

let passengerUser, driverUser, trip, review;

before(async () => {
  passengerUser = await User.findBy('email', 'passenger@travel-to.com');
  driverUser = await User.findBy('email', 'driver@travel-to.com');
  trip = await Trip.findBy('from', 'Copenhagen');
  review = {
    text: 'It was a great trip! The driver was on time.',
    trip_id: trip.id
  };
});

test('driver cannot review a trip', async ({ client, assert }) => {
  const response = await client
    .post(`/api/trips/${trip.id}/review`)
    .send(review)
    .loginVia(driverUser, 'jwt')
    .end();
  response.assertStatus(403);
  response.assertError({
    status: 'error',
    message: 'You cannot review a trip where you are not a passenger.'
  });
});

test('passenger can review a driver after the trip is completed', async ({
  client,
  assert
}) => {
  const response = await client
    .post(`/api/trips/${trip.id}/review`)
    .send(review)
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(200);
  const { status, data } = response.body;

  assert.equal(status, 'success');
  assert.equal(data.text, review.text);
  assert.equal(data.user_id, passengerUser.id);
});

test('passenger cannot review a driver for an invalid trip', async ({
  client,
  assert
}) => {
  const response = await client
    .post(`/api/trips/144/review`)
    .send(review)
    .loginVia(passengerUser, 'jwt')
    .end();
  console.log(response);

  response.assertStatus(403);
  response.assertError({
    status: 'error',
    message: 'You cannot review a trip where you are not a passenger.'
  });
});

test('user can get all of his reviews', async ({ client, assert }) => {
  const response = await client
    .get(`/api/users/${driverUser.id}/reviews`)
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  const { status, data } = response.body;
  assert.equal(status, 'success');
  assert.equal(data.length, 1);
});
