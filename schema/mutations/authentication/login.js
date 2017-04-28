const graphql = require('graphql');
const {
  GraphQLObject,
  GraphQLString,
  GraphQLNonNull
} = graphql;
const UserType = require('../../types/user_type');
const AuthService = require('../../../services/auth');

module.exports = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve(parentValue, { email, password }, req) {
    return AuthService.login({ email, password, req });
  }
};