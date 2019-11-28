'use strict';
const Permission = use('Permission');
const Role = use('Role');

class PermissionSeeder {
  async run() {
    const createUsersPermission = new Permission()
    createUsersPermission.slug = 'create_users'
    createUsersPermission.name = 'Create Users'
    createUsersPermission.description = 'create users permission'
    await createUsersPermission.save()

    const updateUsersPermission = new Permission()
    updateUsersPermission.slug = 'update_users'
    updateUsersPermission.name = 'Update Users'
    updateUsersPermission.description = 'update users permission'
    await updateUsersPermission.save()

    const deleteUsersPermission = new Permission()
    deleteUsersPermission.slug = 'delete_users'
    deleteUsersPermission.name = 'Delete Users'
    deleteUsersPermission.description = 'delete users permission'
    await deleteUsersPermission.save()

    const readUsersPermission = new Permission()
    readUsersPermission.slug = 'read_users'
    readUsersPermission.name = 'Read Users'
    readUsersPermission.description = 'read users permission'
    await readUsersPermission.save()

    const readUserProfilePermission = new Permission()
    readUserProfilePermission.slug = 'read_user_profile'
    readUserProfilePermission.name = 'Read user profile'
    readUserProfilePermission.description = 'read user profile permission'
    await readUserProfilePermission.save()

    const updateUserProfilePermission = new Permission()
    updateUserProfilePermission.slug = 'update_user_profile'
    updateUserProfilePermission.name = 'Update user profile'
    updateUserProfilePermission.description = 'update user profile permission'
    await updateUserProfilePermission.save()


    const adminRole = await Role.findBy('slug', 'admin')
    await adminRole.permissions().attach([
      createUsersPermission.id,
      updateUsersPermission.id,
      deleteUsersPermission.id,
      readUsersPermission.id,
      readUserProfilePermission.id,
      updateUserProfilePermission.id
    ])

    const driverRole = await Role.findBy('slug', 'driver')
    await driverRole.permissions().attach([

    ])

    const passengerRole = await Role.findBy('slug', 'passenger')
    await passengerRole.permissions().attach([
      createUsersPermission.id,
      readUserProfilePermission.id,
      updateUserProfilePermission.id
    ])
  }
}

module.exports = PermissionSeeder;
