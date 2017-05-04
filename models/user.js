const bcrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../services/config')
const _ = require('lodash');
const mailgun = require('../services/mailgun')
var randomWords = require('random-words');

const UserSchema = new Schema({
  email: String,
  devices: [
    {
      userAgent: String,
      token: String,
      active: { type: Boolean, default: false },
      phrase: String,
      sentAt: Date,
      acceptedAt: Date,
      createdAt: { type: Date, default: Date.now() }
    }
  ],
  createdAt: { type: Date, default: Date.now() },
  companies: [{ type: Schema.Types.ObjectId, ref: 'company' }]
});

UserSchema.virtual('token').get(function () {
  const timestap = new Date().getTime();
  return jwt.encode({ sub: this.id, iat: timestap }, config.secret)
});

UserSchema.statics.addUser = function (email, userAgent) {
  const User = mongoose.model('user');
  return this.findOne({ email })
    .then(user => {

      const phrase = _.startCase(randomWords({ exactly: 3, join: ' ' }))
      const randomToken = require('crypto').randomBytes(64).toString('hex');
      const timestap = new Date().getTime();
      const token = jwt.encode({ sub: randomToken, iat: timestap }, config.secret)
      const url = config.URI + "confirm?email=" + email + "&token=" + randomToken;

      if (user) {
        user.devices.push({ userAgent, token: randomToken, phrase })
        return user.save()
          .then(savedUser => {
            mailgun.sendMail({ email, phrase, url });
            return User.aggregate([
              { $match: { _id: user._id } },
              { $unwind: "$devices" },
              { $match: { "devices.token": randomToken, "devices.phrase": phrase, "devices.userAgent": userAgent } }
            ])
              .then(savedUser => {
                return savedUser[0].devices
              })
          })
      }
      
      const newUser = new User({ email });
      newUser.devices.push({ userAgent, token: randomToken, phrase })

      return newUser.save()
        .then(savedUser => {
          mailgun.sendMail({ email, phrase, url });
          return User.aggregate([
            { $match: { _id: savedUser._id } },
            { $unwind: "$devices" },
            { $match: { "devices.token": randomToken, "devices.phrase": phrase, "devices.userAgent": userAgent } }
          ])
            .then(savedUser => {
              return savedUser[0].devices
            })
        })
    });
}

UserSchema.statics.findCompanies = function (id) {
  return this.findById(id)
    .populate('companies')
    .then(user => user.companies);
}

UserSchema.statics.addCompany = function (id, name) {
  const Company = mongoose.model('company');

  return this.findById(id).populate('companies')
    .then(user => {
      const index = _.findIndex(user.companies, { name })
      if (index >= 0) { throw new Error('Company name in use') }

      const company = new Company({ name, owner: user.id })
      user.companies.push(company)
      return Promise.all([company.save(), user.save()])
        .then(([company, user]) => user);
    });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

mongoose.model('user', UserSchema);