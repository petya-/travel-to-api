'use strict';
const Notification = use('App/Models/Notification');
const { DateTime } = require('luxon');

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
      return response.status(500).json({
        status: 'error',
        message: 'An error occurred while getting user notifications.'
      });
    }
  }

  /**
   * Mark notification as read
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
      const notification = await Notification.find(id);

      if (!notification) {
        return response.status(404).json({
          status: 'error',
          message: 'The notification does not exist.'
        });
      }

      if (notification.user_id !== user.id) {
        return response.status(403).json({
          status: 'error',
          message:
            'Cannot mark as read a notification that is not addressed to you!'
        });
      }

      notification.read = DateTime.utc();
      await notification.save();

      return response.status(200).json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      return response.status(500).json({
        status: 'success',
        data: 'There was an error while marking the notification as read'
      });
    }
  }
}

module.exports = NotificationController;
