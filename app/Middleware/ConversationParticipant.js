'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Conversation = use('App/Models/Conversation');

class ConversationParticipant {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, auth, response }, next) {
    // call next to advance the request
    const { id } = request.params;
    const { user } = auth;

    const conversation = await Conversation.query()
      .where('id', id)
      .where('creator_id', user.id)
      .whereHas('messages', builder => {
        builder.where('sender_id', user.id).orWhere('receiver_id', user.id);
      })
      .first();

    if (!conversation) {
      return response.status(403).json({
        status: 'error',
        message:
          'You are not part of the conversation that you are trying to access.'
      });
    }

    await next();
  }
}

module.exports = ConversationParticipant;
