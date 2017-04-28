const mongoose = require('mongoose');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = graphql;
const UserType = require('../../types/user_type');
const AuthService = require('../../../services/auth');
const User = mongoose.model('user');

module.exports = {
  type: UserType,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    token: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve(parentValue, { name, token }, req) {
    return AuthService.checkUser({ token, req })
      .then(user => {
        if (user) {
          return User.addCompany(user.id, name)
        }
      })
  }
};