const { API_KEY, DOMAIN } = require('./config').mailgun;
const fs = require('fs');
const mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });
var confirm = fs.readFileSync('./services/templates/confirm.html', { encoding: 'utf-8' });
confirm = confirm.toString();

exports.sendMail = function ({ email, phrase, url }) {
    confirm = confirm.replace('__PHRASE__', phrase);
    confirm = confirm.replace('__URL__', url);

    var data = {
        from: 'E-SaaS <me@samples.mailgun.org>',
        to: 'camilo.rios.f@gmail.com',
        subject: 'Verify your email address to use E-SaaS',
        text: 'Oops!',
        html: confirm
    };

    mailgun.messages().send(data, function (error, body) {
        if (error) {
            console.log("got an error: ", error);
        } else {
            console.log(body);
        }
    });
}