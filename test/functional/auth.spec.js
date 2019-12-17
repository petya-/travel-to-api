'use strict';
const { test, trait, before, after } = use('Test/Suite')('User');
const User = use('App/Models/User');
const Role = use('Role');

trait('Test/ApiClient');
trait('Auth/Client');

// let user;

// before(async () => {
//   user = await User.create({
//     email: 'petyab@gmail.com',
//     password: 'petya',
//     phoneNumber: '+4534421237',
//     name: 'Petya B',
//     emailVerified: true
//   });
// });

// after(async () => {
//   await user.delete();
// });

test('user can signup with email and password and receive an email', async ({
  client
}) => {});
