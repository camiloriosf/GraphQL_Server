const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
const User = mongoose.model('user');

const CompanySchema = new Schema({
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'user' },
  transfers:
  [
    {
      user: { type: Schema.Types.ObjectId, ref: 'user' },
      active: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now() },
      cancelledAt: Date,
      acceptedAt: Date,
      rejectedAt: Date
    }
  ],
  createdAt: { type: Date, default: Date.now() },
  active: { type: Boolean, default: true },
  collaborators: [
    {
      email: String,
      user: { type: Schema.Types.ObjectId, ref: 'user' },
      active: { type: Boolean, default: false },
      dismissed: { type: Boolean, default: false },
      sentAt: Date,
      acceptedAt: Date,
      rejectedAt: Date,
      leftAt: Date
    }
  ],
  projects: [ { type: Schema.Types.ObjectId, ref: 'project' } ]
});

CompanySchema.statics.findCollaborators = function (id) {
  return this.findById(id)
    .then(company => company.collaborators);
}

CompanySchema.statics.rename = function (id, name, userId) {
  const Company = mongoose.model('company');

  return this.findOne({ name })
    .then(company => {
      if (company) { throw new Error('Company name in use') }
      return Company.findById(id)
        .then(company => {
          company.name = name;
          return company.save()
            .then(company => company)
        })
    })
}

CompanySchema.statics.deactivate = function (id) {
  const Company = mongoose.model('company');

  return Company.findById(id)
    .then(company => {
      company.active = false;
      return company.save()
        .then(company => company)
    })
}

CompanySchema.statics.activate = function (id) {
  const Company = mongoose.model('company');

  return Company.findById(id)
    .then(company => {
      company.active = true;
      return company.save()
        .then(company => company)
    })
}

CompanySchema.statics.addCollaborators = function (id, emails) {
  return this.findById(id)
    .populate('owner')
    .then(company => {
      emails.forEach(function (email) {
        const index = _.findIndex(company.collaborators, { email })
        if (index < 0 && validateEmail(email) && company.owner.email != email) { company.collaborators.push({ email }) }
        else { company.collaborators[index].dismissed = false }
      }, this);
      return company.save()
        .then(company => company)
    })
}

CompanySchema.statics.dismissCollaborators = function (id, emails) {
  return this.findById(id)
    .then(company => {
      company.collaborators.forEach((collaborator) => {
        if (emails.includes(collaborator.email)) {
          collaborator.dismissed = true;
        }
      })
      return company.save()
        .then(company => company)
    })
}

CompanySchema.statics.acceptInvitation = function (id, userId) {
  return Promise.all([this.findById(id), User.findById(userId)])
    .then(([company, user]) => {
      company.collaborators.forEach((collaborator) => {
        if (collaborator.email == user.email) {
          collaborator.active = true;
          collaborator.acceptedAt = Date.now()
        }
      })
      user.companies.push(company);
      return Promise.all([company.save(), user.save()])
        .then(([company, user]) => user);
    })
}

CompanySchema.statics.leave = function (id, email, userId) {
  return this.findById(id)
    .then(company => {
      company.collaborators.forEach((collaborator) => {
        if (collaborator.email == email) {
          collaborator.active = false;
          collaborator.leftAt = Date.now()
        }
      })
      return Promise.all([company.save(), User.findById(userId)])
        .then(([company, user]) => user);
    })
}

CompanySchema.statics.transfer = function (id, owner, newOwner) {
  return Promise.all([this.findOne({ _id: id, owner }), User.findById(newOwner)])
    .then(([company, user]) => {
      if (!company || !user) { throw new Error('Not authorized') }

      company.transfers.forEach((transfer) => {
        transfer.active = false;
        if (transfer.acceptedAt == null && transfer.rejectedAt == null) { transfer.cancelledAt = Date.now() }
      });
      collaborator = _.find(company.collaborators, { 'email': user.email })
      if (!collaborator.active) { throw new Error('User is not a collaborator') }
      company.transfers.push({ user: user._id })

      return company.save()
        .then(company => company);
    })
}

CompanySchema.statics.cancelTransfer = function (id, owner) {
  return this.findOne({ _id: id, owner })
    .then(company => {
      if (!company) { throw new Error('Not authorized') }

      company.transfers.forEach((transfer) => {
        transfer.active = false;
        if (transfer.acceptedAt == null && transfer.rejectedAt == null) { transfer.cancelledAt = Date.now() }
      });

      return company.save()
        .then(company => company);
    })
}

CompanySchema.statics.rejectTransfer = function (id, rejectedOwner) {
  return this.findOne({ _id: id })
    .then(company => {
      if (!company) { throw new Error('Not authorized') }

      company.transfers.forEach((transfer) => {
        if (transfer.user.equals(rejectedOwner)) {
          transfer.active = false;
          if (transfer.acceptedAt == null && transfer.cancelledAt == null) { transfer.rejectedAt = Date.now() }
        }
      });

      return company.save()
        .then(company => company);
    })
}

CompanySchema.statics.acceptTransfer = function (id, newOwner) {
  return Promise.all([this.findOne({ _id: id }), User.findById(newOwner)])
    .then(([company, user]) => {
      transfer = _.find(company.transfers, { user: user._id, active: true })
      if (!transfer) { throw new Error('Invalid action') }
      transfer.active = false
      transfer.acceptedAt = Date.now();
      company.owner = user
      return company.save()
        .then(company => company);
    })
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

mongoose.model('company', CompanySchema);