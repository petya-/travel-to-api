'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Trip extends Model {

  /**
   * A relationship on users
   *
   * @method trips
   *
   * @return {Object}
   */
  users() {
    return this.belongsTo('App/Models/User', 'id', 'driver_id')
  }

  /**
   * A relationship on trip requests
   *
   * @method tripRequests
   *
   * @return {Object}
   */
  tripRequests() {
    return this.hasMany('App/Models/TripRequest', 'id')
  }
}

module.exports = Trip
