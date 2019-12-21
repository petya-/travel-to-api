'use strict';
const { test, trait, before } = use('Test/Suite')('Trip');
const User = use('App/Models/User');
const Trip = use('App/Models/Trip');
const { DateTime } = require('luxon');

trait('Test/ApiClient');
trait('Auth/Client');

let passengerUser, driverUser, adminUser, newTrip;

before(async () => {
  passengerUser = await User.findBy('email', 'passenger@travel-to.com');
  driverUser = await User.findBy('email', 'driver@travel-to.com');
  adminUser = await User.findBy('email', 'admin@travel-to.com');
  newTrip = {
    from: 'Oslo',
    to: 'Copenhagen',
    departureTime: DateTime.utc(),
    numberOfPassengers: 2,
    price: 7
  };
});

test('can get all trips with drivers without a token', async ({
  client,
  assert
}) => {
  const response = await client.get('/api/trips').end();

  const trips = await Trip.query()
    .where('status', 'Pending')
    .with('driver')
    .fetch();

  response.assertStatus(200);
  assert.equal(response.body.data.length, trips.toJSON().length);
});

test('can get a trip by id with driver', async ({ client, assert }) => {
  const response = await client
    .get('/api/trips/1')
    .loginVia(passengerUser, 'jwt')
    .end();

  const trip = await Trip.query()
    .where('id', 1)
    .with('driver')
    .first();

  response.assertStatus(200);
  assert.equal(response.body.data.from, trip.toJSON().from);
  assert.equal(response.body.data.to, trip.toJSON().to);
  assert.equal(response.body.data.driver.id, trip.toJSON().driver.id);
});

test('can filter trips by destinations', async ({ client, assert }) => {
  const response = await client
    .get('/api/trips?from=Copenhagen&to=Oslo')
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body.data.length, 1);
});

test('can filter trips by date', async ({ client, assert }) => {
  const response = await client
    .get('/api/trips?date=2019-12-15')
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body.data.length, 0);
});

test('can filter trips by destination, date and time', async ({
  client,
  assert
}) => {
  const datetime = DateTime.utc().toISO();
  const response = await client
    .get(`/api/trips?to=Oslo&date=2019-12-15${datetime}`)
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body.data.length, 1);
});

test('can get a user trips', async ({ client, assert }) => {
  const response = await client
    .get('/api/trips/user')
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body.status, 'success');
  assert.notEqual(response.body.data.driver, []);
  assert.notEqual(response.body.data.passenger, []);
});

test('passenger user cannot create a trip', async ({ client }) => {
  const response = await client
    .post('api/trips')
    .send(newTrip)
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(403);
  response.assertError(
    'ForbiddenException: Access forbidden. You are not allowed to this resource.'
  );
});

test('driver user can create a trip', async ({ client, assert }) => {
  const response = await client
    .post('api/trips')
    .send(newTrip)
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body.status, 'success');
  assert.equal(response.body.data.from, newTrip.from);
  assert.equal(response.body.data.to, newTrip.to);
  assert.equal(response.body.data.departureTime, newTrip.departureTime.toISO());
  assert.equal(response.body.data.driver_id, driverUser.id);
  assert.equal(response.body.data.status, 'Pending');
  newTrip = response.body.data;
});

test('driver can cancel only his trips', async ({ client, assert }) => {
  newTrip.status = 'Cancelled';

  const response = await client
    .put(`api/trips/${newTrip.id}/cancel`)
    .send(newTrip)
    .loginVia(adminUser, 'jwt')
    .end();

  response.assertStatus(403);
  response.assertError({
    status: 'error',
    message: 'You are not the creator of the trip.'
  });
});

test('driver cannot cancel a trip if the departure date is less that 24h from now', async ({
  client,
  assert
}) => {
  const trip = await Trip.findBy('from', 'Plovdiv');
  assert.equal(trip.status, 'Pending');

  const response = await client
    .put(`api/trips/${newTrip.id}/cancel`)
    .send(newTrip)
    .loginVia(driverUser, 'jwt')
    .end();
  response.assertStatus(400);
  response.assertError({
    status: 'error',
    message: 'You cannot cancel a trip less that 24h before the departure time.'
  });
});

test('driver can cancel a trip', async ({ client, assert }) => {
  const trip = await Trip.findBy('from', 'Sofia');
  assert.equal(trip.status, 'Pending');

  const response = await client
    .put(`api/trips/${trip.id}/cancel`)
    .send(trip)
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body.data.status, 'Cancelled');
});
