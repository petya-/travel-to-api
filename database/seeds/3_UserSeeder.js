'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('Role');


class UserSeeder {
  async run() {
    // Passenger users
    const passengerUsers = await Factory.model('App/Models/User').createMany(20)
    const passengerUser = await Factory.model('App/Models/User').create({
      password: 'passenger',
      email: 'passenger@travel-to.com',
    });
    passengerUsers.push(passengerUser);
    const passengerRole = await Role.findBy('slug', 'passenger')

    for (let user of passengerUsers) {
      await user.roles().attach(passengerRole.id)
    }

    // Driver users
    const driverUsers = await Factory.model('App/Models/User').createMany(10)
    const driverUser = await Factory.model('App/Models/User').create({
      password: 'driver',
      email: 'driver@travel-to.com',
    });

    driverUsers.push(driverUser);
    const driverRole = await Role.findBy('slug', 'driver')

    for (let user of driverUsers) {
      await user.roles().attach(driverRole.id)
    }

    // Admin users
    const adminUser = await Factory.model('App/Models/User').create({
      password: 'admin',
      email: 'test@test.com',
    });
    const adminRole = await Role.findBy('slug', 'admin')
    await adminUser.roles().attach(adminRole.id);
  }
}

module.exports = UserSeeder
