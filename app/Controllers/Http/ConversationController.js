'use strict';
const Conversation = use('App/Models/Conversation');
const { broadcast } = require('../../utils/socket.utils');

class ConversationController {
  /**
   * Show a list of all conversations for user
   * GET conversations
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth

   */
  async indexForUser({ response, auth }) {
    try {
      const { id } = auth.user;
      const conversations = await Conversation.query()
        .where('creator_id', id)
        .where('active', true)
        .whereHas('messages', (builder, id) => {
          builder.where('sender_id', 1).orWhere('receiver_id', 32);
        })
        .with('messages')
        .orderBy('created_at', 'desc')
        .fetch();

      return {
        status: 'success',
        conversations
      };
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'An error occurred while getting user conversations.'
      });
    }
  }

  /**
   * Get a single trip.
   * GET conversations/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Params} ctx.params

   */
  async show({ response, params }) {
    try {
      const { id } = params;
      const conversation = await Conversation.query()
        .where('id', id)
        .with('messages')
        .first();
      // TODO: add check if the user is in conversation
      return {
        status: 'success',
        data: conversation
      };
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
}

// TODO: Add create message route

module.exports = ConversationController;
