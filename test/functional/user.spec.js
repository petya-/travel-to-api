'use strict';
const { test, trait, before, after } = use('Test/Suite')('User');
const User = use('App/Models/User');
const Role = use('Role');

trait('Test/ApiClient');
trait('Auth/Client');

let adminUser, driverUser, randomUser, passengerUser;

before(async () => {
  adminUser = await User.findBy('email', 'admin@travel-to.com');
  driverUser = await User.findBy('email', 'driver@travel-to.com');
  passengerUser = await User.findBy('email', 'passenger@travel-to.com');
  randomUser = await User.first();
});

test('cannot get list of users without a token', async ({ client }) => {
  const response = await client.get('api/users').end();

  response.assertStatus(401);
  response.assertError([
    'InvalidJwtToken: E_INVALID_JWT_TOKEN: jwt must be provided'
  ]);
});

test('get list of users if the user authorized and has admin permissions', async ({
  client
}) => {
  const response = await client
    .get('api/users')
    .loginVia(adminUser, 'jwt')
    .end();

  const users = await User.all();
  response.assertStatus(200);

  response.assertJSON({
    status: 'success',
    data: users.toJSON()
  });
});

test('user can get his profile', async ({ client, assert }) => {
  const response = await client
    .get('api/user')
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  driverUser.role = 'driver';

  response.assertJSON({
    status: 'success',
    data: driverUser.toJSON()
  });
});

test('user can update his profile', async ({ client, assert }) => {});
test('user can change his password', async ({ client, assert }) => {});

test('passenger user can become a driver', async ({ client, assert }) => {
  let roles = await randomUser.getRoles();

  assert.include(roles, 'passenger');
  assert.notInclude(roles, 'driver');

  const response = await client
    .put(`api/users/${randomUser.id}/becomeDriver`)
    .loginVia(randomUser, 'jwt')
    .end();

  response.assertStatus(200);
  randomUser.role = 'driver';

  response.assertJSON({
    status: 'success',
    data: randomUser.toJSON()
  });

  roles = await randomUser.getRoles();
  assert.include(roles, 'passenger');
  assert.include(roles, 'driver');
});

test('user can report another user', async ({ client, assert }) => {
  const response = await client
    .post(`api/users/report`)
    .send({
      reason: 'He did not show up for the trip',
      user_id: randomUser.id
    })
    .loginVia(passengerUser, 'jwt')
    .end();

  response.assertStatus(200);
  assert.equal(response.body.data.reporter_id, passengerUser.id);
  assert.equal(response.body.data.reported_id, randomUser.id);
});
