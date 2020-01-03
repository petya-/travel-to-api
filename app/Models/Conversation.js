'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Conversation extends Model {
  /**
   * A relationship on messages
   *
   * @method tripRequests
   *
   * @return {Object}
   */
  messages() {
    return this.hasMany('App/Models/Message');
  }

  /**
   * A relationship on tripReuqest
   *
   * @method conversation
   *
   * @return {Object}
   */
  tripRequest() {
    return this.belongsTo('App/Models/TripRequest');
  }

  /**
   * A relationship on conversation
   *
   * @method conversation
   *
   * @return {Object}
   */
  trip() {
    return this.belongsTo('App/Models/Trip');
  }
}

module.exports = Conversation;
