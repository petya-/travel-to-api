'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TripRequest extends Model {
  /**
   * A relationship on trip
   *
   * @method trip
   *
   * @return {Object}
   */
  trip() {
    return this.belongsTo('App/Models/Trip');
  }

  /**
   * A relationship on conversation
   *
   * @method conversation
   *
   * @return {Object}
   */
  conversation() {
    return this.belongsTo('App/Models/Conversation', 'id', 'trip_request_id');
  }
}

module.exports = TripRequest;
