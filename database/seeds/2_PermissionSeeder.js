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
const Factory = use('Factory');
const Role = use('Role');

class PermissionSeeder {
  async run() {
    const createUsersPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'create_users',
      name: 'Create Users',
      description: 'create users permission'
    });

    const updateUsersPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'update_users',
      name: 'Update Users',
      description: 'update users permission'
    });

    const deleteUsersPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'delete_users',
      name: 'Delete Users',
      description: 'delete users permission'
    });

    const readUsersPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'read_users',
      name: 'Read Users',
      description: 'read users permission'
    });

    const readUserProfilePermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'read_user_profile',
      name: 'Read user profile',
      description: 'read user profile permission'
    });

    const updateUserProfilePermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'update_user_profile',
      name: 'Update user profile',
      description: 'update user profile permission'
    });

    const readTripsPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'read_trips',
      name: 'Read all trips',
      description: 'read all trips permission'
    });

    const createTripPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'create_trip',
      name: 'Create a trip',
      description: 'create a trip permission'
    });

    const updateTripPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'update_trip',
      name: 'Update a trip',
      description: 'update a trip permission'
    });

    const readUserTripsPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'read_user_trips',
      name: 'Read user trips',
      description: 'read user trips permission'
    });

    const readTripRequestsPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'read_trip_requests',
      name: 'Read trip requests',
      description: 'read trip requests'
    });

    const readTripRequestPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'read_trip_request',
      name: 'Read trip request',
      description: 'read a single trip request'
    });

    const createTripRequestPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'create_trip_request',
      name: 'Create trip request',
      description: 'create trip request'
    });

    const acceptTripRequestPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'accept_trip_request',
      name: 'Accept trip request',
      description: 'accept trip request'
    });

    const rejectTripRequestPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'reject_trip_request',
      name: 'Reject trip request',
      description: 'reject trip request'
    });

    const cancelTripRequestPermission = await Factory.model(
      'Adonis/Acl/Permission'
    ).create({
      slug: 'cancel_trip_request',
      name: 'Cancel trip request',
      description: 'cancel trip request'
    });

    // Assign permissions to roles

    const adminRole = await Role.findBy('slug', 'admin');
    await adminRole
      .permissions()
      .attach([
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
        readTripRequestPermission.id,
        readTripRequestsPermission.id
      ]);

    const driverRole = await Role.findBy('slug', 'driver');
    await driverRole
      .permissions()
      .attach([
        createTripPermission.id,
        updateTripPermission.id,
        readUserTripsPermission.id,
        readTripRequestPermission.id,
        acceptTripRequestPermission.id,
        rejectTripRequestPermission.id
      ]);

    const passengerRole = await Role.findBy('slug', 'passenger');
    await passengerRole
      .permissions()
      .attach([
        createUsersPermission.id,
        readUserProfilePermission.id,
        updateUserProfilePermission.id,
        readTripsPermission.id,
        readUserTripsPermission.id,
        readTripRequestPermission.id,
        createTripRequestPermission.id,
        cancelTripRequestPermission.id
      ]);
  }
}

module.exports = PermissionSeeder;
