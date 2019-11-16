const Event = use('Event')
const Mail = use('Mail')

Event.on('new::user', async (user) => {
  await Mail.send('emails.welcome', user.toJSON(), message => {
    message
      .to(user.email)
      .from('<from-email>')
      .subject('Welcome to TravelTo app!');
  });
})
