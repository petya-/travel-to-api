'use strict';
const { test, trait, before, after } = use('Test/Suite')('Authenthication');
const User = use('App/Models/User');
const Role = use('Role');

trait('Test/ApiClient');
trait('Auth/Client');

let adminUser;

before(async () => {
  adminUser = await User.findBy('email', 'admin@travel-to.com');
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
