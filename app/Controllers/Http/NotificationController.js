'use strict';

class NotificationController {
  /**
   * Show a list of all notifications for user
   * GET notifications
   *
   * @param {object} ctx
   * @param {Response} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async indexForUser({ response, auth }) {
    try {
      const { user } = auth;
      const notifications = await user.notifications().fetch();

      return { status: 'success', data: notifications.toJSON() };
    } catch (error) {
      console.log(error);

      return response.status(500).json({
        status: 'error',
        message: 'An error occurred while getting user notifications.'
      });
    }
  }
}

module.exports = NotificationController;
