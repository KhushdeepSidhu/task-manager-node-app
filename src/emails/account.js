const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, user) => {
  sgMail.send({
    to: email,
    from: 'sidhu.vaudreuil@gmail.com',
    subject: 'Thanks for joining in',
    text: `Welcome to the app ${user}. Let me know how you get along with the app.`,
  });
};

const sendCancelEmail = (email, user) => {
  sgMail.send({
    to: email,
    from: 'sidhu.vaudreuil@gmail.com',
    subject: 'Thanks for using the app.',
    text: `Thanks for being with us ${user}. Hope to see you back soon.`,
  });
};

module.exports = { sendWelcomeEmail, sendCancelEmail };
