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

  /**
   * A relationship on user
   *
   * @method tripRequests
   *
   * @return {Object}
   */
  receiver() {
    return this.belongsTo('App/Models/User', 'receiver_id', 'id');
  }

  /**
   * A relationship on user
   *
   * @method tripRequests
   *
   * @return {Object}
   */
  sender() {
    return this.belongsTo('App/Models/User', 'sender_id', 'id');
  }
}

module.exports = Message;
