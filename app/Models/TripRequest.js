'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TripRequest extends Model {
  /**
   * A relationship on trip
   *
   * @method tripRequests
   *
   * @return {Object}
   */
  trip() {
    return this.belongsTo('App/Models/Trip', 'id');
  }
}

module.exports = TripRequest;
