'use strict';

const adminRole = new Role();
adminRole.name = 'Administrator';
adminRole.slug = 'administrator';
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

module.exports = RoleSeeder;
