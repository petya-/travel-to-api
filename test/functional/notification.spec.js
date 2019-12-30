'use strict';
const { test, trait, before, after } = use('Test/Suite')('User');
const User = use('App/Models/User');
const Role = use('Role');

trait('Test/ApiClient');
trait('Auth/Client');

let passengerUser, driverUser;

before(async () => {
  passengerUser = await User.findBy('email', 'passenger@travel-to.com');
  driverUser = await User.findBy('email', 'driver@travel-to.com');
});

test('user can get a list of his notifications', async ({ client }) => {
  const response = await client
    .get('api/notifications')
    .loginVia(driverUser, 'jwt')
    .end();

  response.assertStatus(200);
  response.assertError({
    status: 'success',
    data: []
  });
});
