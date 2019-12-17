'use strict';
const { test, trait, before, after } = use('Test/Suite')('Trip');
const User = use('App/Models/User');
const Trip = use('App/Models/Trip');

trait('Test/ApiClient');
trait('Auth/Client');

let passengerUser;

before(async () => {
  passengerUser = await User.findBy('email', 'passenger@travel-to.com');
});

test('can get all trips with drivers withhout a token', async ({
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
