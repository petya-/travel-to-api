'use strict';

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class RoleSeeder {
  async run() {

    const adminRole = await Factory.model('Adonis/Acl/Role').create({
      name: 'Admin',
      slug: 'admin',
      description: 'manage administration privileges'
    });

    const driverRole = await Factory.model('Adonis/Acl/Role').create({
      name: 'Driver',
      slug: 'driver',
      description: 'manage driver privileges'
    });

    const passengerRole = await Factory.model('Adonis/Acl/Role').create({
      name: 'Passenger',
      slug: 'passenger',
      description: 'manage passenger privileges'
    });
  }
}

module.exports = RoleSeeder
