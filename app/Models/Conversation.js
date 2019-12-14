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
    return this.hasMany('App/Models/Message', 'id');
  }
}

module.exports = Conversation;
