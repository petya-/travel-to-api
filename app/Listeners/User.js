'use strict';

const User = (exports = module.exports = {});
const Mail = use('Mail');

User.sendWelcomeEmail = async (user, token) => {
  await Mail.send('emails.welcome', { user, token }, message => {
    message
      .from('<from-email>')
      .to(user.email)
      .subject('Welcome to TravelTo app!');
  });
};
