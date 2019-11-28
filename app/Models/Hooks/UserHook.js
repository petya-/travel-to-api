'use strict'

const UserHook = exports = module.exports = {}
const Hash = use('Hash')
const Role = use('Role')

UserHook.hashPassword = async (userInstance) => {
  if (userInstance.dirty.password) {
    userInstance.password = await Hash.make(userInstance.password)
  }
}

UserHook.attachPassengerRole = async (userInstance) => {
  const roles = await userInstance.getRoles();
  if (!roles.includes('passenger')) {
    try {
      const passengerRole = await Role.findBy('slug', 'passenger');
      await userInstance.roles().attach(passengerRole.id);
    } catch (error) {
      throw error;
    }
  }
}

UserHook.isEnabled = async (userInstance) => {
  if (!userInstance.enabled) {
    throw new Error("You've been banned from the system!")
  }
}

UserHook.isVerified = async (userInstance) => {
  if (!userInstance.emailVerified) {
    throw new Error("Your email address is not confirmed!")
  }
}
