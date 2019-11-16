'use strict'

const UserHook = exports = module.exports = {}
const Hash = use('Hash')

UserHook.hashPassword = async (userInstance) => {
  if (userInstance.dirty.password) {
    userInstance.password = await Hash.make(userInstance.password)
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
