'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Review = use('App/Models/Review');

/**
 * Resourceful controller for interacting with reviews
 */
class ReviewController {
  /**
   * Show a list of all reviews.
   * GET reviews
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async index({ response, auth }) {
    try {
      const user = auth.user;

      const reviews = await Review.query()
        .whereHas('trip', builder => {
          builder.where('driver_id', user.id);
        })
        .with('user')
        .fetch();
      return response.json({
        status: 'success',
        data: reviews
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message:
          'There was a problem while getting the user reviews, please try again later.'
      });
    }
  }

  /**
   * Create/save a new review.
   * POST reviews
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async store({ request, response, auth }) {
    try {
      const review = await auth.user.reviews().create({
        text: request.input('text'),
        trip_id: request.input('trip_id')
      });

      return response.json({
        status: 'success',
        data: review
      });
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message:
          'There was a problem while creating the review, please try again later.'
      });
    }
  }
}

module.exports = ReviewController;
