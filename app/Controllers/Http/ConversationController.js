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
      const { user } = auth;
      const conversations = await Conversation.query()
        .where('creator_id', user.id)
        .where('active', true)
        .whereHas('messages', builder => {
          builder.where('sender_id', user.id).orWhere('receiver_id', user.id);
        })
        .with('messages')
        .orderBy('created_at', 'desc')
        .fetch();

      return { status: 'success', data: conversations };
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
      return { status: 'success', data: conversation };
    } catch (error) {
      return response
        .status(500)
        .json({ status: 'error', message: error.message });
    }
  }

  /**
   * Create a new message
   * POST conversations/:id/message
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Params} ctx.params
   */
  async createMessage({ request, response, params, auth }) {
    try {
      const message = request.input('message');
      const receiver_id = request.input('receiver_id');

      const user = auth.user;
      // Conversation id from params
      const { id } = params;
      const conversation = await Conversation.findOrFail(id);

      if (!conversation) {
        return response
          .status(404)
          .json({ status: 'error', message: 'No conversation found!' });
      }

      const newMessage = await conversation.messages().create({
        message,
        sender_id: user.id,
        receiver_id,
        conversation_id: conversation.id
      });

      broadcast(conversation.id, 'room:newMessage', newMessage);

      return response.status(200).json({
        status: 'success',
        data: newMessage
      });
    } catch (error) {
      console.log(error.message);
      return response.status(500).json({
        status: 'error',
        message: 'There was an error while creating the message'
      });
    }
  }
}

module.exports = ConversationController;
