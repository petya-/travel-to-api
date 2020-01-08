'use strict';
const Conversation = use('App/Models/Conversation');
const Message = use('App/Models/Message');
const Event = use('Event');

const { broadcastMessage } = require('../../utils/socket.utils');
const { DateTime } = require('luxon');

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
        .whereHas('messages', builder => {
          builder.where('sender_id', user.id).orWhere('receiver_id', user.id);
        })
        .where('active', true)
        .with('messages')
        .with('messages.sender')
        .with('messages.receiver')
        .with('trip')
        .with('tripRequest')
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
   * Get a single conversation.
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
        .with('messages.sender')
        .with('messages.receiver')
        .with('trip')
        .with('tripRequest')
        .first();

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
      const { id } = params;
      const { user } = auth;

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

      broadcastMessage(conversation.id, 'room:newMessage', newMessage);
      // call new:message event
      Event.fire('new::message', message, request, auth.user);

      return response.status(200).json({
        status: 'success',
        data: newMessage
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'There was an error while creating the message'
      });
    }
  }

  /**
   * Mark message as read
   * PUT messages/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Params} ctx.params
   * @param {Auth} ctx.auth
   */
  async markAsRead({ response, params, auth }) {
    const { id } = params;
    const { user } = auth;

    try {
      const message = await Message.find(id);

      if (!message) {
        return response.status(404).json({
          status: 'error',
          message: 'The message does not exist.'
        });
      }

      if (message.receiver_id !== user.id) {
        return response.status(403).json({
          status: 'error',
          message: 'Cannot mark as read a message that is not addressed to you!'
        });
      }

      message.read = DateTime.utc();
      await message.save();

      return response.status(200).json({
        status: 'success',
        data: message
      });
    } catch (error) {
      return response.status(500).json({
        status: 'success',
        data: 'There was an error while marking the message as read'
      });
    }
  }

  /**
   * Close conversation
   * PUT conversations/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Params} ctx.params
   * @param {Auth} ctx.auth
   */
  async update({ response, params, auth }) {
    const { id } = params;
    const { user } = auth;

    try {
      const conversation = await Conversation.find(id);
      if (!conversation) {
        return response.status(404).json({
          status: 'error',
          message: 'The conversation does not exist.'
        });
      }

      conversation.active = false;
      await conversation.save();
      return response.status(200).json({
        status: 'success',
        data: conversation
      });
    } catch (error) {
      return response.status(500).json({
        status: 'success',
        data: 'There was an error while closing the conversation'
      });
    }
  }
}

module.exports = ConversationController;
