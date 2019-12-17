'use strict';

const User = (exports = module.exports = {});
const Mail = use('Mail');

User.sendWelcomeEmail = async user => {
  await Mail.send('emails.welcome', user.toJSON(), message => {
    message
      .to(user.email)
      .from('<from-email>')
      .subject('Welcome to TravelTo app!');
  });
};
