'use strict';
const { test, trait, before, after } = use('Test/Suite')('User');
const User = use('App/Models/User');
const Role = use('Role');

trait('Test/ApiClient');
trait('Auth/Client');

let user;

before(async () => {
  user = await User.create({
    email: 'petyab@gmail.com',
    password: 'petya',
    phoneNumber: '+4534421237',
    name: 'Petya B',
    emailVerified: true
  });
});

after(async () => {
  await user.delete();
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
  const adminRole = await Role.findBy('slug', 'admin');
  await user.roles().attach([adminRole.id]);
  const response = await client
    .get('api/users')
    .loginVia(user, 'jwt')
    .end();

  const users = await User.all();
  response.assertStatus(200);

  response.assertJSON({
    status: 'success',
    data: users.toJSON()
  });
});
