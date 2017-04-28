const bcrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../services/config')
const _ = require('lodash');

const UserSchema = new Schema({
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now() },
  companies: [{ type: Schema.Types.ObjectId, ref: 'company' }]
});

UserSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

UserSchema.virtual('token').get(function() {
  const timestap = new Date().getTime();
  return jwt.encode({ sub: this.id, iat: timestap }, config.secret)
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

UserSchema.statics.findCompanies = function(id) {
  return this.findById(id)
    .populate('companies')
    .then(user => user.companies);
}

UserSchema.statics.addCompany = function(id, name ) {
  const Company = mongoose.model('company');

  return this.findById(id).populate('companies')
    .then(user => {
      const index = _.findIndex(user.companies, {name})
      if(index >= 0){throw new Error('Company name in use')}

      const company = new Company({ name, owner: user.id })
      user.companies.push(company)
      return Promise.all([company.save(), user.save()])
        .then(([company, user]) => user);
    });
}

mongoose.model('user', UserSchema);