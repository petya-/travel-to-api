'use strict'
const User = use('App/Models/User');


class AuthController {
  /**
   *
   *
   * @param {*} {
   *     request,
   *     auth,
   *     response
   *   }
   * @returns
   * @memberof AuthController
   */
  async register({
    request,
    auth,
    response
  }) {
    const username = request.input("username")
    const email = request.input("email")
    const password = request.input("password")

    let user = new User()
    user.username = username
    user.email = email
    user.password = password

    user = await user.save()
    const accessToken = await auth.generate(user)

    response.json({
      "user": user,
      "access_token": accessToken
    })
  }

  async login({
    request,
    auth,
    response
  }) {
    const email = request.input("email")
    const password = request.input("password");
    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email)
        let accessToken = await auth.generate(user)
        response.json({
          "user": user,
          "access_token": accessToken
        })
      }

    } catch (e) {
      response.json({
        message: 'You first need to register!'
      })
    }
  }
}

module.exports = AuthController
