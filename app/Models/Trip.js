'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Trip extends Model {
  static boot() {
    super.boot();
    // Add trait for optional query parameters
    this.addTrait('@provider:Lucid/OptionalQueries');
  }

  /**
   * A relationship on users
   *
   * @method users
   *
   * @return {Object}
   */
  users() {
    return this.belongsTo('App/Models/User');
  }

  /**
   * A relationship on trip requests
   *
   * @method tripRequests
   *
   * @return {Object}
   */
  tripRequests() {
    return this.hasMany('App/Models/TripRequest');
  }

  /**
   * A relationship on conversations
   *
   * @method conversations
   *
   * @return {Object}
   */
  conversations() {
    return this.hasMany('App/Models/Conversation');
  }
}

module.exports = Trip;
