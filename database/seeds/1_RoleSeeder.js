'use strict';
const Role = use('Role');

class RoleSeeder {
  async run() {
    const adminRole = new Role();
    adminRole.name = 'Admin';
    adminRole.slug = 'admin';
    adminRole.description = 'manage administration privileges';
    await adminRole.save();

    const driverRole = new Role();
    driverRole.name = 'Driver';
    driverRole.slug = 'driver';
    driverRole.description = 'manage driver privileges';
    await driverRole.save();

    const passengerRole = new Role();
    passengerRole.name = 'Passenger';
    passengerRole.slug = 'passenger';
    passengerRole.description = 'manage passenger privileges';
    await passengerRole.save();
  }
}

module.exports = RoleSeeder
