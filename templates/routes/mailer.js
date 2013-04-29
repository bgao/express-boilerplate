var nodemailer = require('nodemailer');

// Create a SMTP transport object
var transport = nodemailer.createTransport("SMTP", {
  service: 'Gmail',
  auth: {
    user: 'test.nodemailer@gmail.com',
    pass: 'Nodemailer123'
  },
  // debug: true
});

// Message object
var message = {
  // sender info
  from: 'Sender Name <sender@example.com>',
  to: '',
  // subject of the message
  subject: 'Thanks for registering',
  headers: {
    'X-Laziness-level': 1000
  },
  html: ''
}

console.log('SMTP configured');

module.exports = function(user) {
  if (typeof user === 'undefined')
    return;

  // Recipt list
  message.to = user.email;
  // HTML body
  message.html = '<p>Please click the following link to finish your registration:</p>' +
    '<a href=http://localhost:8000/register?token='+user.tokenString+'>' +
    'http://localhost:8000/register?token='+user.tokenString+'</a>';

  console.log('sending email');
  transport.sendMail(message, function(err) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log('Message sent successfully!');
  });
}