'use strict';

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class User extends Model {
  static get hidden() {
    return ['password'];
  }

  static boot() {
    super.boot();

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', 'UserHook.hashPassword');
    this.addHook('afterSave', 'UserHook.attachPassengerRole');
    this.addHook('afterFind', ['UserHook.isEnabled', 'UserHook.isVerified']);
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token');
  }

  /**
   * A relationship on trips
   *
   * @method trips
   *
   * @return {Object}
   */
  trips() {
    return this.hasMany('App/Models/Trip', 'id', 'driver_id');
  }

  /**
   * A relationship on trip requests
   *
   * @method tripRequests
   *
   * @return {Object}
   */
  tripRequests() {
    return this.hasMany('App/Models/TripRequest', 'id');
  }

  /**
   * A relationship on conversations
   *
   * @method tripRequests
   *
   * @return {Object}
   */
  conversations() {
    return this.hasMany('App/Models/Conversation', 'creator_id');
  }

  /**
   * ACL traits
   */
  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ];
  }
}

module.exports = User;
