'use strict';

/*
|--------------------------------------------------------------------------
| PermissionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('Role');

class PermissionSeeder {
  async run() {

    const createUsersPermission = await Factory.model('Adonis/Acl/Permission').create({
      name: 'create_users',
      slug: 'Create Users',
      description: 'create users permission'
    });

    const updateUsersPermission = await Factory.model('Adonis/Acl/Permission').create({
      name: 'update_users',
      slug: 'Update Users',
      description: 'update users permission'
    });

    const deleteUsersPermission = await Factory.model('Adonis/Acl/Permission').create({
      name: 'delete_users',
      slug: 'Delete Users',
      description: 'delete users permission'
    });

    const readUsersPermission = await Factory.model('Adonis/Acl/Permission').create({
      name: 'read_users',
      slug: 'Read Users',
      description: 'read users permission'
    });

    const readUserProfilePermission = await Factory.model('Adonis/Acl/Permission').create({
      name: 'read_user_profile',
      slug: 'Read user profile',
      description: 'read user profile permission'
    });

    const updateUserProfilePermission = await Factory.model('Adonis/Acl/Permission').create({
      name: 'update_user_profile',
      slug: 'Update user profile',
      description: 'update user profile permission'
    });

    const readTripsPermission = await Factory.model('Adonis/Acl/Permission').create({
      name: 'read_trips',
      slug: 'Read all trips',
      description: 'read all trips permission'
    });

    const createTripPermission = await Factory.model('Adonis/Acl/Permission').create({
      name: 'create_trip',
      slug: 'Create a trip',
      description: 'create a trip permission'
    });

    const updateTripPermission = await Factory.model('Adonis/Acl/Permission').create({
      name: 'update_trip',
      slug: 'Update a trip',
      description: 'update a trip permission'
    });

    const readUserTripsPermission = await Factory.model('Adonis/Acl/Permission').create({
      name: 'read_user_trips',
      slug: 'Read user trips',
      description: 'read user trips permission'
    });

    // Assign permissions to roles

    const adminRole = await Role.findBy('slug', 'admin')
    await adminRole.permissions().attach([
      createUsersPermission.id,
      updateUsersPermission.id,
      deleteUsersPermission.id,
      readUsersPermission.id,
      readUserProfilePermission.id,
      updateUserProfilePermission.id,
      readTripsPermission.id,
      createTripPermission.id,
      updateTripPermission.id,
      readUserTripsPermission.id,
    ])

    const driverRole = await Role.findBy('slug', 'driver')
    await driverRole.permissions().attach([
      createTripPermission.id,
      updateTripPermission.id,
      readUserTripsPermission.id
    ])

    const passengerRole = await Role.findBy('slug', 'passenger')
    await passengerRole.permissions().attach([
      createUsersPermission.id,
      readUserProfilePermission.id,
      updateUserProfilePermission.id,
    ])
  }
}

module.exports = PermissionSeeder;
