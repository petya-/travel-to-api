'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Message extends Model {
  /**
   * A relationship on conversation
   *
   * @method tripRequests
   *
   * @return {Object}
   */
  conversation() {
    return this.belongsTo('App/Models/Conversation');
  }
}

module.exports = Message;
